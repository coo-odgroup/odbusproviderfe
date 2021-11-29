import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Coupon } from '../../model/coupon';
import {CouponService} from '../../services/coupon.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {Constants} from '../../constant/constant';
import { BusOperatorService } from '../../services/bus-operator.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})

export class CouponComponent implements OnInit {

  public form: FormGroup;
  public searchForm: FormGroup;
  
  public formConfirm: FormGroup;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading:any;
  public ModalBtn:any;

  coupons: Coupon[];
  couponRecord: Coupon;
  pagination: any;
  busoperators: any;
  all: any;
  constructor(
    private http: HttpClient, 
    private notificationService: NotificationService, 
    private fb: FormBuilder,
    private modalService: NgbModal,
    private couponService:CouponService,
    private busOperatorService: BusOperatorService,
    config: NgbModalConfig
    )
    { 
      config.backdrop = 'static';
      config.keyboard = false;
      this.ModalHeading = "Add New Coupon";
      this.ModalBtn = "Save"; 
    }


    
    

  ngOnInit(): void {
    this.form = this.fb.group({
      id:[null],
      coupon_title: [null, Validators.compose([Validators.required])],
      coupon_code: [null, Validators.compose([Validators.required])],
      short_description: [null],
      full_description: [null],
      coupon_type: [null],
      percentage: [null],
      max_discount_price: [null],
      amount: [null],
      min_tran_amount: [null],
      valid_by: [null],
      from_date: [null],
      to_date: [null],
      bus_operator_id:[null],
      max_redeem: [null]

      // name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      // synonym: [null, Validators.compose([Validators.maxLength(15)])]
    });

    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    this.search();
    this.loadServices();
    
  }
  loadElements(index:any)
  {
    this.ModalHeading = "Edit Coupon";
    this.ModalBtn = "Update"; 
    this.couponRecord= this.coupons[index];

    var d = new Date(this.couponRecord.from_date);
    let date = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
    var e = new Date(this.couponRecord.from_date);
    let to_date = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
    // console.log(this.couponRecord);
    this.form.controls.coupon_title.setValue(this.couponRecord.coupon_title);
    this.form.controls.coupon_code.setValue(this.couponRecord.coupon_code);
    this.form.controls.short_description.setValue(this.couponRecord.short_desc);
    this.form.controls.full_description.setValue(this.couponRecord.full_desc);
    this.form.controls.coupon_type.setValue(this.couponRecord.type);
    this.form.controls.max_discount_price.setValue(this.couponRecord.max_discount_price);
    this.form.controls.percentage.setValue(this.couponRecord.percentage);
    this.form.controls.amount.setValue(this.couponRecord.amount);
    this.form.controls.min_tran_amount.setValue(this.couponRecord.min_tran_amount);
    this.form.controls.valid_by.setValue(this.couponRecord.valid_by);
    this.form.controls.from_date.setValue(date);
    this.form.controls.to_date.setValue(to_date);
    this.form.controls.bus_operator_id.setValue(this.couponRecord.bus_operator_id);
    this.form.controls.max_redeem.setValue(this.couponRecord.max_redeem);

  }

  page(label:any){
    return label;
   }


  search(pageurl="")
  {      
    const data = {
      name:this.searchForm.value.name,  
      rows_number:this.searchForm.value.rows_number,
      USER_BUS_OPERATOR_ID:localStorage.getItem('USER_BUS_OPERATOR_ID')
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.couponService.couponPaginate(pageurl,data).subscribe(
        res => {
          
          this.coupons= res.data.data.data;
          this.pagination= res.data.data;
          this.all =res.data;
          // console.log( this.contactcontent);
        }
      );
    }
    else
    {
      this.couponService.couponDataTable(data).subscribe(
        res => {
          this.coupons= res.data.data.data;
          this.pagination= res.data.data;
          this.all =res.data;
          // console.log(  this.pagination);
        }
      );
    }


  }

  refresh()
   {
    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });

     this.search();
   }


  OpenModal(content) 
  {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ResetAttributes()
  { 
    this.couponRecord = {} as Coupon;
    this.form = this.fb.group({
      id:[null],
      coupon_title: [null, Validators.compose([Validators.required])],
      coupon_code: [null, Validators.compose([Validators.required])],
      short_description: [null],
      full_description: [null],
      coupon_type: [null],
      percentage: [null],
      max_discount_price: [null],
      amount: [null],
      min_tran_amount: [null],
      valid_by: [null],
      from_date: [null],
      to_date: [null],
      bus_operator_id:[null],
      max_redeem: [null]

      // name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      // synonym: [null, Validators.compose([Validators.maxLength(15)])]
    });
    this.ModalHeading = "Add Coupon";
    this.ModalBtn = "Save";
  }

  addData()
  {
    let id=this.couponRecord.id;
    const data={
      coupon_code:this.form.value.coupon_code,
      coupon_title:this.form.value.coupon_title,
      type:this.form.value.coupon_type,
      amount:this.form.value.amount,
      full_desc:this.form.value.full_description,
      max_discount_price:this.form.value.max_discount_price,
      max_redeem:this.form.value.max_redeem,
      min_tran_amount:this.form.value.min_tran_amount,
      percentage:this.form.value.percentage,
      short_desc:this.form.value.short_description,
      valid_by:this.form.value.valid_by,
      from_date:this.form.value.from_date,
      to_date:this.form.value.to_date,
      bus_operator_id:this.form.value.bus_operator_id,
      created_by:localStorage.getItem('USERNAME') 
    };

    // console.log(data);
    if(id==null)
    {
    this.couponService.create(data).subscribe(
      resp => {
        if(resp.status==1)
        {
            //this.closebutton.nativeElement.click();
            this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
            this.modalReference.close();
            this.ResetAttributes();
            this.search(); 
        }
        else{
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
        }
      }
    );  }
    else{     
     
      this.couponService.update(id,data).subscribe(
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
    // if(data.id != "")
    // {
    //   //UPDATE CASE
    // }
    // else
    // {
      
    // }
  }

  

  editData()
  {
    

    this.ModalHeading = "Edit Coupon";
    this.ModalBtn = "Update";
  

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

  
  title = 'angular-app';
  fileName= 'Coupon.xlsx';

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








  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: '250px',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    // upload: (file: File) => { ... }
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};


openConfirmDialog(content, id: any)
{
  this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  this.couponRecord = this.coupons[id];
}
deleteRecord()
{
  // let delitem=this.formConfirm.value.id;
  let delitem = this.couponRecord.id;
   this.couponService.delete(delitem).subscribe(
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

}
