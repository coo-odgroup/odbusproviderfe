import { TicketInformationRoutingModule } from './ticketinformation-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../theme/shared/shared.module';
import { CancelticketComponent } from './cancelticket/cancelticket.component';
import { AdjustticketComponent } from './adjustticket/adjustticket.component';
import { SmsEmailTicketComponent } from './sms-email-ticket/sms-email-ticket.component';
import { FailedticketadjustComponent } from './failedticketadjust/failedticketadjust.component';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    SharedModule,
    TicketInformationRoutingModule
  ]
})
export class TicketinformationModule { }
