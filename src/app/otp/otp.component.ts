import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup , Validators  } from "@angular/forms";
import { OTPService } from '../services/otp.service';
import { NotificationService } from '../services/notification.service';
//import { NgxSpinnerService } from "ngx-spinner";
import { LoginService } from '../services/login.service';
import { SignupService } from '../services/signup.service';
//import { LoginChecker } from '../helpers/loginChecker';
import {NgbAlertConfig} from '@ng-bootstrap/ng-bootstrap';
import { EncryptionService } from '../encrypt.service';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  providers: [NgbAlertConfig]
})
export class OtpComponent implements OnInit {

  otpForm: FormGroup;
  submitted = false;
  userId: any;
  public mobileNo: any;
  ResendOtp :boolean=false;
  ResendTimer :boolean=true;

  Timer= 20;  
  alert:any='';

  constructor( public router: Router,
      public fb: FormBuilder, 
      private notify: NotificationService,    
      private otpService : OTPService,
      //private spinner: NgxSpinnerService,
      public loginService: LoginService,
      private signupService: SignupService,  
      private enc:EncryptionService,
      private alertConfig: NgbAlertConfig  
  ) { 

    alertConfig.type = 'success';
    alertConfig.dismissible = false;

    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    })
  }

  get f() { return this.otpForm.controls; }

  onSubmit() {

    this.submitted = true;

     // stop here if form is invalid
     if (this.otpForm.invalid) {
      return;
     }else{ 
      const param ={
                    userId : this.userId,
                    otp : this.otpForm.value.otp
                   };
      this.otpService.submit_otp(param).subscribe(
        res=>{ 
          if(res.status==1){
            let data:any=this.enc.decrypt(res.data[0]);
            data=JSON.parse(data);
            localStorage.setItem('user', JSON.stringify(data));

            this.router.navigate(['agentDetails']);     
          }
          else{
            this.notify.notify(res.message,"Error");
          }
      },
      error => {
        this.notify.notify(error.error.message,"Error");

      }
      );

     }
  }

  ngOnInit(): void {
 
    this.userId = localStorage.getItem('USERID');
    if(this.userId=='' || this.userId==null){
      this.router.navigate(['']);
    }

  }

}
