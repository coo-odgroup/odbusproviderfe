import { Component, OnInit,ViewChild } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { AgentserviceService } from '../../services/agentservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import{Constants} from '../../constant/constant';
import { BusOperatorService} from '../../services/bus-operator.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { Agent } from 'src/app/model/agent';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {

  
  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;



  //@ViewChild('closebutton') closebutton;
  @ViewChild("addnew") addnew;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  agents: Agent[];
  agentRecord: Agent;
  public isSubmit: boolean;
  public validIFSC:any;
  public ModalHeading:any;
  public ModalBtn:any;
  pagination: any;
  all: any;
  pan_pattern ="/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/";

  constructor(private spinner: NgxSpinnerService,private AgentserviceService: AgentserviceService,private http: HttpClient,private notificationService: NotificationService,private fb: FormBuilder,private modalService: NgbModal,config: NgbModalConfig,  private busOperatorService:BusOperatorService) {
    this.isSubmit = false;
    this.agentRecord= {} as Agent;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Agent";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }

   ngOnInit() { 
    this.spinner.show();
    this.form = this.fb.group({
      id:[null],
      name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phone: [null, Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])],
      password: [null, Validators.compose([Validators.required,Validators.minLength(6)])],
      location: [null, Validators.compose([Validators.required])],
      adhar_no: [null, Validators.compose([ Validators.required,Validators.minLength(12),Validators.maxLength(12)])],
      pancard_no: [null, Validators.compose([Validators.required])],
      organization_name: [null],
      address: [null, Validators.compose([Validators.required])],
      landmark: [null, Validators.compose([Validators.required])],
      pincode: [null, Validators.compose([Validators.required])],
      street: [null, Validators.compose([Validators.required])],
      city: [null, Validators.compose([Validators.required])],
      name_on_bank_account: [null],
      bank_name: [null],
      ifsc_code: [null],
      bank_account_no: [null],
      
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

  page(label:any){
    return label;
   }
   checkIfsc()
   {
     let ifsc=this.form.value.ifsc_code;
     if(ifsc!="")
     {
       this.busOperatorService.getIFSC(ifsc).subscribe(
 
         resp => {
           this.validIFSC=resp.ADDRESS + ',' +resp.STATE;
         }
         ,
         error => {
           this.validIFSC="INVALID VALID IFSC CODE";
           
         }
       );
     }
     else
     {
       this.validIFSC="";
     }
     
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
      this.AgentserviceService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.agents= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.AgentserviceService.getAllData(data).subscribe(
        res => {
          this.agents= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;
          // console.log(this.agents);
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
    this.agentRecord = {
      name:'',
      email:'',
      phone:'',
      password:'',
      user_type:'',
      location:'',
      adhar_no:'',
      pancard_no:'',
      organization_name:'',
      address:'',
      landmark:'',
      pincode:'',
      name_on_bank_account:'',
      bank_name:'',
      ifsc_code:'',
      bank_account_no:'',
      
    } as Agent;
    this.form = this.fb.group({
      id:[null],
      name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phone: [null, Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])],
      password: [null, Validators.compose([Validators.required,Validators.minLength(6)])],
      location: [null, Validators.compose([Validators.required])],
      adhar_no: [null, Validators.compose([ Validators.required,Validators.minLength(12),Validators.maxLength(12)])],
      pancard_no: [null, Validators.compose([Validators.required])],
      organization_name: [null],
      address: [null, Validators.compose([Validators.required])],
      landmark: [null, Validators.compose([Validators.required])],
      pincode: [null, Validators.compose([Validators.required])],
      street: [null, Validators.compose([Validators.required])],
      city: [null, Validators.compose([Validators.required])],
      name_on_bank_account: [null],
      bank_name: [null],
      ifsc_code: [null],
      bank_account_no: [null],
      
    });
    this.ModalHeading = "Add Agent";
    this.ModalBtn = "Save";
  }
  
  addAgent(){  

    this.spinner.show();
    let id:any=this.agentRecord.id;  
    const data = {
      name:this.form.value.name,
      email:this.form.value.email,
      phone:this.form.value.phone,
      password:this.form.value.password,
      location:this.form.value.location,
      adhar_no:this.form.value.adhar_no,
      pancard_no:this.form.value.pancard_no,
      organization_name:this.form.value.organization_name,
      address:this.form.value.address,
      landmark:this.form.value.landmark,
      city:this.form.value.city,
      street:this.form.value.street,
      pincode:this.form.value.pincode,
      name_on_bank_account:this.form.value.name_on_bank_account,
      bank_name:this.form.value.bank_name,
      ifsc_code:this.form.value.ifsc_code,  
      bank_account_no:this.form.value.bank_account_no,  
      created_by: localStorage.getItem('USERNAME') 
      
    };
    // console.log(data);
    if(id==null)
    {
      this.AgentserviceService.create(data).subscribe(
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
     
      this.AgentserviceService.update(id,data).subscribe(
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
    this.agentRecord=this.agents[id] ;
    this.form = this.fb.group({
      id:[this.agentRecord.id],
      name: [this.agentRecord.name, Validators.compose([Validators.required])],
      email: [this.agentRecord.email,Validators.compose([Validators.required])],
      phone: [this.agentRecord.phone,Validators.compose([Validators.required])],
      password: [this.agentRecord.password,Validators.compose([Validators.required])],
      user_type: [this.agentRecord.user_type,Validators.compose([Validators.required])],
      location: [this.agentRecord.location,Validators.compose([Validators.required])],
      adhar_no: [this.agentRecord.adhar_no,Validators.compose([Validators.required])],
      pancard_no: [this.agentRecord.pancard_no,Validators.compose([Validators.required])],
      organization_name: [this.agentRecord.organization_name,Validators.compose([Validators.required])],
      address: [this.agentRecord.address,Validators.compose([Validators.required])],
      landmark: [this.agentRecord.landmark,Validators.compose([Validators.required])],
      pincode: [this.agentRecord.pincode,Validators.compose([Validators.required])],
      street: [this.agentRecord.street,Validators.compose([Validators.required])],
      city: [this.agentRecord.city,Validators.compose([Validators.required])],
      name_on_bank_account: [this.agentRecord.name_on_bank_account],
      bank_name: [this.agentRecord.bank_name],
      ifsc_code: [this.agentRecord.ifsc_code],
      bank_account_no: [this.agentRecord.bank_account_no],
      
    });
    this.ModalHeading = "Edit Agent";
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
    this.AgentserviceService.chngsts(data).subscribe(
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
  fileName= 'Agent-Agent.csv';

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
