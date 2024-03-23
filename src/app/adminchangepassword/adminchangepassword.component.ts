import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-adminchangepassword',
  templateUrl: './adminchangepassword.component.html',
  styleUrls: ['./adminchangepassword.component.scss']
})
export class AdminchangepasswordComponent implements OnInit {
  public pwdform: FormGroup;
  constructor(private fb: FormBuilder,
              private spinner: NgxSpinnerService,
              private notificationService: NotificationService,
              private userService: UserService,) { }

  ngOnInit(): void {
    this.pwdform = this.fb.group({
      password: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.required, Validators.maxLength(10)])],
      conf_password: [null, Validators.compose([Validators.required])]
    },
      { validator: this.checkPasswords });
  }



  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('password').value;
    const confirmPassword = group.get('conf_password').value;

    return password === confirmPassword ? null : { notSame: true }
  }
  ResetAttributes() {
    this.pwdform = this.fb.group({
      password: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.required, Validators.maxLength(10)])],
      conf_password: [null, Validators.compose([Validators.required])]
    },
      { validator: this.checkPasswords });

  }

  updatePassword() {
    this.spinner.show();
    let id = localStorage.getItem("USERID");
    const updateDate = {
        password: this.pwdform.value.password
      }
    this.userService.changepwd(id, updateDate).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.ResetAttributes();
          this.spinner.hide();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      }
    );


  }

}
