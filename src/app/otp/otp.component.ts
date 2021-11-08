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

  ResendOtp :boolean=false;
  ResendTimer :boolean=true;

  Timer= 20;  
  alert:any='';

  // @Input()
  // session: LoginChecker; 

  constructor( public router: Router,
      public fb: FormBuilder, 
      private notify: NotificationService,    
      private otpService : OTPService,
      //private spinner: NgxSpinnerService,
      public loginService: LoginService,
      private signupService: SignupService,  
      private alertConfig: NgbAlertConfig  
  ) { 

    alertConfig.type = 'success';
    alertConfig.dismissible = false;

    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    })

    let typ= localStorage.getItem('otp_type');

    if(typ=='login'){
      this.loginService.currentalert.subscribe((message:any) => { this.alert = message; }); 
    }

    if(typ=='signup'){
      this.signupService.currentalert.subscribe((message:any) => { this.alert = message; }); 
    }
      
  }


  handleEvent(event:any){    
    if(event.action === 'done'){

      this.ResendOtp=true;
      this.ResendTimer=false;
    }
  }

  get f() { return this.otpForm.controls; }

  onSubmit() {

    this.submitted = true;

     // stop here if form is invalid
     if (this.otpForm.invalid) {
      return;
     }else{ 

      //this.spinner.show();

      const param ={
                    userId : this.userId,
                    otp : this.otpForm.value.otp
                   };
      this.otpService.submit_otp(param).subscribe(
        res=>{ 
          
          if(res.status==1){
            localStorage.setItem('user', JSON.stringify(res.data[0]) );
            localStorage.removeItem('userId');
            localStorage.removeItem('otp_type');
            localStorage.removeItem('resendParam');
            this.notify.notify('OTP verification is successful',"Success");
            //this.router.navigate(['dashboard']);
            this.router.navigate(['dashboard/landing']);
              
          }
          else{
            this.notify.notify(res.message,"Error");
          }

          //this.spinner.hide();
      },
      error => {

        //this.spinner.hide();
        //console.log(error.error.message);
        this.notify.notify(error.error.message,"Error");

      }
      );

     }
  }
  resend_otp(){
    //this.spinner.show();
    this.ResendOtp=false;
    let via= localStorage.getItem('via');
    let typ= localStorage.getItem('otp_type');
    let param = JSON.parse(localStorage.getItem('USERRECORDS'));

    if(typ=='login'){

      this.loginService.checkLogin(param).subscribe(
        res => {
          if(res.status==1){ 

            if(res.message=="Not a Registered User"){

              this.notify.notify(res.message,"Error");

            }else{  
              //this.ResendTimer=true;
              this.loginService.setAlert("OTP has been sent to "+via);
              //this.loginService.setAlert("OTP has been sent");
              this.router.navigate(['otp']);
             //this.notify.notify("OTP has been sent to "+via,"Success"); 
            } 
           }
           //this.spinner.hide();
          
        }
      );

    }

    if(typ=='signup'){

      this.signupService.signup(param).subscribe(
        res=>{
          //this.spinner.hide();   
               
          if(res.status==1){            
            //this.ResendTimer=true;
            //localStorage.setItem('userId',res.data.id);
            this.signupService.setAlert("OTP has been sent to "+via);
            //this.signupService.setAlert("OTP has been sent");
            this.router.navigate(['otp']);
            //this.notify.notify("OTP has been sent to "+via,"Success");

          }
           else if(res.status==0){
              this.notify.notify(res.message,"Error");
            }
        }
      ); 

    }


  }

  ngOnInit(): void {
 
    this.userId = localStorage.getItem('USERID');
    
    // if(this.userId=='' || this.userId==null){
    //   this.router.navigate(['']);
    // }

    //this.session = new LoginChecker();
    //if(this.session.isLoggedIn()){   
      //this.router.navigate(['dashboard/landing']);
      //this.router.navigate(['otp']);
    //}


  }

}
