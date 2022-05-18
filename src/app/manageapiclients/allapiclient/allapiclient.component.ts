import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { ApiuserserviceService } from '../../services/apiuserservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import{Constants} from '../../constant/constant';
import { BusOperatorService} from '../../services/bus-operator.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { Apiuser } from 'src/app/model/apiuser';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-allapiclient',
  templateUrl: './allapiclient.component.html',
  styleUrls: ['./allapiclient.component.scss']
})
export class AllapiclientComponent implements OnInit {

  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;

  //@ViewChild("addnew") addnew;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  apiuser: Apiuser[];
  apiuserRecord: Apiuser;
  public isSubmit: boolean;
  public validIFSC:any;
  public ModalHeading:any;
  public ModalBtn:any;
  pagination: any;
  all: any;
  pan_pattern ="/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/";

  constructor(private spinner: NgxSpinnerService,private ApiuserserviceService: ApiuserserviceService,private http: HttpClient,private notificationService: NotificationService,private fb: FormBuilder,private modalService: NgbModal,config: NgbModalConfig,  private busOperatorService:BusOperatorService) { 
      this.isSubmit = false;
      this.apiuserRecord= {} as Apiuser;
      config.backdrop = 'static';
      config.keyboard = false;
      this.ModalHeading = "Add API User";
      this.ModalBtn = "Save";
  }

  OpenModal(content) {
        this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.form = this.fb.group({
        id:[null],
        name: [null, Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.required])],
        phone: [null, Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])],
        password: [null, Validators.compose([Validators.required,Validators.minLength(6)])],
        location: [null, Validators.compose([Validators.required])],
        pancard_no: [null, Validators.compose([Validators.required])],
        organization_name: [null],
        address: [null, Validators.compose([Validators.required])],
        landmark: [null, Validators.compose([Validators.required])],
        pincode: [null, Validators.compose([Validators.required])],
        street: [null, Validators.compose([Validators.required])],
        city: [null, Validators.compose([Validators.required])]      
    });  

    this.formConfirm=this.fb.group({
        id:[null]
    });

    this.searchForm = this.fb.group({  
        name: [null], 
        status: [null], 
        rangeFromDate:[null],
        rangeToDate:[null],
        rows_number: Constants.RecordLimit,
    });
     this.search(); 
  }


  search(pageurl="")
  {
    this.spinner.show();
    const data = { 
        name: this.searchForm.value.name,
        status: this.searchForm.value.status,
        rows_number:this.searchForm.value.rows_number,
        rangeFromDate:this.searchForm.value.rangeFromDate,
        rangeToDate :this.searchForm.value.rangeToDate      
    };
   
    // console.log(data);
    if(pageurl!="")
    {
          this.ApiuserserviceService.getAllaginationData(pageurl,data).subscribe(
            res => {
              this.apiuser= res.data.data.data;
              this.pagination= res.data.data;
              this.all= res.data;
              this.spinner.hide();
            }
          );
    }
    else
    {
        this.ApiuserserviceService.getAllData(data).subscribe(
            res => {
                this.apiuser= res.data.data.data;
                this.pagination= res.data.data;
                this.all= res.data;
                console.log(this.apiuser);
                this.spinner.hide();
            }
        );
    }
  }


  refresh()
   {
     this.spinner.show();
     this.searchForm = this.fb.group({  
      name: [null], 
      status: [null], 
      rows_number: Constants.RecordLimit,
      rangeFromDate:[null],
      rangeToDate:[null]
    });
     this.search();
   }


  
  ResetAttributes()
  {
    this.apiuserRecord = {
      name:'',
      email:'',
      phone:'',
      password:'',
      user_type:'',
      location:'',     
      pancard_no:'',
      organization_name:'',
      address:'',
      landmark:'',
      pincode:''
    } as Apiuser;
    this.form = this.fb.group({
      id:[null],
      name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phone: [null, Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])],
      password: [null, Validators.compose([Validators.required,Validators.minLength(6)])],
      location: [null, Validators.compose([Validators.required])],     
      pancard_no: [null, Validators.compose([Validators.required])],
      organization_name: [null],
      address: [null, Validators.compose([Validators.required])],
      landmark: [null, Validators.compose([Validators.required])],
      pincode: [null, Validators.compose([Validators.required])],
      street: [null, Validators.compose([Validators.required])],
      city: [null, Validators.compose([Validators.required])]
    });
    this.ModalHeading = "Add API User";
    this.ModalBtn = "Save";
  }
  
  addAgent(){  

    this.spinner.show();
    let id:any=this.apiuserRecord.id;  
    const data = {
      name:this.form.value.name,
      email:this.form.value.email,
      phone:this.form.value.phone,
      password:this.form.value.password,
      location:this.form.value.location,
      pancard_no:this.form.value.pancard_no,
      organization_name:this.form.value.organization_name,
      address:this.form.value.address,
      landmark:this.form.value.landmark,
      city:this.form.value.city,
      street:this.form.value.street,
      pincode:this.form.value.pincode,
      created_by: localStorage.getItem('USERNAME') 
      
    };
    // console.log(data);
    if(id==null)
    {
      this.ApiuserserviceService.create(data).subscribe(
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
     
      this.ApiuserserviceService.update(id,data).subscribe(
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
  editAgent(event : Event, id : any)
  {
    this.apiuserRecord=this.apiuser[id] ;
    this.form = this.fb.group({
      id:[this.apiuserRecord.id],
      name: [this.apiuserRecord.name, Validators.compose([Validators.required])],
      email: [this.apiuserRecord.email,Validators.compose([Validators.required])],
      phone: [this.apiuserRecord.phone,Validators.compose([Validators.required])],
      password: [this.apiuserRecord.password,Validators.compose([Validators.required])],
      user_type: [this.apiuserRecord.user_type,Validators.compose([Validators.required])],
      location: [this.apiuserRecord.location,Validators.compose([Validators.required])],
      pancard_no: [this.apiuserRecord.pancard_no,Validators.compose([Validators.required])],
      organization_name: [this.apiuserRecord.organization_name,Validators.compose([Validators.required])],
      address: [this.apiuserRecord.address,Validators.compose([Validators.required])],
      landmark: [this.apiuserRecord.landmark,Validators.compose([Validators.required])],
      pincode: [this.apiuserRecord.pincode,Validators.compose([Validators.required])],
      street: [this.apiuserRecord.street,Validators.compose([Validators.required])],
      city: [this.apiuserRecord.city,Validators.compose([Validators.required])],
      
    });
    this.ModalHeading = "Edit ApiUser";
    this.ModalBtn = "Update";
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  changeStatus(event : Event, stsitem:any)
  { 
    const data = {
      created_by: localStorage.getItem('USERNAME'),
      id:stsitem
    }
    // console.log(data);
    // return;

    this.spinner.show();
    this.ApiuserserviceService.chngsts(data).subscribe(
      resp => {
        if(resp.status==1)
        {
            //this.closebutton.nativeElement.click();
            this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
            this.refresh();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
      }
    );
  }
  

  title = 'angular-app';
  fileName= 'Agent-Agent.xlsx';

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
