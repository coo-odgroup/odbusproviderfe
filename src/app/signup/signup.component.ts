import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupService } from '../services/signup.service';
import {Signup} from '../model/signup';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import{Constants} from '../constant/constant';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public form: FormGroup;
  public signupRecord:Signup;

  usertypes = [
    { id: 1, role: 'User' },
    { id: 2, role: 'Admin' },
    { id: 3, role: 'Super Admin' },
    { id: 4, role: 'Operator' },
    { id: 4, role: 'Agent' },
  ];

  constructor(public router: Router,protected fb:FormBuilder, private signupService: SignupService, private notificationService: NotificationService,private notify: NotificationService) {}
  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      phone: ['', [Validators.required,Validators.pattern("^[0-9]{10}$")]],
      //phone: [null, Validators.compose([Validators.required])],
      user_type: [null, Validators.compose([Validators.required])],
    });  
  }
  ResetForm()
  {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      phone: ['', [Validators.required,Validators.pattern("^[0-9]{10}$")]],
      //phone: [null, Validators.compose([Validators.required])],
      user_type: [null, Validators.compose([Validators.required])],
    });
  }
  check_credentials()
  {
    const data={
      phone:this.form.value.phone,
      name:this.form.value.name,
      user_type:this.form.value.user_type, 
    };
    let sentTo='';
    sentTo=this.form.value.phone;
    this.signupService.signup(data).subscribe(
      res=>{
                 
        if(res.status==1){ 
          //console.log(res); 
          this.signupRecord=res.data;
          localStorage.setItem("USERRECORDS",JSON.stringify(this.signupRecord));
          localStorage.setItem("USERID",JSON.stringify(this.signupRecord.id));
          this.router.navigate(['otp']);
          
        }else{
          this.notify.notify(res.message,"Error");
        }    
      },
      error => {
       this.notify.notify(error.error.message,"Error");
      }
      // res => {
      //    //console.log(res);
      //    this.signupRecord=res.data;
      //    if(res.data.length==0)
      //    {
      //       res.message="Invalid";
      //       this.notificationService.addToast({title:Constants.ErrorTitle,msg:res.message, type:Constants.ErrorType});
      //       this.ResetForm();
      //    }
      //    else
      //    {
      //     localStorage.setItem("USERRECORDS",JSON.stringify(this.signupRecord));
      //     localStorage.setItem("USERID",JSON.stringify(this.signupRecord.id));
      //     localStorage.setItem("USERNAME",JSON.stringify(this.signupRecord.name));
      //     localStorage.setItem("USERPHONE",JSON.stringify(this.signupRecord.phone));
      //     localStorage.setItem("USERROLE",JSON.stringify(this.signupRecord.user_type));
      //     localStorage.setItem("otp_type",'signup');
      //     this.signupService.setAlert("OTP has been sent to "+sentTo);
      //     this.router.navigate(['otp']);
         
      //    }
      //}
    );
  }

}
