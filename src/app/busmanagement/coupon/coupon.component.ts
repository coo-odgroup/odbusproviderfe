import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Coupon } from '../../model/coupon';
import {CouponService} from '../../services/coupon.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {Constants} from '../../constant/constant';
@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})

export class CouponComponent implements OnInit {

  public form: FormGroup;

  public formConfirm: FormGroup;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading:any;
  public ModalBtn:any;

  coupons: Coupon[];
  couponRecord: Coupon;

  constructor(
    private http: HttpClient, 
    private notificationService: NotificationService, 
    private fb: FormBuilder,
    private modalService: NgbModal,
    private couponService:CouponService,
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
      max_discount: [null],
      cut_off_amount: [null],
      min_tran_amount: [null],
      valid_by: [null],
      from_date: [null],
      to_date: [null],
      max_redeem: [null]

      // name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      // synonym: [null, Validators.compose([Validators.maxLength(15)])]
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    
  }


  OpenModal(content) 
  {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ResetAttributes()
  { 
    this.form.reset();
    this.ModalHeading = "Add Coupon";
    this.ModalBtn = "Save";
  }

  addData()
  {
    const data={
      coupon_code:this.form.value.coupon_code,
      coupon_title:this.form.value.coupon_title,
      type:this.form.value.coupon_type,
      amount:this.form.value.cut_off_amount,
      full_desc:this.form.value.full_description,
      max_discount_price:this.form.value.max_discount,
      max_redeem:this.form.value.max_redeem,
      min_tran_amount:this.form.value.min_tran_amount,
      percentage:this.form.value.percentage,
      short_desc:this.form.value.short_description,
      category:this.form.value.valid_by,
      from_date:this.form.value.from_date,
      to_date:this.form.value.to_date,
      created_by:'Admin'
    };
    this.couponService.create(data).subscribe(
      resp => {
        if(resp.status==1)
        {
            //this.closebutton.nativeElement.click();
            this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
            this.modalReference.close();
        }
        else{
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
        }
      }
    );
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

}
