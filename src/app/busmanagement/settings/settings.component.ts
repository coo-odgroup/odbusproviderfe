import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {SettingsService} from '../../services/settings.service';
import { SettingsRecords } from '../../model/settings';
import { Constants } from '../../constant/constant';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {

  
  settingRecord: SettingsRecords;

  constructor( private fb: FormBuilder,private settingsService:SettingsService, private notificationService:NotificationService) { }
  public settingForm: FormGroup;
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

}
