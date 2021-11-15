import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {SettingsService} from '../../services/settings.service';
import { SettingsRecords } from '../../model/settings';
import { BusOperatorService } from '../../services/bus-operator.service';
import { Busoperator } from '../../model/busoperator';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import { NotificationService } from '../../services/notification.service';
import * as _ from 'lodash';

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
  modalReference: NgbModalRef;
  message: string;
  imageSrc:any;
  iconSrc:any;
  imageError:any;
  favError:any;
  imgURL: any;
  favURL: any;

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

  constructor( private fb: FormBuilder,private settingsService:SettingsService, private notificationService:NotificationService,private sanitizer: DomSanitizer,config: NgbModalConfig,private modalService: NgbModal,private busOperartorService:BusOperatorService)
   {
    this.isSubmit = false;
    this.settingRecord= {} as SettingsRecords;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Master Settings";
    this.ModalBtn = "Save";
   }
  
  getAll(url:any=''){
     const data= {
          name:this.searchForm.value.name,
          per_page:this.searchForm.value.per_page
     }; 
     this.settingsService.DataTable(url,data).subscribe(
            res=>{    
              this.settings= res.data.data.data; 
              this.pagination = res.data.data;
              // console.log(res.data.data.data);
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
    
    this.searchForm =this.fb.group({
      name:[null],
      per_page:Constants.RecordLimit,
    })
    this.settingForm=this.fb.group({
      payment_gateway_charges:[null, Validators.compose([Validators.required])],
      email_sms_charges:[null,Validators.compose([Validators.required])],
      odbus_gst_charges:[null,Validators.compose([Validators.required])],
      advance_days_show:[null, Validators.compose([Validators.required])],
      support_email:[null,Validators.compose([Validators.required])],
      booking_email:[null,Validators.compose([Validators.required])],
      request_email:[null],
      other_email:[null],
      mobile_no_1:[null,Validators.compose([Validators.required])],
      mobile_no_2:[null,Validators.compose([Validators.required])],
      mobile_no_3:[null],
      mobile_no_4:[null],
      logo:[null],
      iconSrc:[null],
      favIcon:[null],
      favSrc:[null],
      user_name : localStorage.getItem('USERNAME'),
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
        this.imgURL=this.sanitizer.bypassSecurityTrustResourceUrl(this.imgURL);
      }
    }



    public pickedfav(event:any, fileSrc:any) {
      this.favError = null;
              const max_size = 102400;
              const allowed_types = ['image/x-png','image/png','image/gif','image/jpeg','image/jpg','image/svg+xml'];
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
        
          this.settingForm.value.File = file;
  
          this.handleInputChangefav(file); //turn into base64  
      }
      else {
        //alert("No file selected");
      }
      this.previewfav(fileSrc); 
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
        this.favURL=this.sanitizer.bypassSecurityTrustResourceUrl(this.favURL);
      }
    }



    LoadAllService()
    {
      this.busOperartorService.readAll().subscribe(
        record=>{
        this.operators=record.data;
        }
      );
    }
    ResetAttributes()
  {
    this.settingForm = this.fb.group({
      id:[null],
      bus_operator_id: [null, Validators.compose([Validators.required])],
      payment_gateway_charges: [null, Validators.compose([Validators.required])],
      email_sms_charges: [null, Validators.compose([Validators.required])],
      odbus_gst_charges:[null, Validators.compose([Validators.required])],
      advance_days_show:[null, Validators.compose([Validators.required])],
      support_email: [null, Validators.compose([Validators.required])],
      booking_email: [null, Validators.compose([Validators.required])],
      request_email: [null],
      other_email: [null],
      mobile_no_1: [null, Validators.compose([Validators.required])],
      mobile_no_2: [null, Validators.compose([Validators.required])],
      mobile_no_3: [null],
      mobile_no_4: [null],
      logo:[null],
      iconSrc:[null],
      favIcon:[null],
      favSrc:[null],
      user_name : localStorage.getItem('USERNAME'),
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

    this.finalJson = {
      "File": this.imageSrc,
    }
    const data ={
      bus_operator_id:this.settingForm.value.bus_operator_id,
      payment_gateway_charges:this.settingForm.value.payment_gateway_charges,
      email_sms_charges:this.settingForm.value.email_sms_charges,
      odbus_gst_charges:this.settingForm.value.odbus_gst_charges,
      advance_days_show:this.settingForm.value.advance_days_show,
      support_email:this.settingForm.value.support_email,
      booking_email:this.settingForm.value.booking_email,
      request_email:this.settingForm.value.request_email,
      other_email:this.settingForm.value.other_email,
      mobile_no_1:this.settingForm.value.mobile_no_1,
      mobile_no_2:this.settingForm.value.mobile_no_2,
      mobile_no_3:this.settingForm.value.mobile_no_3,
      mobile_no_4:this.settingForm.value.mobile_no_4,
      logo:this.settingForm.value.iconSrc,
      favIcon:this.settingForm.value.favSrc,      
      created_by:localStorage.getItem('USERNAME'),
    };
    let id = this.settingRecord?.id;
    if (id != null) {
      this.settingsService.update(id, data).subscribe(
        resp => {
          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.getAll();
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          }
        }
      );
    }
    else {
      this.settingsService.create(data).subscribe(
        resp => {
          if (resp.status == 1) {

            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.getAll(); 
          }
          else {

            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
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
    this.imgURL =this.sanitizer.bypassSecurityTrustResourceUrl(this.settingRecord.logo); 
    this.favURL =this.sanitizer.bypassSecurityTrustResourceUrl(this.settingRecord.favIcon); 
    this.settingForm=this.fb.group({
      id:[this.settingRecord.id],
      bus_operator_id:[this.settingRecord.bus_operator_id],
      payment_gateway_charges:[this.settingRecord.payment_gateway_charges],
      email_sms_charges:[this.settingRecord.email_sms_charges],
      odbus_gst_charges:[this.settingRecord.odbus_gst_charges],
      advance_days_show:[this.settingRecord.advance_days_show],
      support_email:[this.settingRecord.support_email],
      booking_email:[this.settingRecord.booking_email],
      request_email:[this.settingRecord.request_email],
      other_email:[this.settingRecord.other_email],
      mobile_no_1:[this.settingRecord.mobile_no_1],
      mobile_no_2:[this.settingRecord.mobile_no_2],
      mobile_no_3:[this.settingRecord.mobile_no_3],
      mobile_no_4:[this.settingRecord.mobile_no_4],
      logo: [],favIcon:[],
      iconSrc:[this.settingRecord.logo],
      favSrc:[this.settingRecord.favIcon]
      
    });
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
        }
      });
  }
  changeStatus(event : Event, stsitem:any)
  {
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
  

}
