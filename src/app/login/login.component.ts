import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import {Login} from '../model/login';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import{Constants} from '../constant/constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public loginRecord:Login;
  usertypes = [
    { id: 1, role: 'User' },
    { id: 2, role: 'Admin' },
    { id: 3, role: 'Super Admin' },
    { id: 4, role: 'Operator' },
    { id: 4, role: 'Agent' },
  ];
  constructor(public router: Router,protected fb:FormBuilder, private loginService: LoginService, private notificationService: NotificationService,private notify: NotificationService) {}
  ngOnInit() {
    this.form = this.fb.group({
      //username: [null, Validators.compose([Validators.required])],
      //password: [null, Validators.compose([Validators.required])],
      phone: ['', [Validators.required,Validators.pattern("^[0-9]{10}$")]],
      user_type: [null, Validators.compose([Validators.required])],
    });  
  }
  ResetForm()
  {
    this.form = this.fb.group({
      //username: [null, Validators.compose([Validators.required])],
      //password: [null, Validators.compose([Validators.required])],
      phone: ['', [Validators.required,Validators.pattern("^[0-9]{10}$")]],
      user_type: [null, Validators.compose([Validators.required])],
    });
  }
  check_credentials()
  {
    const data={
      //email:this.form.value.username,
      //password:this.form.value.password
      phone:this.form.value.phone,
      user_type:this.form.value.user_type, 
    };
    this.loginService.checkLogin(data).subscribe(

      res=>{
                 
        if(res.status==1){ 
          //console.log(res); 
          this.loginRecord=res.data;
          localStorage.setItem("USERRECORDS",JSON.stringify(this.loginRecord));
          localStorage.setItem("USERID",JSON.stringify(this.loginRecord.id));
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
      //    this.loginRecord=res.data;
      //    if(res.data.message==0)
      //    {
      //       res.message="Invalid Login phone/otp";
      //       this.notificationService.addToast({title:Constants.ErrorTitle,msg:res.message, type:Constants.ErrorType});
      //       this.ResetForm();
      //    }
      //    else
      //    {
      //     localStorage.setItem("USERRECORDS",JSON.stringify(this.loginRecord));
      //     localStorage.setItem("USERID",JSON.stringify(this.loginRecord.id));
      //     //localStorage.setItem("USEREMAIL",JSON.stringify(this.loginRecord.email));
      //     //localStorage.setItem("USERLASTLOGIN",JSON.stringify(this.loginRecord.last_login));
      //     //this.router.navigate(['dashboard/landing']);
      //     this.router.navigate(['otp']);
      //    }
      // }
    );
  }

}
