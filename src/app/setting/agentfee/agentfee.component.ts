import { Component, OnInit,ViewChild } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { AgentFeeServiceService } from '../../services/agent-fee-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { AgentFeeSlab } from 'src/app/model/agent-fee-slab';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-agentfee',
  templateUrl: './agentfee.component.html',
  styleUrls: ['./agentfee.component.scss']
})
export class AgentfeeComponent implements OnInit {

  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;



  //@ViewChild('closebutton') closebutton;
  @ViewChild("addnew") addnew;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  agentFeeSlabs: AgentFeeSlab[];
  agentFeeSlabRecord: AgentFeeSlab;
  public isSubmit: boolean;

  public ModalHeading:any;
  public ModalBtn:any;
  pagination: any;
  all: any;
  
  constructor(private spinner: NgxSpinnerService,private AgentFeeServiceService: AgentFeeServiceService,private http: HttpClient,private notificationService: NotificationService,private fb: FormBuilder,private modalService: NgbModal,config: NgbModalConfig) {
    this.isSubmit = false;
    this.agentFeeSlabRecord= {} as AgentFeeSlab;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Agent Fee Slab";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }

   ngOnInit() { 
    this.spinner.show();
    this.form = this.fb.group({
      id:[null],
      price_from: [null, Validators.compose([Validators.required])],
      price_to: [null, Validators.compose([Validators.required])],
      max_comission: [null, Validators.compose([Validators.required])],
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
      price_from: this.searchForm.value.price_from,
      price_to: this.searchForm.value.price_to,
      max_comission:this.searchForm.value.max_comission, 
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.AgentFeeServiceService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.agentFeeSlabs= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.AgentFeeServiceService.getAllData(data).subscribe(
        res => {
          this.agentFeeSlabs= res.data.data.data;
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
      price_from: [null], 
      price_to: [null],  
      max_comission: Constants.RecordLimit,
    });
     this.search();
   }


  
  ResetAttributes()
  {
    this.agentFeeSlabRecord = {
      price_from:'',
      price_to:'',
      max_comission:''
    } as AgentFeeSlab;
    this.form = this.fb.group({
      id:[null],
      price_from: ['', Validators.compose([Validators.required])],
      price_to: ['', Validators.compose([Validators.required])],
      max_comission: ['', Validators.compose([Validators.required])],
    });
    this.ModalHeading = "Add Commission Slab";
    this.ModalBtn = "Save";
  }
  
  addFeeSlab(){  
    this.spinner.show();
    let id:any=this.agentFeeSlabRecord.id;  
    const data = {
      price_from:this.form.value.price_from,
      price_to:this.form.value.price_to,
      max_comission:this.form.value.max_comission,
      created_by: localStorage.getItem('USERNAME')   
    };
    
    if(id==null)
    {
      this.AgentFeeServiceService.create(data).subscribe(
        resp => {
          if(resp.status==1)
       {
          this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
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
    else{     
     
      this.AgentFeeServiceService.update(id,data).subscribe(
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
  editAgentFee(event : Event, id : any)
  {
    this.agentFeeSlabRecord=this.agentFeeSlabs[id] ;
    this.form = this.fb.group({
      id:[this.agentFeeSlabRecord.id],
      price_from: [this.agentFeeSlabRecord.price_from, Validators.compose([Validators.required])],
      price_to: [this.agentFeeSlabRecord.price_to,Validators.compose([Validators.required])],
      max_comission: [this.agentFeeSlabRecord.max_comission,Validators.compose([Validators.required])]
    });
    this.ModalHeading = "Edit Agent Fee Slab";
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
