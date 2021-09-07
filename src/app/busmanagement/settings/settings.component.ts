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
      odbus_gst_charges:[null,Validators.compose([Validators.required])]
    });
    this.settingsService.getbyId('1').subscribe(
      resp=>{
        
        this.settingRecord=resp.data;
        this.settingForm.controls.payment_gateway_charges.setValue(this.settingRecord[0].payment_gateway_charges);
        this.settingForm.controls.email_sms_charges.setValue(this.settingRecord[0].email_sms_charges);
        this.settingForm.controls.odbus_gst_charges.setValue(this.settingRecord[0].odbus_gst_charges);
      }
    );
   
    
  }
  updateVal()
  {
    const data={
      payment_gateway_charges:this.settingForm.value.payment_gateway_charges,
      email_sms_charges:this.settingForm.value.email_sms_charges,
      odbus_gst_charges:this.settingForm.value.odbus_gst_charges,
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
