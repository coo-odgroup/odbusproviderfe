import { Component, OnInit,ViewChild } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { BusTypeService } from '../../services/bus-type.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Bustype} from '../../model/bustype';
import { Subject } from 'rxjs';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import * as XLSX from 'xlsx';

import { BusOperatorService } from '../../services/bus-operator.service';

@Component({
  selector: 'app-bustype',
  templateUrl: './bustype.component.html',
  styleUrls: ['./bustype.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class BustypeComponent implements OnInit {  

  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;



  //@ViewChild('closebutton') closebutton;
  @ViewChild("addnew") addnew;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  busTypes: Bustype[];
  busTypeRecord: Bustype;
  public isSubmit: boolean;

  public ModalHeading:any;
  public ModalBtn:any;
  pagination: any;
  busoperators: any;
  all: any;
  constructor(private busTypeService: BusTypeService,private busOperatorService: BusOperatorService,private http: HttpClient,private notificationService: NotificationService,private fb: FormBuilder,private modalService: NgbModal,config: NgbModalConfig) {
    this.isSubmit = false;
    this.busTypeRecord= {} as Bustype;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Bus Type";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'lg' });
  }
  
 
   ngOnInit() { 
    this.form = this.fb.group({
      id:[null],
      name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      type: [null, Validators.compose([Validators.required])],
      bus_operator_id:[null, Validators.compose([Validators.required])]
    });  
    this.formConfirm=this.fb.group({
      id:[null]
    });

    this.searchForm = this.fb.group({  
      name: [null], 
      bus_type: [null],  
      rows_number: Constants.RecordLimit,
    });

     this.search(); 
     this.loadServices();
    
  }
  loadServices() {
    const BusOperator={
      USER_BUS_OPERATOR_ID:localStorage.getItem("USER_BUS_OPERATOR_ID")
    };
    if(BusOperator.USER_BUS_OPERATOR_ID=="")
    {
      this.busOperatorService.readAll().subscribe(
        record=>{
        this.busoperators=record.data;
        }
      );
    }
    else
    {
      this.busOperatorService.readOne(BusOperator.USER_BUS_OPERATOR_ID).subscribe(
        record=>{
        this.busoperators=record.data;
        }
      );
    }

  }
  page(label:any){
    return label;
   }

  search(pageurl="")
  {
      
    const data = { 
      name: this.searchForm.value.name,
      bus_type: this.searchForm.value.bus_type,
      rows_number:this.searchForm.value.rows_number, 
      USER_BUS_OPERATOR_ID:localStorage.getItem('USER_BUS_OPERATOR_ID')
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.busTypeService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.busTypes= res.data.data.data;
          this.pagination= res.data.data;
          this.all =res.data;
        
          // console.log( this.busTypes);
        }
      );
    }
    else
    {
      this.busTypeService.getAllData(data).subscribe(
        res => {
          this.busTypes= res.data.data.data;
          this.pagination= res.data.data;
          this.all =res.data;
          // console.log( res.data);
        }
      );
    }


  }


  refresh()
   {
    this.searchForm = this.fb.group({  
      name: [null], 
      bus_type: [null],  
      rows_number: Constants.RecordLimit,
    });
     this.search();
   }


  
  ResetAttributes()
  {
    this.busTypeRecord = {
      name:''
    } as Bustype;
    this.form = this.fb.group({
      id:[null],
      name: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])],
      type: ['0', Validators.compose([Validators.required])],
      bus_operator_id:[null, Validators.compose([Validators.required])]
    });
    this.ModalHeading = "Add Bus Type";
    this.ModalBtn = "Save";
  }
  
  addBusTypes(){  
    let id:any=this.busTypeRecord.id;  
    const data = {
      type:this.form.value.type,
      name:this.form.value.name,
      bus_operator_id:this.form.value.bus_operator_id,
      created_by:localStorage.getItem('USERNAME') 
    };
    // console.log(data);
    if(id==null)
    {
      this.busTypeService.create(data).subscribe(
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
     
      this.busTypeService.update(id,data).subscribe(
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
  editBusTypes(event : Event, id : any)
  {
    this.busTypeRecord=this.busTypes[id] ;
    console.log(this.busTypeRecord);
    this.form = this.fb.group({
      id:[this.busTypeRecord.id],
      name: [this.busTypeRecord.name, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])],
      type: [this.busTypeRecord.bus_class_id,Validators.compose([Validators.required])],
      bus_operator_id:[this.busTypeRecord.bus_operator_id, Validators.compose([Validators.required])]
    });
    this.ModalHeading = "Edit Bus Type";
    this.ModalBtn = "Update";
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }

  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
     this.busTypeService.delete(delitem).subscribe(
      resp => {
        if(resp.status==1)
            {
                this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                this.confirmDialogReference.close();

                this.search();
            }
            else{
               
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
            }
      }); 
  }
  deleteBusType(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.busTypeService.chngsts(stsitem).subscribe(
      resp => {
        if(resp.status==1)
        {
            this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
            this.search();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
      }
    );
  }

  title = 'angular-app';
  fileName= 'Bus-Type.xlsx';

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
