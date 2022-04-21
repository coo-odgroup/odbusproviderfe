import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { smsEmailTicketRoutingModule } from './sms-email-ticket-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { SmsEmailTicketComponent } from './sms-email-ticket.component';
import {NotificationService} from '../../services/notification.service';
import {NgxPrintModule} from 'ngx-print';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    smsEmailTicketRoutingModule,
    SharedModule,
    FormsModule,NgbModule,
    NgxPrintModule,NgxSpinnerModule
    ],
  declarations: [ SmsEmailTicketComponent],
  providers:[NotificationService], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class smsEmailTicketModule { }