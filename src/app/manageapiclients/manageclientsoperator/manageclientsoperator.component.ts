import { Component, OnInit,ViewChild } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { ManageclientsoperatorService } from '../../services/manageclientsoperator.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Apiusercommissionslab} from '../../model/apiusercommissionslab';
import { Subject } from 'rxjs';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";
import { BusOperatorService } from './../../services/bus-operator.service';


@Component({
  selector: 'app-manageclientsoperator',
  templateUrl: './manageclientsoperator.component.html',
  styleUrls: ['./manageclientsoperator.component.scss']
})
export class ManageclientsoperatorComponent implements OnInit {

  
  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  
  @ViewChild("addnew") addnew;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  apiusercommissionslab: Apiusercommissionslab[];
  aapiusercommissionslabRecord: Apiusercommissionslab;
  public isSubmit: boolean;

  public ModalHeading:any;
  public ModalBtn:any;
  pagination: any;
  all: any;
  allagent: any;
  busoperators: any;


constructor(
  private spinner: NgxSpinnerService,
  private ManageclientsoperatorService: ManageclientsoperatorService,
  private http: HttpClient,
  private notificationService: NotificationService,
  private fb: FormBuilder,
  private modalService: NgbModal,
  config: NgbModalConfig,
  private busOperatorService: BusOperatorService, ) 
  {
      this.isSubmit = false;
      this.aapiusercommissionslabRecord= {} as Apiusercommissionslab;
      config.backdrop = 'static';
      config.keyboard = false;
      this.ModalHeading = "Add Agent Commission Slab";
      this.ModalBtn = "Save";
}

OpenModal(content) {
  this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
}

ngOnInit(): void {

    // this.spinner.show();
    this.form = this.fb.group({
      id:[null],
      user_id: [null, Validators.compose([Validators.required])],
      bus_operator_id: [null, Validators.compose([Validators.required])],
      user_name : localStorage.getItem('USERNAME'),   
    });  
    this.formConfirm=this.fb.group({
      id:[null]
    });

    this.searchForm = this.fb.group({ 
      user_id:[null],
      rows_number: Constants.RecordLimit,
    });
    this.loadServices();
    this.search(); 
}

page(label:any){
  return label;
 }

 loadServices() {

  this.busOperatorService.getApiClient().subscribe(
    res => {
      this.allagent = res.data;       
    }
  );
  this.busOperatorService.readAll().subscribe(
    res => {
      this.busoperators = res.data;
      this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });
    }
  );
}  


search(pageurl="")
{
  this.spinner.show();
    
  const data = { 
    user_id: this.searchForm.value.user_id,
    rows_number: this.searchForm.value.rows_number
  };
 
  // console.log(data);
  if(pageurl!="")
  {
    this.ManageclientsoperatorService.getAllaginationData(pageurl,data).subscribe(
      res => {
        this.apiusercommissionslab= res.data.data.data;
        // console.log(this.apiusercommissionslab);
        this.pagination= res.data.data;
        this.all= res.data;
        this.spinner.hide();
      }
    );
  }
  else
  {
    this.ManageclientsoperatorService.getAllData(data).subscribe(
      res => {
        this.apiusercommissionslab= res.data.data.data;
        // console.log(this.apiusercommissionslab);
        this.pagination= res.data.data;
        this.all= res.data;
        this.spinner.hide();
      }
    );
  }
}

refresh()
{
    this.spinner.show();

    this.searchForm = this.fb.group({  
      user_id: [null],
      starting_fare: [null], 
      upto_fare: [null],  
      commision: Constants.RecordLimit,
    });
    this.search();
}  
ResetAttributes()
{
    this.aapiusercommissionslabRecord = {
      user_id:'',
      starting_fare:'',
      upto_fare:'',
      commision:''
    } as Apiusercommissionslab;
    this.form = this.fb.group({
      id:[null],
      user_id: ['', Validators.compose([Validators.required])],
      bus_operator_id: ['', Validators.compose([Validators.required])],
      user_name : localStorage.getItem('USERNAME'),   
    });
    this.ModalHeading = "Add Commission Slab";
    this.ModalBtn = "Save";
}

addCommissionSlab()
{  

  this.spinner.show();

  let id:any=this.aapiusercommissionslabRecord.id;  
  const data = {
      user_id: this.form.value.user_id,
      bus_operator_id:this.form.value.bus_operator_id,
      created_by : localStorage.getItem('USERNAME'),     
  };

  // console.log(data);
  // return;

    this.ManageclientsoperatorService.create(data).subscribe(
      resp => {
     if(resp.status==1)
     {
          this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
          this.modalReference.close();
          //this.closebutton.nativeElement.click();
          this.ResetAttributes();
          this.search();          
     }
     else
     {
          this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
          this.spinner.hide();
     }
    });    

}

editAgentCommission(event : Event, id : any)
{
    this.aapiusercommissionslabRecord=this.apiusercommissionslab[id] ;
    console.log(this.aapiusercommissionslabRecord);

    this.form = this.fb.group({
      id:[this.aapiusercommissionslabRecord.id],
      user_id: [this.aapiusercommissionslabRecord.user_id, Validators.compose([Validators.required])],
      starting_fare: [this.aapiusercommissionslabRecord.starting_fare, Validators.compose([Validators.required])],
      upto_fare: [this.aapiusercommissionslabRecord.upto_fare,Validators.compose([Validators.required])],
      commision: [this.aapiusercommissionslabRecord.commision,Validators.compose([Validators.required])],
      addationalCharges: [this.aapiusercommissionslabRecord.addationalcharges,Validators.compose([Validators.required])],
      cancelCommission: [this.aapiusercommissionslabRecord.cancellation_commission,Validators.compose([Validators.required])],
      user_name : localStorage.getItem('USERNAME'),   
    });
    this.ModalHeading = "Edit Agent Commission Slab";
    this.ModalBtn = "Update";
}

openConfirmDialog(content,i)
{
      this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
      this.aapiusercommissionslabRecord=this.apiusercommissionslab[i] ;
      // console.log(this.aapiusercommissionslabRecord.id);

} 

deleteRecord()
{
  this.spinner.show()
  let delitem=this.aapiusercommissionslabRecord.id;

   this.ManageclientsoperatorService.delete(delitem).subscribe(
    resp => {
      if(resp.status==1)
          {
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
              this.confirmDialogReference.close();
              this.refresh();
              this.spinner.hide()
          }
          else{
             
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
            this.spinner.hide();
          }
    }); 
}

}
