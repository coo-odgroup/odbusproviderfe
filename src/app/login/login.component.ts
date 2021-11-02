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
  constructor(public router: Router,protected fb:FormBuilder, private loginService: LoginService, private notificationService: NotificationService) {}
  ngOnInit() {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
    });  
  }
  ResetForm()
  {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
    });
  }
  check_credentials()
  {
    const data={
      email:this.form.value.username,
      password:this.form.value.password
    };
    this.loginService.checkLogin(data).subscribe(
      res => {
         
         this.loginRecord=res.data;
         if(res.data.length==0)
         {
            res.message="Invalid Login ID/Password";
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:res.message, type:Constants.ErrorType});
            this.ResetForm();
         }
         else
         {
          localStorage.setItem("USERRECORDS",JSON.stringify(this.loginRecord));
          localStorage.setItem("USERID",JSON.stringify(this.loginRecord.id));
          localStorage.setItem("USEREMAIL",JSON.stringify(this.loginRecord.email));
          localStorage.setItem("USERLASTLOGIN",JSON.stringify(this.loginRecord.last_login));
          this.router.navigate(['dashboard/landing']);
         }
      }
    );
  }

}
