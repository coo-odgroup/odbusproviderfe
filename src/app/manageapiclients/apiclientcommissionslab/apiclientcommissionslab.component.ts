import { Component, OnInit,ViewChild } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { ApiUserCommissionService } from '../../services/apiuser-commission-service.service';
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
  selector: 'app-apiclientcommissionslab',
  templateUrl: './apiclientcommissionslab.component.html',
  styleUrls: ['./apiclientcommissionslab.component.scss']
})
export class ApiclientcommissionslabComponent implements OnInit {

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
  

  constructor(
    private spinner: NgxSpinnerService,
    private ApiUserCommissionService: ApiUserCommissionService,
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

      this.spinner.show();
      this.form = this.fb.group({
        id:[null],
        user_id: [null, Validators.compose([Validators.required])],
        starting_fare: [null, Validators.compose([Validators.required])],
        upto_fare: [null, Validators.compose([Validators.required])],
        commision: [null, Validators.compose([Validators.required])],
        addationalCharges: [null, Validators.compose([Validators.required])],
        cancelCommission: [null, Validators.compose([Validators.required])],
        user_name : localStorage.getItem('USERNAME'),   
      });  
      this.formConfirm=this.fb.group({
        id:[null]
      });

      this.searchForm = this.fb.group({  
       // name: [null], 
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
  }  
  

  search(pageurl="")
  {
    this.spinner.show();
      
    const data = { 
      user_id: this.searchForm.value.user_id,
      rows_number: this.searchForm.value.rows_number,
      // starting_fare: this.searchForm.value.starting_fare,
      // upto_fare: this.searchForm.value.upto_fare,
      // commision:this.searchForm.value.commision, 
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.ApiUserCommissionService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.apiusercommissionslab= res.data.data.data;
          console.log(this.apiusercommissionslab);
          this.pagination= res.data.data;
          this.all= res.data;
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.ApiUserCommissionService.getAllData(data).subscribe(
        res => {
          this.apiusercommissionslab= res.data.data.data;
          //console.log(this.apiusercommissionslab);
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
        starting_fare: ['', Validators.compose([Validators.required])],
        upto_fare: ['', Validators.compose([Validators.required])],
        commision: ['', Validators.compose([Validators.required])],
        addationalCharges: ['', Validators.compose([Validators.required])],
        cancelCommission: ['', Validators.compose([Validators.required])],
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
        starting_fare:this.form.value.starting_fare,
        upto_fare:this.form.value.upto_fare,
        commision:this.form.value.commision,
        addationalCharges:this.form.value.addationalCharges,
        cancelCommission:this.form.value.cancelCommission,
        created_by : localStorage.getItem('USERNAME'),     
    };

    // console.log(data);
    
    if(id==null)
    {
      this.ApiUserCommissionService.create(data).subscribe(
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
    else{     
     
      this.ApiUserCommissionService.update(id,data).subscribe(
        resp => {
          if(resp.status==1)
            {
                this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                //this.closebutton.nativeElement.click();
                this.modalReference.close();
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

  openConfirmDialog(content)
  {
        this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  } 

  title = 'angular-app';
  fileName= 'Agent-Commission.csv';

  exportexcel(): void
  {    
        /* pass here the table id */
        let element = document.getElementById('print-section');
        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        /* save to file */  
        XLSX.writeFile(wb, this.fileName); 
  }

}
