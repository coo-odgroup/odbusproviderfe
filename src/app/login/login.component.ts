import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import {Login} from '../model/login';
import {RoleService} from '.././services/role.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import{Constants} from '../constant/constant';
import { EncryptionService } from '../encrypt.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public loginRecord:Login;
  // usertypes: [] ;

  public saveUsername:boolean;
  public onSaveUsernameChanged(value:boolean){
      this.saveUsername = value;
  }

  

  constructor(public router: Router,protected fb:FormBuilder, private loginService: LoginService, private notificationService: NotificationService,private notify: NotificationService,private roleService: RoleService,private enc:EncryptionService) {

   sessionStorage.clear();
  }
 
  ngOnInit() {
   sessionStorage.clear();

    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      // user_type: [null, Validators.compose([Validators.required])],
    });  
  }
  ResetForm()
  {
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      // user_type: [null, Validators.compose([Validators.required])],
    });
  }
  check_credentials()
  {
    const data={
      email:this.form.value.email,
      password:this.form.value.password,
      // user_type:this.form.value.user_type, 
      user_type:1, 
    };

    this.loginService.checkLogin(data).subscribe(

      res=>{
                 
        if(res.status==1){ 
          let loginRecord:any=this.enc.decrypt(res.data);
          loginRecord=JSON.parse(loginRecord);
          this.loginRecord=loginRecord;          
          // console.log(this.loginRecord);
          sessionStorage.setItem("USERRECORDS",JSON.stringify(this.loginRecord));
          sessionStorage.setItem("USERID",JSON.stringify(this.loginRecord.id)); 
          sessionStorage.setItem("ROLE_ID",JSON.stringify(this.loginRecord.role_id)); 
          sessionStorage.setItem("USERNAME",this.loginRecord.name); 
          sessionStorage.setItem("TOKEN",this.loginRecord.admin_login_token); 
          sessionStorage.setItem("USER_BUS_OPERATOR_ID",''); 
          if(this.loginRecord.role_id==4)
          {
            sessionStorage.setItem("BUS_OPERATOR_ID",this.loginRecord.bus_operator_id); 
          }
          // var ROLE_ID = sessionStorage.getItem("ROLE_ID");
          // var USERID = sessionStorage.getItem("USERID");
          // console.log("ROLE ID : "+ROLE_ID+", USER ID : "+USERID);
          this.router.navigate(['dashboard/landing']);
        }else{
          this.notify.notify(res.message,"Error");
        }    
      },
      error => {
       this.notify.notify(error.error.message,"Error");
      }
    );
  }

}
