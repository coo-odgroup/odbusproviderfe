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
import { NgxSpinnerService } from "ngx-spinner";
import { LocationService } from '../../services/location.service';
import { BusstoppageService } from '../../services/busstoppage.service';


@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})

export class CouponComponent implements OnInit {

  public form: FormGroup;
  public editform: FormGroup;
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
  locations: any;
  couponType: any;
  allRoutes: any[];
  busList:any=[];
  allBus:any=[];

  constructor(
    private http: HttpClient, 
    private notificationService: NotificationService, 
    private fb: FormBuilder,
    private modalService: NgbModal,
    private couponService:CouponService,private spinner: NgxSpinnerService,
    private busOperatorService: BusOperatorService,    private locationService: LocationService,
    config: NgbModalConfig,
    private busstoppageService:BusstoppageService
    )
    { 
      config.backdrop = 'static';
      config.keyboard = false;
      this.ModalHeading = "Add New Coupon";
      this.ModalBtn = "Save"; 
    }

  ngOnInit(): void {

    this.spinner.show();
    this.form = this.fb.group({
      id:[null],
      coupon_type:  [null, Validators.compose([Validators.required])],
      coupon_title: [null, Validators.compose([Validators.required])],
      coupon_code: [null, Validators.compose([Validators.required])],
      short_description: [null],
      full_description: [null],
      route: [null],
      coupon_discount_type: [null],
      percentage: [null],
      max_discount_price: [null],
      amount: [null],
      min_tran_amount: [null],
      valid_by: [null],
      from_date: [null],
      to_date: [null],
      bus_operator_id:[null],
      bus_id:[null, Validators.compose([Validators.required])],
      max_redeem: [null],
      auto_apply: [false]

      // name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      // synonym: [null, Validators.compose([Validators.maxLength(15)])]
    });

    this.editform= this.fb.group({
      id:[null],
      coupon_type:  [null, Validators.compose([Validators.required])],
      coupon_title: [null, Validators.compose([Validators.required])],
      coupon_code: [null, Validators.compose([Validators.required])],
      short_description: [null],
      full_description: [null],
      source_id: [null],
      destination_id: [null],
      coupon_discount_type: [null],
      percentage: [null],
      max_discount_price: [null],
      amount: [null],
      min_tran_amount: [null],
      valid_by: [null],
      from_date: [null],
      to_date: [null],
      bus_operator_id:[null],
      bus_id:[null, Validators.compose([Validators.required])],
      max_redeem: [null],
      auto_apply: [false]

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

  coupon_type(){

    this.form.controls.bus_id.setValue(null);
    this.form.controls.route.setValue(null);
    this.form.controls.bus_operator_id.setValue(null);

    this.allRoutes=[];
    this.busList=[];

    let typ=this.form.controls.coupon_type.value;
    if(typ==2){

      
    this.spinner.show();

      /////// get all routes

      this.busstoppageService.AllRoutes().subscribe(
      res => {
        //console.log(res);
        this.allRoutes=res.data;
        this.spinner.hide();
      }
    ); 
      
    }


  }


  getBusoperatorRoute(){

    this.allRoutes=[];
    this.busList=[];

    let typ=this.form.controls.coupon_type.value;

    let bus_operator_id=this.form.controls.bus_operator_id.value;

   
    this.form.controls.bus_id.setValue(null);

    if(typ==3){

      this.form.controls.route.setValue(null);

    const param={
      "bus_operator_id": bus_operator_id
    }
    
        this.spinner.show();
        /////// get all routes

        this.busstoppageService.AllRoutes(param).subscribe(
        res => {
          //console.log(res);
          this.allRoutes=res.data;
          this.spinner.hide();
        }
      ); 

     

    }

    /////// get bus list operator wise

    if(typ==1){

      if(bus_operator_id.length>0){    
    
        const param={
          "bus_operator_id":bus_operator_id
        };
    
        this.busstoppageService.GetBusList(param).subscribe(
          res => {
            
            // console.log("opr");
            // console.log(res.data);
           this.busList=res.data;
            this.spinner.hide();
          }
        );
  
      }

    }
    

  

  }

  GetBusList(){

    
    this.form.controls.bus_id.setValue(null);
    this.busList=[];

    let typ=this.form.controls.coupon_type.value;

    let route=this.form.controls.route.value;

    if(typ==3){

      let bus_operator_id=this.form.controls.bus_operator_id.value;

       /////////// get bus List     
    

     if(bus_operator_id.length>0 && route.length>0){    
   
         const param={
           "bus_operator_id":bus_operator_id,
           "route": route,
         };
     
         this.busstoppageService.GetBusList(param).subscribe(
           res => {
          //  console.log("opr_route");              
          //    console.log(res.data);
            this.busList=res.data;
             this.spinner.hide();
           }
         );
   
       }

    }

    else{
      if(route.length>0){

        const param={
          "route":route
        };
    
        this.busstoppageService.GetBusList(param).subscribe(
          res => {
            // console.log("route");
            // console.log(res.data);
           this.busList=res.data;
            this.spinner.hide();
          }
        );
  
      }

    }

  }

  loadElements(index:any)
  {
    this.ModalHeading = "Edit Coupon";
    this.ModalBtn = "Update"; 
    this.couponRecord= this.coupons[index];

    var d = new Date(this.couponRecord.from_date);
    let date = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
    var e = new Date(this.couponRecord.from_date);
    
    var to = new Date(this.couponRecord.to_date);

    let to_date = [to.getFullYear(), ('0' + (to.getMonth() + 1)).slice(-2), ('0' + to.getDate()).slice(-2)].join('-');
    // console.log(this.couponRecord);


    this.couponService.getAllBus(this.couponRecord.id).subscribe(
      records => {
        //console.log(records.data);
        this.allBus = records.data;
        this.spinner.hide();       
      }
    );


    this.editform.controls.coupon_title.setValue(this.couponRecord.coupon_title);
    this.editform.controls.coupon_code.setValue(this.couponRecord.coupon_code);
    this.editform.controls.short_description.setValue(this.couponRecord.short_desc);
    this.editform.controls.full_description.setValue(this.couponRecord.full_desc);
    this.editform.controls.auto_apply.setValue(this.couponRecord.auto_apply);   
    
    this.editform.controls.coupon_discount_type.setValue(this.couponRecord.type);
    this.editform.controls.coupon_type.setValue(this.couponRecord.coupon_type_id);
    this.editform.controls.coupon_type.setValue(this.couponRecord.coupon_type_id);
    this.editform.controls.source_id.setValue(this.couponRecord.source_id);
    this.editform.controls.destination_id.setValue(this.couponRecord.destination_id);
    this.editform.controls.max_discount_price.setValue(this.couponRecord.max_discount_price);
    this.editform.controls.percentage.setValue(this.couponRecord.percentage);
    this.editform.controls.amount.setValue(this.couponRecord.amount);
    this.editform.controls.min_tran_amount.setValue(this.couponRecord.min_tran_amount);
    this.editform.controls.valid_by.setValue(this.couponRecord.valid_by);
    this.editform.controls.from_date.setValue(date);
    this.editform.controls.to_date.setValue(to_date);
    this.editform.controls.bus_operator_id.setValue(this.couponRecord.bus_operator_id);
    this.editform.controls.max_redeem.setValue(this.couponRecord.max_redeem);
    this.editform.controls.bus_id.setValue(this.couponRecord.bus_id);



  }

  page(label:any){
    return label;
   }


  search(pageurl="")
  {      this.spinner.show();
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
          this.spinner.hide();

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
          this.spinner.hide();
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
     this.spinner.hide();

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
      coupon_type:  [null, Validators.compose([Validators.required])],
      coupon_title: [null, Validators.compose([Validators.required])],
      coupon_code: [null, Validators.compose([Validators.required])],
      short_description: [null],
      route: [null],
      full_description: [null],
      coupon_discount_type: [null],
      percentage: [null],
      max_discount_price: [null],
      amount: [null],
      min_tran_amount: [null],
      valid_by: [null],
      from_date: [null],
      to_date: [null],
      bus_operator_id:[null],
      bus_id:[null, Validators.compose([Validators.required])],
      max_redeem: [null],
      auto_apply: [false]

      // name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      // synonym: [null, Validators.compose([Validators.maxLength(15)])]
    });
    this.ModalHeading = "Add Coupon";
    this.ModalBtn = "Save";
  }

  updateCoupon(){

    const data={
      full_description:this.editform.value.full_description,
      auto_apply:this.editform.value.auto_apply,
      short_description:this.editform.value.short_description,
      created_by:localStorage.getItem('USERNAME') 
    };

    this.couponService.update(this.couponRecord.id,data).subscribe(
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
            this.spinner.hide();
          }
    });     

  }

  addData()
  {
    this.spinner.show();
    let id=this.couponRecord.id;
    // console.log(this.form.value);

    if(this.form.value.coupon_type==1 && this.form.value.bus_operator_id.length ==0)
    {
 
      this.notificationService.addToast({title:Constants.ErrorTitle,msg:"Bus Operator required", type:Constants.ErrorType});
      this.spinner.hide();
      return;
    }
    if(this.form.value.coupon_type==2 && this.form.value.route.length == 0)
    {
      this.notificationService.addToast({title:Constants.ErrorTitle,msg:"Route is required", type:Constants.ErrorType});
      this.spinner.hide();
      return;
    }

    if(this.form.value.coupon_type==3 && this.form.value.route.length == 0 && this.form.value.bus_operator_id.length ==0 )
    {
      this.notificationService.addToast({title:Constants.ErrorTitle,msg:"Operator & Route required", type:Constants.ErrorType});
      this.spinner.hide();
      return;
    }

    if(this.form.value.bus_id.length == 0){

      this.notificationService.addToast({title:Constants.ErrorTitle,msg:"Bus is required", type:Constants.ErrorType});
      this.spinner.hide();
      return;

    }

    const data={
      coupon_code:this.form.value.coupon_code,
      coupon_title:this.form.value.coupon_title,
      coupon_type:this.form.value.coupon_type,
      coupon_discount_type:this.form.value.coupon_discount_type,
      amount:this.form.value.amount,
      route:this.form.value.route,
      bus_id:this.form.value.bus_id,
     // destination_id:this.form.value.destination_id,
      full_description:this.form.value.full_description,
      max_discount_price:this.form.value.max_discount_price,
      max_redeem:this.form.value.max_redeem,
      auto_apply:this.form.value.auto_apply,
      min_tran_amount:this.form.value.min_tran_amount,
      percentage:this.form.value.percentage,
      short_description:this.form.value.short_description,
      valid_by:this.form.value.valid_by,
      from_date:this.form.value.from_date,
      to_date:this.form.value.to_date,
      bus_operator_id:this.form.value.bus_operator_id,
      created_by:localStorage.getItem('USERNAME') 
    };

   
    if(id==null)
    {
    this.couponService.create(data).subscribe(
      resp => { 

        if(resp.status==1)
        {
            this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
            this.modalReference.close();
           this.ResetAttributes();
            this.search(); 
        }        
        else{
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
            this.spinner.hide();
        }
      },
      error => {
        this.notificationService.notify(error.error.message,"Error");
        this.spinner.hide();   
  
      }
    );  
  }
  
  }

  

  edit_coupon(i,content:any)
  {

    this.ModalHeading = "Edit Coupon";
    this.ModalBtn = "Update";

    this.spinner.show();
    this.loadElements(i);
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  
  

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
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });

        }
      );
    }
    else
    {
      this.busOperatorService.readOne(BusOperator.USER_BUS_OPERATOR_ID).subscribe(
        record=>{
        this.busoperators=record.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });

        }
      );
    }

    this.locationService.readAll().subscribe(
      records => {
        this.locations = records.data;
      }
    );

    this.couponService.couponType().subscribe(
      records => {
        // console.log(records.data);
        this.couponType = records.data;
       
      }
    );
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
            this.spinner.hide();
          }
    }); 
}


changeStatus(event: Event, stsitem: any) {
  this.spinner.show();
  this.couponService.chngsts(stsitem).subscribe(
    resp => {
      if (resp.status == 1) {
        this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
        this.refresh();
      }
      else {
        this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
        this.spinner.hide();
      }
    }
  );
}

}
