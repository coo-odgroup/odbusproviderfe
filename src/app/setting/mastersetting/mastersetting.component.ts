import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {SettingsService} from '../../services/settings.service';
import { SettingsRecords } from '../../model/settings';
import { BusOperatorService } from '../../services/bus-operator.service';
import { UserService } from '../../services/user.service';
import { Busoperator } from '../../model/busoperator';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import { NotificationService } from '../../services/notification.service';
import * as _ from 'lodash';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-mastersetting',
  templateUrl: './mastersetting.component.html',
  styleUrls: ['./mastersetting.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class MastersettingComponent implements OnInit {

  per_page=Constants.RecordLimit;
  searchBy='';
  confirmDialogReference: NgbModalRef;
  settings: SettingsRecords[];
  settingRecord: SettingsRecords;
  operators: Busoperator[];

  users:any=[];

  modalReference: NgbModalRef;
  message: string;
  imageSrc:any;
  iconSrc:any;
  imageError:any;
  favError:any;
  imgURL: any;
  favURL: any;
  footerImgURL: any;

  path = Constants.PATHURL;
  base64result:any;
  finalJson = {};
  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  public settingForm: FormGroup;
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
  //public message: string;
  public pagination: any;
  public imageSizeFlag = true;
  finalLogo: any;
  finalFavIcon: any;
  finalFootericon: any;
  og_image:any;
  favSrc: any[];
  footerIcoSrc: any[];
  all: any;
  role_id: any;
  usre_name:any ;
  man: boolean;
  has_is: boolean;
  man_val: number;
  has_is_val: string;
  pop_up_image: any;
  popup_status: number;
  pop: boolean;


  constructor( private spinner: NgxSpinnerService,private fb: FormBuilder,
    private settingsService:SettingsService, private notificationService:NotificationService,private sanitizer: DomSanitizer,config: NgbModalConfig,private modalService: NgbModal,private busOperartorService:BusOperatorService,private userService: UserService)
   {
    this.isSubmit = false;
    this.settingRecord= {} as SettingsRecords;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Master Settings";
    this.ModalBtn = "Save";
   }
  
  getAll(url:any=''){    
    this.spinner.show();
     const data= {
          name:this.searchForm.value.name,
          per_page:this.searchForm.value.per_page,
          role_id: localStorage.getItem('ROLE_ID'),
          userID: localStorage.getItem('USERID'),
     }; 
     this.settingsService.DataTable(url,data).subscribe(
            res=>{    
              this.settings= res.data.data.data; 
              this.pagination = res.data.data;
              this.all = res.data;
             //console.log(res.data.data.data);
              this.spinner.hide();
            },
    );
   }
   refresh()
    {
      this.searchForm =this.fb.group({
        name:[null],
        per_page:Constants.RecordLimit,
      })
      this.getAll();
    }
    page(label:any){
      return label;
     }
   OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }

  ngOnInit(): void {
      
      this.spinner.show();
      
    this.role_id= localStorage.getItem('ROLE_ID');
    this.usre_name= localStorage.getItem('USERNAME');

    this.searchForm =this.fb.group({
      name:[null],
      per_page:Constants.RecordLimit,
    })
    this.finalLogo =[null];
    this.finalFavIcon =[null];
    this.finalFootericon =[null];
    this.og_image =[null];
    this.pop_up_image =[null];


    this.settingForm=this.fb.group({
      payment_gateway_charges:[null, Validators.compose([Validators.required])],
      user_id: [null, Validators.compose([Validators.required])],
      email_sms_charges:[null,Validators.compose([Validators.required])],
      odbus_gst_charges:[null,Validators.compose([Validators.required])],
      customer_gst:[0],      
      advance_days_show:[null, Validators.compose([Validators.required])],
      busListingseq:[null, Validators.compose([Validators.required])],
      support_email:[null,Validators.compose([Validators.required])],
      booking_email:[null,Validators.compose([Validators.required])],
      request_email:[null,Validators.compose([Validators.required])],
      other_email:[],
      mobile_no_1:[null,Validators.compose([Validators.required])],
      mobile_no_2:[null,Validators.compose([Validators.required])],
      mobile_no_3:[null,Validators.compose([Validators.required])],
      mobile_no_4:[],
      maintenance:[null,Validators.compose([Validators.required])],
      has_issues:[null,Validators.compose([Validators.required])],
      seo_script:[],
      logo:[null],
      iconSrc:[null],
      favIcon:[null],
      favSrc:[null],
      user_name : localStorage.getItem('USERNAME'),
      logo_image:[null],
      favicon_image:[null],
      operator_slogan:[null],
      office_address_map:[null],
      office_address:[null],
      operator_home_content:[null],
      footer_logo:[null],
      google_verification_code:[null],
      bing_verification_code:[null],
      pintrest_verification_code:[null],
      google_analytics:[null],
      fb_page_id:[null],
      twitter_page_id:[null],
      no_script:[null],
      og_image:[null],
      pop_up_image:[null],
      popup_status:[null,Validators.compose([Validators.required])],
      popup_heading:[null],
      popup_url:[null],
      popup_description:[null],
      popup_start_date:[null],
      popup_start_time:[null],
      popup_end_date:[null],
      popup_end_time:[null]
    });

    this.formConfirm=this.fb.group({
      id:[null],
    });
    this.getAll();     
  }
  
    //////image validation////////
    public picked(event:any, fileSrc:any) {
      this.imageError = null;
              const max_size = 102400;
              const allowed_types = ['image/x-png','image/png','image/gif','image/jpeg','image/jpg','image/svg+xml'];
              const max_height = 100;
              const max_width = 200;
      let fileList: FileList = event.target.files;
      this.imageSizeFlag = true;
      if (event.target.files[0].size > max_size) {
        this.imageError =
            'Maximum size allowed is ' + max_size/1024  + 'Kb';
            this.settingForm.value.imagePath = '';
            this.imgURL='';
            this.imageSizeFlag = false;
        return false;
    }
    if (!_.includes(allowed_types, event.target.files[0].type)) {
  
        this.imageError = 'Only Images are allowed';
        this.settingForm.value.imagePath = '';
        this.settingForm.controls.slider_img.setValue('');
        this.imgURL='';
        return false;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
  
        image.onload = rs => {
            const img_height = rs.currentTarget['height'];
            const img_width = rs.currentTarget['width'];
  
            if (img_height > max_height && img_width > max_width) {
              this.imageError =
                  'Maximum dimentions allowed ' +
                  max_height +
                  '*' +
                  max_width +
                  'px';
                  this.settingForm.value.imagePath = '';
                  this.imgURL='';
              return false;
          } 
        };
    };
      if (fileList.length > 0) {
        const file: File = fileList[0];
        
          this.settingForm.value.File = file;
  
          this.handleInputChange(file); //turn into base64  
      }
      else {
        //alert("No file selected");
      }
      this.preview(fileSrc); 
    }

    
    handleInputChange(files) {
      let file = files;
      let pattern = /image-*/;
      let reader = new FileReader();
      reader.onloadend = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
      
    }
    _handleReaderLoaded(e) {
      let reader = e.target;
      this.base64result = reader.result.substr(reader.result.indexOf(',') + 1);
      this.imageSrc = this.base64result;
      this.settingForm.value.slider_img=this.base64result;
      this.settingForm.value.iconSrc=this.base64result;
      this.settingForm.controls.iconSrc.setValue(this.base64result); 
    }
    preview(files) {
      if (files.length === 0)
        return;
      let mimeType = files[0].type;
  
      if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
      }
      let reader = new FileReader();
      this.settingForm.value.logo = files;
      reader.readAsDataURL(files[0]); 
      reader.onload = (_event) => { 
        this.imgURL = reader.result; 
        // this.imgURL=this.sanitizer.bypassSecurityTrustResourceUrl(this.imgURL);
        this.finalLogo= files[0] ;
      }
    }


    Upload_og_image(event:any){
      this.og_image=event.target.files[0];      
      
    }


    Upload_pop_up_image(event:any){
      this.pop_up_image=event.target.files[0];      
    }


    public pickedfav(event:any) {

      this.favError = null;
              const max_size = 102400;
              const allowed_types = ['image/png','image/png','image/gif','image/jpeg','image/jpg','image/svg+xml'];
              const max_height = 100;
              const max_width = 200;
      let fileList: FileList = event.target.files;
      this.imageSizeFlag = true;
      if (event.target.files[0].size > max_size) {
        this.favError =
            'Maximum size allowed is ' + max_size/1024  + 'Kb';
            this.settingForm.value.imagePath = '';
            this.favURL='';
            this.imageSizeFlag = false;
        return false;
    }
    if (!_.includes(allowed_types, event.target.files[0].type)) {
        this.favError = 'Only Images are allowed';
        this.settingForm.value.imagePath = '';
        this.settingForm.controls.slider_img.setValue('');
        this.favURL='';
        return false;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
  
        image.onload = rs => {
            const img_height = rs.currentTarget['height'];
            const img_width = rs.currentTarget['width'];
  
            if (img_height > max_height && img_width > max_width) {
              this.favError =
                  'Maximum dimentions allowed ' +
                  max_height +
                  '*' +
                  max_width +
                  'px';
                  this.settingForm.value.imagePath = '';
                  this.favURL='';
              return false;
          } 
        };
    };
      if (fileList.length > 0) {
 
         const file: File = fileList[0];        
          this.settingForm.value.favIcon = file[0];  
          this.handleInputChangefav(file); //turn into base64 
          this.previewfav(fileList); 
      }
      else {
        //alert("No file selected");
      }

    }
    handleInputChangefav(files) {
      let file = files;
      let pattern = /image-*/;
      let reader = new FileReader();
      reader.onloadend = this._handleReaderLoadedfav.bind(this);
      reader.readAsDataURL(file);
      
    }
    _handleReaderLoadedfav(e) {
      let reader = e.target;
      this.base64result = reader.result.substr(reader.result.indexOf(',') + 1);
      this.imageSrc = this.base64result;
      this.settingForm.value.favSrc=this.base64result;
      this.settingForm.controls.favSrc.setValue(this.base64result); 
    }
    previewfav(files) {   
      if (files.length === 0)
      
        return;
      let mimeType = files[0].type;
      
      if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
      }
      let reader = new FileReader();
      this.settingForm.value.favIcon = files;
      reader.readAsDataURL(files[0]); 
      reader.onload = (_event) => { 
       
        this.favURL = reader.result; 
               
        this.finalFavIcon=  files[0];
      }
    }

    public pickedFooterImage(event:any) {
      this.favError = null;
              const max_size = 102400;
              const allowed_types = ['image/png','image/png','image/gif','image/jpeg','image/jpg','image/svg+xml'];
              const max_height = 100;
              const max_width = 200;
      let fileList: FileList = event.target.files;
      this.imageSizeFlag = true;
      if (event.target.files[0].size > max_size) {
        this.favError =
            'Maximum size allowed is ' + max_size/1024  + 'Kb';
            this.settingForm.value.imagePath = '';
            this.footerImgURL='';
            this.imageSizeFlag = false;
        return false;
    }
    if (!_.includes(allowed_types, event.target.files[0].type)) {
        this.favError = 'Only Images are allowed';
        this.settingForm.value.imagePath = '';
        this.settingForm.controls.slider_img.setValue('');
        this.footerImgURL='';
        return false;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
  
        image.onload = rs => {
            const img_height = rs.currentTarget['height'];
            const img_width = rs.currentTarget['width'];
  
            if (img_height > max_height && img_width > max_width) {
              this.favError =
                  'Maximum dimentions allowed ' +
                  max_height +
                  '*' +
                  max_width +
                  'px';
                  this.settingForm.value.imagePath = '';
                  this.footerImgURL='';
              return false;
          } 
        };
    };
      if (fileList.length > 0) {
 
         const file: File = fileList[0];        
          this.settingForm.value.footer_logo = file[0];  
          this.handleInputChangeFooterImage(file); //turn into base64 
          this.previewFooterImage(fileList); 
      }
      else {
        //alert("No file selected");
      }

    }
    handleInputChangeFooterImage(files) {
      let file = files;
      let pattern = /image-*/;
      let reader = new FileReader();
      reader.onloadend = this._handleReaderLoadedFooterImage.bind(this);
      reader.readAsDataURL(file);
      
    }
    _handleReaderLoadedFooterImage(e) {
      let reader = e.target;
      // this.base64result = reader.result.substr(reader.result.indexOf(',') + 1);
      // this.imageSrc = this.base64result;
      // this.settingForm.value.favSrc=this.base64result;
      // this.settingForm.controls.favSrc.setValue(this.base64result); 
    }
    previewFooterImage(files) {   
      if (files.length === 0)
      
        return;
      let mimeType = files[0].type;
      
      if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
      }
      let reader = new FileReader();
      this.settingForm.value.footer_logo = files;
      reader.readAsDataURL(files[0]); 
      reader.onload = (_event) => { 
       
        this.footerImgURL = reader.result;
        // console.log(this.footerImgURL) ;
               
        this.finalFootericon=  files[0];
      }
    }




    LoadAllService()
    {
      this.busOperartorService.readAll().subscribe(
        record=>{
        this.operators=record.data;
        this.operators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });
        }
      );

      ////// get all user list

      this.userService.getAllUser().subscribe(
        record=>{
        this.users=record.data;
        this.users.map((i: any) => { i.userData = i.name + '    (  ' + i.email  + '  )'; return i; });
        }
      );


    }
    ResetAttributes()
  {
    this.settingRecord = {} as SettingsRecords;

    this.finalLogo =[null];
    this.finalFavIcon =[null];
    this.finalFootericon =[null];
    this.og_image =[null];
    this.pop_up_image =[null];

    this.settingForm=this.fb.group({
      payment_gateway_charges:[null, Validators.compose([Validators.required])],
      user_id: [null],
      email_sms_charges:[null,Validators.compose([Validators.required])],
      odbus_gst_charges:[null,Validators.compose([Validators.required])],
      customer_gst:[0], 
      advance_days_show:[null, Validators.compose([Validators.required])],
      busListingseq:[null, Validators.compose([Validators.required])],
      support_email:[null,Validators.compose([Validators.required])],
      booking_email:[null,Validators.compose([Validators.required])],
      request_email:[null,Validators.compose([Validators.required])],
      other_email:[],
      mobile_no_1:[null,Validators.compose([Validators.required])],
      mobile_no_2:[null,Validators.compose([Validators.required])],
      mobile_no_3:[null,Validators.compose([Validators.required])],
      mobile_no_4:[],
      maintenance:[null,Validators.compose([Validators.required])],
      has_issues:[null,Validators.compose([Validators.required])],
      seo_script:[],
      logo:[null],
      iconSrc:[null],
      favIcon:[null],
      favSrc:[null],
      user_name : localStorage.getItem('USERNAME'),
      logo_image:[null],
      favicon_image:[null],
      operator_slogan:[null],
      office_address_map:[null],
      office_address:[null],
      operator_home_content:[null],
      footer_logo:[null],
      google_verification_code:[null],
      bing_verification_code:[null],
      pintrest_verification_code:[null],
      google_analytics:[null],
      fb_page_id:[null],
      twitter_page_id:[null],
      no_script:[null],
      og_image:[null],
      pop_up_image:[null],
      popup_status:[null,Validators.compose([Validators.required])],
      popup_heading:[null],
      popup_url:[null],
      popup_description:[null],
      popup_start_date:[null],
      popup_start_time:[null],
      popup_end_date:[null],
      popup_end_time:[null]
    });

    this.LoadAllService();
    this.ModalHeading = "Add Master Settings";
    this.ModalBtn = "Save";
    this.imgURL="";
    this.favURL="";
    this.imageSrc="";
    // this.settingRecord.logo="";  
  }
  addSettings()
  {
    this.spinner.show();
    

    let id = this.settingRecord?.id;
    if(this.role_id!=1){
      this.settingForm.controls.user_id.setValue(localStorage.getItem('USERID'));
    }
    if(this.settingForm.value.maintenance == true){
      this.man_val = 1;
    }else if(this.settingForm.value.maintenance == false){
      this.man_val = 0;
    }
    if(this.settingForm.value.has_issues == true){
      this.has_is_val = 'Y';
    }else if(this.settingForm.value.has_issues == false){
      this.has_is_val = 'N';
    }

    if(this.settingForm.value.popup_status == true){
      this.popup_status = 1;
    }else if(this.settingForm.value.popup_status == false){
      this.popup_status = 0;
    }

    let fd: any = new FormData();
    fd.append("favicon_image", this.finalFavIcon);
    fd.append("logo_image", this.finalLogo);
    fd.append("footer_logo", this.finalFootericon);
    fd.append("user_id",this.settingForm.value.user_id);
    fd.append("payment_gateway_charges",this.settingForm.value.payment_gateway_charges);
    fd.append("email_sms_charges",this.settingForm.value.email_sms_charges);
    fd.append("odbus_gst_charges",this.settingForm.value.odbus_gst_charges);
    fd.append("customer_gst",this.settingForm.value.customer_gst);
    fd.append("busListingseq",this.settingForm.value.busListingseq);
    fd.append("advance_days_show",this.settingForm.value.advance_days_show);
    fd.append("support_email",this.settingForm.value.support_email);
    fd.append("booking_email",this.settingForm.value.booking_email);
    fd.append("request_email",this.settingForm.value.request_email);
    fd.append("other_email",this.settingForm.value.other_email);
    fd.append("mobile_no_1",this.settingForm.value.mobile_no_1);
    fd.append("mobile_no_2",this.settingForm.value.mobile_no_2);
    fd.append("mobile_no_3",this.settingForm.value.mobile_no_3);
    fd.append("mobile_no_4",this.settingForm.value.mobile_no_4);
    fd.append("has_issues",this.has_is_val);
    fd.append("maintenance",this.man_val);
    fd.append("seo_script",this.settingForm.value.seo_script);
    fd.append("operator_slogan",this.settingForm.value.operator_slogan);
    fd.append("office_address",this.settingForm.value.office_address);
    fd.append("office_address_map",this.settingForm.value.office_address_map);
    fd.append("operator_home_content",this.settingForm.value.operator_home_content);
    fd.append("google_verification_code",this.settingForm.value.google_verification_code);
    fd.append("bing_verification_code",this.settingForm.value.bing_verification_code);
    fd.append("pintrest_verification_code",this.settingForm.value.pintrest_verification_code);
    fd.append("google_analytics",this.settingForm.value.google_analytics);
    fd.append("fb_page_id",this.settingForm.value.fb_page_id);
    fd.append("twitter_page_id",this.settingForm.value.twitter_page_id);
    fd.append("og_image",this.og_image);
    fd.append("popup_image",this.pop_up_image);
    fd.append("popup_status",this.popup_status);
    fd.append("popup_heading",this.settingForm.value.popup_heading);
    fd.append("popup_url",this.settingForm.value.popup_url);
    fd.append("popup_description",this.settingForm.value.popup_description);
    fd.append("popup_start_date",this.settingForm.value.popup_start_date);
    fd.append("popup_start_time",this.settingForm.value.popup_start_time);
    fd.append("popup_end_date",this.settingForm.value.popup_end_date);
    fd.append("popup_end_time",this.settingForm.value.popup_end_time);

    fd.append("no_script",this.settingForm.value.no_script);
    fd.append("created_by",localStorage.getItem('USERNAME'));
 
   
//     console.log(this.settingForm.value);
// return
   
    if (id != null) {

      fd.append("id",  this.settingRecord?.id);
//       for (var pair of fd.entries()) {
//         console.log(pair[0]+ ', ' + pair[1]); 
//     }  
// return;
      this.settingsService.update(fd).subscribe(
        resp => {
          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.getAll();
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
            this.spinner.hide();
            
          }
        }
      );
    }
    else {
      this.settingsService.create(fd).subscribe(
        resp => {
          if (resp.status == 1) {

            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.getAll(); 
          }
          else {

            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
            this.spinner.hide();
          }
        }
      );
    }
  }
  ngAfterViewInit(): void {   
  }
  ngOnDestroy(): void {  
  }
  rerender(): void {  
  }
  editSettings(id)
  { 
    
    this.settingRecord = this.settings[id]; 
    // console.log(this.settingRecord);
    // console.log(this.settingRecord.maintenance);
    if(this.settingRecord.maintenance == 1){
      this.man = true;
    }else{
      this.man = false;
    }
    if(this.settingRecord.has_issues == 'Y'){
      this.has_is = true;
    }else{
      this.has_is = false;
    }

    if(this.settingRecord.popup_status == 1){
      this.pop = true;
    }else{
      this.pop = false;
    }
  
    this.imgURL =''; 
    this.favURL =''; 
    this.footerImgURL ='';
    this.settingForm=this.fb.group({
      id:[this.settingRecord.id],
      user_id:[this.settingRecord.user_id],
      payment_gateway_charges:[this.settingRecord.payment_gateway_charges],
      email_sms_charges:[this.settingRecord.email_sms_charges],
      odbus_gst_charges:[this.settingRecord.odbus_gst_charges],
      customer_gst:[this.settingRecord.customer_gst],
      advance_days_show:[this.settingRecord.advance_days_show],
      busListingseq:[this.settingRecord.bus_list_sequence],
      support_email:[this.settingRecord.support_email],
      booking_email:[this.settingRecord.booking_email],
      request_email:[this.settingRecord.request_email],
      other_email:[this.settingRecord.other_email],
      mobile_no_1:[this.settingRecord.mobile_no_1],
      mobile_no_2:[this.settingRecord.mobile_no_2],
      mobile_no_3:[this.settingRecord.mobile_no_3],
      mobile_no_4:[this.settingRecord.mobile_no_4],
      maintenance:[this.man],
      has_issues:[this.has_is],
      seo_script:[this.settingRecord.seo_script],
      logo: [],
      favIcon:[],
      iconSrc:[this.settingRecord.logo],
      favSrc:[this.settingRecord.favIcon],
      operator_slogan:[this.settingRecord.operator_slogan],
      office_address_map:[this.settingRecord.office_address_map],
      office_address:[this.settingRecord.office_address],
      operator_home_content:[this.settingRecord.operator_home_content],
      footer_logo:[null],
      google_verification_code:[this.settingRecord.google_verification_code],
      bing_verification_code:[this.settingRecord.bing_verification_code],
      pintrest_verification_code:[this.settingRecord.pintrest_verification_code],
      google_analytics:[this.settingRecord.google_analytics],
      fb_page_id:[this.settingRecord.fb_page_id],
      twitter_page_id:[this.settingRecord.twitter_page_id],
      no_script:[this.settingRecord.no_script],
      og_image:[],
      popup_image:[],
      popup_status:[this.pop],
      popup_heading:[this.settingRecord.popup_heading],
      popup_url:[this.settingRecord.popup_url],
      popup_description:[this.settingRecord.popup_description],
      popup_start_date:[this.settingRecord.popup_start_date],
      popup_start_time:[this.settingRecord.popup_start_time],
      popup_end_date:[this.settingRecord.popup_end_date],
      popup_end_time:[this.settingRecord.popup_end_time]

    });

    //console.log(this.settingForm);

    this.LoadAllService();
    this.ModalHeading = "Edit Master Settings";
    this.ModalBtn = "Update";  
  }
  getImagepath(logo :any){
    let objectURL = 'data:image/*;base64,'+logo;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
   }

  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.settingRecord = this.settings[id];  
  }
  deleteRecord() {

    let delitem = this.settingRecord.id;
    this.settingsService.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.confirmDialogReference.close();
          this.ResetAttributes();
          this.getAll();         
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      });
  }
  changeStatus(event : Event, stsitem:any)
  {
    
  this.spinner.show();
    this.settingsService.chngsts(stsitem).subscribe(
      resp => {
        if(resp.status==1)
        {
            this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
            this.rerender();
            this.getAll();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
      }
    );
  }

  removePopup(id){
    this.spinner.show();

    this.settingsService.removePopup(id).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.modalReference.close();
          this.ResetAttributes();
          this.getAll();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
          
        }
      }
    );
  }
  

}
