import { Component, OnInit, ViewChild } from '@angular/core';
import {Constants} from '../../constant/constant';
import { BusOperatorService} from '../../services/bus-operator.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Busoperator} from '../../model/busoperator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { Subject } from 'rxjs';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-busoperator',
  templateUrl: './busoperator.component.html',
  styleUrls: ['./busoperator.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class BusoperatorComponent implements OnInit {
 
  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;



  public bankNames:any;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  @ViewChild("addnew") addnew;
 
  BusOperators: Busoperator[];
  BusOperatorRecord: Busoperator;
  
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  passwordPattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@$#!%^*&]).{8,}$";
  
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
  public validIFSC:any;
  public validEmail:any;
  public validPhone:any;
  pagination: any;
  all: any;
  constructor(private http: HttpClient, private busOperatorService:BusOperatorService, private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal  , private spinner: NgxSpinnerService,) {
    this.isSubmit = false;
    this.BusOperatorRecord= {} as Busoperator;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Operator";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
 
  ngOnInit(){
    this.spinner.show();
    this.form = this.fb.group({
      id:[null],
      email_id: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern), Validators.minLength(5),Validators.maxLength(50)])],
      password: ['', Validators.compose([Validators.required,Validators.maxLength(15)])],
      operator_name: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
      contact_number: ['', Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])],
      organisation_name: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
      address: ['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(200)])],
      operator_info: [''],
      additional_email: ['', Validators.compose([ Validators.pattern(this.emailPattern), Validators.minLength(5),Validators.maxLength(50)])],
      additional_contact: ['', Validators.compose([Validators.minLength(10),Validators.maxLength(10)])],
      location_name:['', Validators.compose([Validators.required,Validators.maxLength(200)])],
      bank_account_name: ['', Validators.compose([Validators.maxLength(100)])],
      bank_name: ['', Validators.compose([Validators.maxLength(100)])],
      bank_ifsc: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9]*$"),Validators.maxLength(20)])],
      bank_account_number: ['', Validators.compose([Validators.pattern("^[0-9]*$"),Validators.maxLength(20)])],
      need_gst_bill: [''],
      gst_number: [''],
      gst_amount: ['']
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    

    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: 25,
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
      name: this.searchForm.value.name,
      rows_number:this.searchForm.value.rows_number, 
      user_role:localStorage.getItem('ROLE_ID'),
      user_id:localStorage.getItem('USERID')
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.busOperatorService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.BusOperators= res.data.data.data;
          this.pagination= res.data.data;
          this.all =res.data;
          this.spinner.hide();
          // console.log( this.BusOperators);
        }
      );
    }
    else
    {
      this.busOperatorService.getAllData(data).subscribe(
        res => {
          this.BusOperators= res.data.data.data;
          this.pagination= res.data.data;
          this.all =res.data;
          this.spinner.hide();
          // console.log(   this.BusOperators);
        }
      );
    }
  }


  refresh()
   {
    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: 25,
    });
     this.search();
     this.spinner.hide();
    
   }


   title = 'angular-app';
  fileName= 'Seat-layout.xlsx';

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

  ResetAttributes()
  {
    
    this.form = this.fb.group({
      id:[null],
      email_id: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern), Validators.minLength(5),Validators.maxLength(50)])],
      password: ['', Validators.compose([Validators.required,Validators.maxLength(15)])],
      operator_name: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
      contact_number: ['', Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])],
      organisation_name: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
      address: ['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(200)])],
      operator_info: [''],
      additional_email: ['', Validators.compose([ Validators.pattern(this.emailPattern), Validators.minLength(5),Validators.maxLength(50)])],
      additional_contact: ['', Validators.compose([Validators.minLength(10),Validators.maxLength(10)])],
      location_name:['', Validators.compose([Validators.required,Validators.maxLength(200)])],
      bank_account_name: ['', Validators.compose([Validators.maxLength(100)])],
      bank_name: ['', Validators.compose([Validators.maxLength(100)])],
      bank_ifsc: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9]*$"),Validators.maxLength(20)])],
      bank_account_number: ['', Validators.compose([Validators.pattern("^[0-9]*$"),Validators.maxLength(20)])],
      need_gst_bill: [''],
      gst_number: [''],
      gst_amount: ['']
    });
    this.BusOperatorRecord= {} as Busoperator;
    this.ModalHeading = "Add New Operator";
    this.ModalBtn = "Save";
  }
  
 
  checkEmail()
  {
    const data={
      emailid:this.form.value.email_id,
      operator_id:this.BusOperatorRecord.id
    };
    this.busOperatorService.checkOperatorEmail(data).subscribe(

      resp => {
        if(resp.data==1)
        {
          this.validEmail=this.form.value.email_id + " Already Exists";
          //this.form.controls.email_id.setValue('');
          
        }
        else
        {
          this.validEmail="";
        }
    });
  }

  checkPhone()
  {
    const data={
      contact_number:this.form.value.contact_number,
      operator_id:this.BusOperatorRecord.id
    };
    this.busOperatorService.checkOperatorPhone(data).subscribe(

      resp => {
        if(resp.data==1)
        {
          this.validPhone=this.form.value.contact_number + " Already Exists";
          //this.form.controls.contact_number.setValue('');
          
         
        }
        else
        {
          this.validPhone="";
        }
    });
  }
 

  // refresh(): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     // Destroy the table first
  //     dtInstance.destroy();
  //     // Call the dtTrigger to refresh again
  //     this.dtTrigger.next();
  //   });
  // }


  
  fieldTextType: boolean;

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  checkIfsc()
  {
    let ifsc=this.form.value.bank_ifsc;
    if(ifsc!="")
    {
      this.busOperatorService.getIFSC(ifsc).subscribe(

        resp => {
          this.validIFSC=resp.ADDRESS + ',' +resp.STATE;
          this.form.controls.bank_name.setValue(resp.BANK);
          //console.log(resp);
        }
        ,
        error => {
          this.validIFSC="INVALID VALID IFSC CODE";
          // console.log(error.error.message);
          
        }
      );
    }
    else
    {
      this.validIFSC="";
    }
    
  }
  
  addBusOperator()
  {  
    this.spinner.show();
    let gst_need=this.form.value.need_gst_bill;
    if(gst_need=="")
    {
      gst_need="0";
    }

    const data ={
      email_id:this.form.value.email_id,
      password:this.form.value.password,
      contact_number:this.form.value.contact_number,
      operator_name:this.form.value.operator_name,
      organisation_name:this.form.value.organisation_name,
      location_name:this.form.value.location_name,
      address:this.form.value.address,
      operator_info:this.form.value.operator_info,
      additional_email:this.form.value.additional_email,
      additional_contact:this.form.value.additional_contact,
      bank_account_name:this.form.value.bank_account_name,
      bank_name:this.form.value.bank_name,
      bank_ifsc:this.form.value.bank_ifsc,
      bank_account_number:this.form.value.bank_account_number,
      need_gst_bill: gst_need,
      gst_number: this.form.value.gst_number,
      gst_amount: this.form.value.gst_amount,
      created_by:localStorage.getItem('USERNAME'),
      user_id:localStorage.getItem('USERID'),
      status:'0',
      id:this.BusOperatorRecord.id,
    };
    if(data.id==null)
    {
      this.busOperatorService.create(data).subscribe(
        resp => {
          if(resp.status==1)
          {
              //this.closebutton.nativeElement.click();
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.refresh();
          }
          else{
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
              this.spinner.hide();
          }
        }
      );
    }
    else{
      this.busOperatorService.update(data.id,data).subscribe(
        resp => {
          if(resp.status==1)
          {
              //this.closebutton.nativeElement.click();
              this.notificationService.addToast({title:Constants.RecordUpdateTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.refresh();
          }
          else{
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
            this.spinner.hide();
          }
        }
      );
    }  
  }
  editoperators(event : Event, id : any)
  {
    this.ModalHeading = "Edit Bus Operator";
    this.ModalBtn = "Update";
    this.BusOperatorRecord=this.BusOperators[id] ;    
    this.form = this.fb.group({
      id:[this.BusOperatorRecord.id],
      email_id: [this.BusOperatorRecord.email_id, Validators.compose([Validators.required,Validators.pattern(this.emailPattern), Validators.minLength(5),Validators.maxLength(50)])],
      password: [this.BusOperatorRecord.password, Validators.compose([Validators.required,Validators.maxLength(15)])],
      operator_name: [this.BusOperatorRecord.operator_name, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
      contact_number: [this.BusOperatorRecord.contact_number, Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])],
      organisation_name: [this.BusOperatorRecord.organisation_name, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
      address: [this.BusOperatorRecord.address, Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(200)])],
      operator_info:[this.BusOperatorRecord.operator_info],
      additional_email: [this.BusOperatorRecord.additional_email,Validators.compose([Validators.minLength(10),Validators.maxLength(50)])],
      additional_contact: [this.BusOperatorRecord.additional_contact,Validators.compose([Validators.minLength(10),Validators.maxLength(10)])],
      location_name: [this.BusOperatorRecord.location_name, Validators.compose([Validators.required,Validators.maxLength(200)])],
      bank_account_name: [this.BusOperatorRecord.bank_account_name,Validators.compose([Validators.maxLength(100)])],
      bank_name: [this.BusOperatorRecord.bank_name,Validators.compose([Validators.maxLength(100)])],
      bank_ifsc: [this.BusOperatorRecord.bank_ifsc,Validators.compose([Validators.pattern("^[a-zA-Z0-9]*$"),Validators.maxLength(20)])],
      bank_account_number: [this.BusOperatorRecord.bank_account_number, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.maxLength(20)])],
      need_gst_bill: [this.BusOperatorRecord.need_gst_bill],
      gst_number: [this.BusOperatorRecord.gst_number],
      gst_amount: [this.BusOperatorRecord.gst_amount]
    });
  }

  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  deleteRecord()
  {

    let delitem=this.formConfirm.value.id;
     this.busOperatorService.delete(delitem).subscribe(
      resp => {
        if(resp.status==1)
            {
                this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                this.confirmDialogReference.close();

                this.refresh();
            }
            else{
               
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
              this.spinner.hide();
            }
      }); 
  }
  deleteBusOperator(content, delitem:any)
  {
   
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
    
  }
  changeStatus(event : Event, stsitem:any)
  {
    this.spinner.show();
    this.busOperatorService.chngsts(stsitem).subscribe(
      resp => {
        if(resp.status==1)
        {
            //this.closebutton.nativeElement.click();
            this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
            this.refresh();
        }
        else{
          this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
          this.spinner.hide();
        }
      }
    );
  }

}
