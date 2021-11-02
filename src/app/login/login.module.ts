import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import {SharedModule} from '../theme/shared/shared.module';
import {FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import {NotificationService} from '../services/notification.service';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    FormsModule
  ],
  declarations: [ LoginComponent],
  providers:[NotificationService]
})
export class LoginModule { }