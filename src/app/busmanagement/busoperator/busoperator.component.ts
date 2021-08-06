import { Component, OnInit, ViewChild } from '@angular/core';
import {Constants} from '../../constant/constant';
import { BusOperatorService} from '../../services/bus-operator.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Busoperator} from '../../model/busoperator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTablesResponse} from '../../model/datatable';
import { NotificationService } from '../../services/notification.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-busoperator',
  templateUrl: './busoperator.component.html',
  styleUrls: ['./busoperator.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class BusoperatorComponent implements OnInit {
 
  public form: FormGroup;
  public formConfirm: FormGroup;
  public bankNames:any;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  @ViewChild("addnew") addnew;
  //@ViewChild("closebutton") closebutton;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  
  position = 'bottom-right';
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionOperators: any = {};
  dtSeatTypesOptions: any = {};
  dtSeatTypesOptionsData: any = {};
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
  constructor(private http: HttpClient, private busOperatorService:BusOperatorService, private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal) {
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
  loadOperators()
  {
      this.dtOptionOperators = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: 'lBfrtip',
      order:["0","desc"],
      aLengthMenu:[10, 25, 50, 100, "All"],
      buttons: [
        { extend: 'copy', className: 'btn btn-sm btn-primary',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     },
     exportOptions: {
      columns: "thead th:not(.noExport)"
     }  
    },
      { extend: 'print', className: 'btn btn-sm btn-danger',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     },
     exportOptions: {
      columns: "thead th:not(.noExport)"
     } 
     },
      { extend: 'excel', className: 'btn btn-sm btn-info',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     },
     exportOptions: {
      columns: "thead th:not(.noExport)"
     } 
     },
      { extend: 'csv', className: 'btn btn-sm btn-success',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     },
     exportOptions: {
      columns: "thead th:not(.noExport)"
     } 
     },
     {
      text:"Add",
      className: 'btn btn-sm btn-warning',init: function(api, node, config) {
        $(node).removeClass('dt-button')
      },
      action:() => {
       this.addnew.nativeElement.click();
      }
    }
    ],
    language: {
      searchPlaceholder: "Find Operators",
      processing: "<img src='assets/images/loading.gif' width='30'>"
    },

      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            Constants.BASE_URL+'/busoperatorsDT',
            dataTablesParameters, {}
          ).subscribe(resp => {
           // console.log(resp.data.aaData);
            this.BusOperators = resp.data.aaData;
            
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: resp.data.aaData
            });
          });
          
      },
      
      columns: [{ data: 'id' }, { data: 'email_id' }, { title:'Operator Name',data: 'operator_name' },{ title:'Contact Number',data: 'contact_number' },{data:'created_at'}, {
        data: 'status',
        render:function(data)
        {
          return (data==1)?"Active":"Pending"
        }
      
    },{ title:'Action',data: null, orderable:false,className: "noExport" }]      
      
    }; 
    
  }
  ngOnInit(){
    this.form = this.fb.group({
      id:[null],
      email_id: [null],
      password: [null],
      operator_name: [null],
      contact_number: [null],
      organisation_name: [null],
      address: [null],
      additional_email: [null],
      additional_contact: [null],
      location_name: [null],
      bank_account_name: [null],
      bank_name: [null],
      bank_ifsc: [null],
      bank_account_number: [null]
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    this.loadOperators();

    // this.bankNames=[
    //   "Axis Bank",
    //   "Bandhan Bank",
    //   "Bank of Baroda",
    //   "Bank of India",
    //   "Bank of Maharashtra",
    //   "Canara Bank",
    //   "Catholic Syrian Bank",
    //   "Central Bank of India",
    //   "City Union Bank",
    //   "DCB Bank",
    //   "Dhanlaxmi Bank",
    //   "Federal Bank",
    //   "HDFC Bank",
    //   "ICICI Bank",
    //   "IDBI Bank",
    //   "IDFC First Bank",
    //   "Indian Bank",
    //   "Indian Overseas Bank",
    //   "IndusInd Bank",
    //   "Jammu & Kashmir Bank",
    //   "Karnataka Bank",
    //   "Karur Vysya Bank",
    //   "Kotak Mahindra Bank",
    //   "Lakshmi Vilas Bank",
    //   "Nainital Bank",
    //   "Punjab & Sindh Bank",
    //   "Punjab National Bank",
    //   "RBL Bank",
    //   "South Indian Bank",
    //   "State Bank of India (SBI)",
    //   "Tamilnad Mercantile Bank Limited",
    //   "UCO Bank",
    //   "Union Bank of India",
    //   "Yes Bank"
    // ];
    
    
  }
  ResetAttributes()
  {
    
    this.form = this.fb.group({
      id:[null],
      email_id: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern), Validators.minLength(5),Validators.maxLength(50)])],
      password: ['', Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15)])],
      operator_name: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
      contact_number: ['', Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])],
      organisation_name: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
      address: ['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(200)])],
      additional_email: ['', Validators.compose([ Validators.pattern(this.emailPattern), Validators.minLength(5),Validators.maxLength(50)])],
      additional_contact: ['', Validators.compose([Validators.minLength(10),Validators.maxLength(10)])],
      location_name:['', Validators.compose([Validators.required,Validators.maxLength(200)])],
      bank_account_name: ['', Validators.compose([Validators.maxLength(100)])],
      bank_name: ['', Validators.compose([Validators.maxLength(100)])],
      bank_ifsc: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9]*$"),Validators.maxLength(20)])],
      bank_account_number: ['', Validators.compose([Validators.pattern("^[0-9]*$"),Validators.maxLength(20)])],
    });
    this.BusOperatorRecord= {} as Busoperator;
    this.ModalHeading = "Add New Operator";
    this.ModalBtn = "Save";
  }
  
  ngAfterViewInit(): void {
    this.dtTrigger.next();
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
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }


  
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
          console.log(error.error.message);
          
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

    const data ={
      email_id:this.form.value.email_id,
      password:this.form.value.password,
      contact_number:this.form.value.contact_number,
      operator_name:this.form.value.operator_name,
      organisation_name:this.form.value.organisation_name,
      location_name:this.form.value.location_name,
      address:this.form.value.address,
      additional_email:this.form.value.additional_email,
      additional_contact:this.form.value.additional_contact,
      bank_account_name:this.form.value.bank_account_name,
      bank_name:this.form.value.bank_name,
      bank_ifsc:this.form.value.bank_ifsc,
      bank_account_number:this.form.value.bank_account_number,
      created_by:"Admin",
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
              this.rerender();
          }
          else{
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
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
              this.rerender();
          }
          else{
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
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
      password: [this.BusOperatorRecord.password, Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15)])],
      operator_name: [this.BusOperatorRecord.operator_name, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
      contact_number: [this.BusOperatorRecord.contact_number, Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])],
      organisation_name: [this.BusOperatorRecord.organisation_name, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
      address: [this.BusOperatorRecord.address, Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(200)])],
      additional_email: [this.BusOperatorRecord.additional_email,Validators.compose([Validators.minLength(10),Validators.maxLength(50)])],
      additional_contact: [this.BusOperatorRecord.additional_contact,Validators.compose([Validators.minLength(10),Validators.maxLength(10)])],
      location_name: [this.BusOperatorRecord.location_name, Validators.compose([Validators.required,Validators.maxLength(200)])],
      bank_account_name: [this.BusOperatorRecord.bank_account_name,Validators.compose([Validators.maxLength(100)])],
      bank_name: [this.BusOperatorRecord.bank_name,Validators.compose([Validators.maxLength(100)])],
      bank_ifsc: [this.BusOperatorRecord.bank_ifsc,Validators.compose([Validators.pattern("^[a-zA-Z0-9]*$"),Validators.maxLength(20)])],
      bank_account_number: [this.BusOperatorRecord.bank_account_number, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.maxLength(20)])]
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

                this.rerender();
            }
            else{
               
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
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
    this.busOperatorService.chngsts(stsitem).subscribe(
      resp => {
        if(resp.status==1)
        {
            //this.closebutton.nativeElement.click();
            this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
            this.rerender();
        }
        else{
          this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
        }
      }
    );
  }

}
