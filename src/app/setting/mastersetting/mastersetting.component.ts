import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {SettingsService} from '../../services/settings.service';
import { SettingsRecords } from '../../model/settings';
import { Constants } from '../../constant/constant';
import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import { NotificationService } from '../../services/notification.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-mastersetting',
  templateUrl: './mastersetting.component.html',
  styleUrls: ['./mastersetting.component.scss']
})
export class MastersettingComponent implements OnInit {

  
  settingRecord: SettingsRecords;
  message: string;

  constructor( private fb: FormBuilder,private settingsService:SettingsService, private notificationService:NotificationService,private sanitizer: DomSanitizer) { }
  public settingForm: FormGroup;

  imageSrc:any;
  iconSrc:any;
  imageError:any;
  imgURL: any;
  base64result:any;
  finalJson = {};
  public imageSizeFlag = true;


  ngOnInit(): void {
    this.settingForm=this.fb.group({
      payment_gateway_charges:[null, Validators.compose([Validators.required])],
      email_sms_charges:[null,Validators.compose([Validators.required])],
      odbus_gst_charges:[null,Validators.compose([Validators.required])],
      advance_days_show:[null, Validators.compose([Validators.required])],
      support_email:[null,Validators.compose([Validators.required])],
      booking_email:[null,Validators.compose([Validators.required])],
      request_email:[null,Validators.compose([Validators.required])],
      other_email:[null],
      mobile_no_1:[null,Validators.compose([Validators.required])],
      mobile_no_2:[null,Validators.compose([Validators.required])],
      mobile_no_3:[null,Validators.compose([Validators.required])],
      mobile_no_4:[null],
      logo:[null],
      iconSrc:[null]

    });
    this.settingsService.getbyId('1').subscribe(
      resp=>{       
        this.settingRecord=resp.data;
        this.settingForm.controls.payment_gateway_charges.setValue(this.settingRecord[0].payment_gateway_charges);
        this.settingForm.controls.email_sms_charges.setValue(this.settingRecord[0].email_sms_charges);
        this.settingForm.controls.odbus_gst_charges.setValue(this.settingRecord[0].odbus_gst_charges);
        this.settingForm.controls.advance_days_show.setValue(this.settingRecord[0].advance_days_show);
        this.settingForm.controls.support_email.setValue(this.settingRecord[0].support_email);
        this.settingForm.controls.booking_email.setValue(this.settingRecord[0].booking_email);
        this.settingForm.controls.request_email.setValue(this.settingRecord[0].request_email);
        this.settingForm.controls.other_email.setValue(this.settingRecord[0].other_email);
        this.settingForm.controls.mobile_no_1.setValue(this.settingRecord[0].mobile_no_1);
        this.settingForm.controls.mobile_no_2.setValue(this.settingRecord[0].mobile_no_2);
        this.settingForm.controls.mobile_no_3.setValue(this.settingRecord[0].mobile_no_3);
        this.settingForm.controls.mobile_no_4.setValue(this.settingRecord[0].mobile_no_4);
        this.settingForm.controls.iconSrc.setValue(this.settingRecord[0].logo);

        this.imgURL =this.sanitizer.bypassSecurityTrustResourceUrl(this.settingRecord[0].logo); 

      }
    );
      
  }
  updateVal()
  {
    const data={
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
      created_by:'Admin'
    };
    this.settingsService.update(1,data).subscribe(
      resp => {
        if(resp.status==1)
          {
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
          }
          else
          {
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
          }
    });
  }


    //////image validation////////
    public picked(event:any, fileSrc:any) {
      this.imageError = null;
              const max_size = 102400;
              //const allowed_types = ['image/svg+xml'];
              const allowed_types = ['image/x-png','image/gif','image/jpeg','image/jpg','image/svg+xml'];
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
      // if (!file.type.match(pattern)) {
      //   //alert('invalid format');
      //   return;
      // }
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
    getBannerImagepath(logo :any){
      let objectURL = 'data:image/*;base64,'+logo;
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
     }
  

}
