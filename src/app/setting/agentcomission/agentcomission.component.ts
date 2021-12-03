import { Component, OnInit,ViewChild } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { AgentCommissionServiceService } from '../../services/agent-commission-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AgentCommissionSlab} from '../../model/agent-commission-slab';
import { Subject } from 'rxjs';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-agentcomission',
  templateUrl: './agentcomission.component.html',
  styleUrls: ['./agentcomission.component.scss']
})
export class AgentcomissionComponent implements OnInit {

  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;



  //@ViewChild('closebutton') closebutton;
  @ViewChild("addnew") addnew;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  agentCommissionSlabs: AgentCommissionSlab[];
  agentCommissionSlabRecord: AgentCommissionSlab;
  public isSubmit: boolean;

  public ModalHeading:any;
  public ModalBtn:any;
  pagination: any;
  all: any;
  
  constructor(private spinner: NgxSpinnerService,private AgentCommissionServiceService: AgentCommissionServiceService,private http: HttpClient,private notificationService: NotificationService,private fb: FormBuilder,private modalService: NgbModal,config: NgbModalConfig) {
    this.isSubmit = false;
    this.agentCommissionSlabRecord= {} as AgentCommissionSlab;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Agent Commission Slab";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }

   ngOnInit() { 
    this.spinner.show();
    this.form = this.fb.group({
      id:[null],
      range_from: [null, Validators.compose([Validators.required])],
      range_to: [null, Validators.compose([Validators.required])],
      comission_per_seat: [null, Validators.compose([Validators.required])],
      user_name : localStorage.getItem('USERNAME'),   
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
    this.spinner.show();
      
    const data = { 
      range_from: this.searchForm.value.range_from,
      range_to: this.searchForm.value.range_to,
      comission_per_seat:this.searchForm.value.comission_per_seat, 
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.AgentCommissionServiceService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.agentCommissionSlabs= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.AgentCommissionServiceService.getAllData(data).subscribe(
        res => {
          this.agentCommissionSlabs= res.data.data.data;
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
      range_from: [null], 
      range_to: [null],  
      comission_per_seat: Constants.RecordLimit,
    });
     this.search();
   }


  
  ResetAttributes()
  {
    this.agentCommissionSlabRecord = {
      range_from:'',
      range_to:'',
      comission_per_seat:''
    } as AgentCommissionSlab;
    this.form = this.fb.group({
      id:[null],
      range_from: ['', Validators.compose([Validators.required])],
      range_to: ['', Validators.compose([Validators.required])],
      comission_per_seat: ['', Validators.compose([Validators.required])],
      user_name : localStorage.getItem('USERNAME'),   
    });
    this.ModalHeading = "Add Commission Slab";
    this.ModalBtn = "Save";
  }
  
  addCommissionSlab(){  

    this.spinner.show();

    let id:any=this.agentCommissionSlabRecord.id;  
    const data = {
      range_from:this.form.value.range_from,
      range_to:this.form.value.range_to,
      comission_per_seat:this.form.value.comission_per_seat,
      user_name : localStorage.getItem('USERNAME'),     
    };
    
    if(id==null)
    {
      this.AgentCommissionServiceService.create(data).subscribe(
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
     
      this.AgentCommissionServiceService.update(id,data).subscribe(
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
    this.agentCommissionSlabRecord=this.agentCommissionSlabs[id] ;
    this.form = this.fb.group({
      id:[this.agentCommissionSlabRecord.id],
      range_from: [this.agentCommissionSlabRecord.range_from, Validators.compose([Validators.required])],
      range_to: [this.agentCommissionSlabRecord.range_to,Validators.compose([Validators.required])],
      comission_per_seat: [this.agentCommissionSlabRecord.comission_per_seat,Validators.compose([Validators.required])],
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
  fileName= 'Agent-Commission.xlsx';

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
