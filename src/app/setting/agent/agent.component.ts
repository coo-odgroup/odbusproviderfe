import { Component, OnInit,ViewChild } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { AgentserviceService } from '../../services/agentservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { Agent } from 'src/app/model/agent';

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

  public ModalHeading:any;
  public ModalBtn:any;
  pagination: any;
  
  constructor(private AgentserviceService: AgentserviceService,private http: HttpClient,private notificationService: NotificationService,private fb: FormBuilder,private modalService: NgbModal,config: NgbModalConfig) {
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
    this.form = this.fb.group({
      id:[null],
      name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phone: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      location: [null, Validators.compose([Validators.required])],
      adhar_no: [null, Validators.compose([Validators.required])],
      pancard_no: [null, Validators.compose([Validators.required])],
      organization_name: [null, Validators.compose([Validators.required])],
      address: [null, Validators.compose([Validators.required])],
      street: [null, Validators.compose([Validators.required])],
      landmark: [null, Validators.compose([Validators.required])],
      city: [null, Validators.compose([Validators.required])],
      pincode: [null, Validators.compose([Validators.required])],
      name_on_bank_account: [null, Validators.compose([Validators.required])],
      bank_name: [null, Validators.compose([Validators.required])],
      ifsc_code: [null, Validators.compose([Validators.required])],
      bank_account_no: [null, Validators.compose([Validators.required])],
      branch_name: [null, Validators.compose([Validators.required])],
      upi_id: [null, Validators.compose([Validators.required])]
    });  
    this.formConfirm=this.fb.group({
      id:[null]
    });

    this.searchForm = this.fb.group({  
      name: [null], 
      rows_number: Constants.RecordLimit,
    });
     this.search(); 
    
  }

  page(label:any){
    return label;
   }

  search(pageurl="")
  {
      
    const data = { 
      name: this.searchForm.value.name,
      email: this.searchForm.value.email,
      phone:this.searchForm.value.phone, 
      password:this.searchForm.value.password,
      location:this.searchForm.value.location,
      adhar_no:this.searchForm.value.adhar_no,
      pancard_no:this.searchForm.value.pancard_no,
      organization_name:this.searchForm.value.organization_name,
      address:this.searchForm.value.address,
      street:this.searchForm.value.street,
      landmark:this.searchForm.value.landmark,
      city:this.searchForm.value.city,
      pincode:this.searchForm.value.pincode,
      name_on_bank_account:this.searchForm.value.name_on_bank_account,
      bank_name:this.searchForm.value.bank_name,
      ifsc_code:this.searchForm.value.ifsc_code,
      bank_account_no:this.searchForm.value.bank_account_no,
      branch_name:this.searchForm.value.branch_name,
      upi_id:this.searchForm.value.upi_id
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.AgentserviceService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.agents= res.data.data.data;
          this.pagination= res.data.data;
        }
      );
    }
    else
    {
      this.AgentserviceService.getAllData(data).subscribe(
        res => {
          this.agents= res.data.data.data;
          console.log(this.agents);
          this.pagination= res.data.data;
        }
      );
    }


  }


  refresh()
   {
    this.searchForm = this.fb.group({  
      price_from: [null], 
      price_to: [null],  
      max_comission: Constants.RecordLimit,
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
      street:'',
      landmark:'',
      city:'',
      pincode:'',
      name_on_bank_account:'',
      bank_name:'',
      ifsc_code:'',
      bank_account_no:'',
      branch_name:'',
      upi_id:''
    } as Agent;
    this.form = this.fb.group({
      id:[null],
      name: ['', Validators.compose([Validators.required])],
      email: ['',Validators.compose([Validators.required])],
      phone: ['',Validators.compose([Validators.required])],
      password: ['',Validators.compose([Validators.required])],
      location: ['',Validators.compose([Validators.required])],
      adhar_no: ['',Validators.compose([Validators.required])],
      pancard_no: ['',Validators.compose([Validators.required])],
      organization_name: ['',Validators.compose([Validators.required])],
      address: ['',Validators.compose([Validators.required])],
      street: ['',Validators.compose([Validators.required])],
      landmark: ['',Validators.compose([Validators.required])],
      city: ['',Validators.compose([Validators.required])],
      pincode: ['',Validators.compose([Validators.required])],
      name_on_bank_account: ['',Validators.compose([Validators.required])],
      bank_name: ['',Validators.compose([Validators.required])],
      ifsc_code: ['',Validators.compose([Validators.required])],
      bank_account_no: ['',Validators.compose([Validators.required])],
      branch_name: ['',Validators.compose([Validators.required])],
      upi_id: ['',Validators.compose([Validators.required])]
    });
    this.ModalHeading = "Add Agent";
    this.ModalBtn = "Save";
  }
  
  addAgent(){  

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
      street:this.form.value.street,
      landmark:this.form.value.landmark,
      city:this.form.value.city,
      pincode:this.form.value.pincode,
      name_on_bank_account:this.form.value.name_on_bank_account,
      bank_name:this.form.value.bank_name,
      ifsc_code:this.form.value.ifsc_code,  
      bank_account_no:this.form.value.bank_account_no,  
      branch_name:this.form.value.branch_name,  
      upi_id:this.form.value.upi_id,  
      created_by: localStorage.getItem('USERNAME') 
      
    };
    console.log(data);
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
      street: [this.agentRecord.street,Validators.compose([Validators.required])],
      landmark: [this.agentRecord.landmark,Validators.compose([Validators.required])],
      city: [this.agentRecord.city,Validators.compose([Validators.required])],
      pincode: [this.agentRecord.pincode,Validators.compose([Validators.required])],
      name_on_bank_account: [this.agentRecord.name_on_bank_account,Validators.compose([Validators.required])],
      bank_name: [this.agentRecord.bank_name,Validators.compose([Validators.required])],
      ifsc_code: [this.agentRecord.ifsc_code,Validators.compose([Validators.required])],
      bank_account_no: [this.agentRecord.bank_account_no,Validators.compose([Validators.required])],
      branch_name: [this.agentRecord.branch_name,Validators.compose([Validators.required])],
      upi_id: [this.agentRecord.upi_id,Validators.compose([Validators.required])]
    });
    this.ModalHeading = "Edit Agent";
    this.ModalBtn = "Update";
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
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
