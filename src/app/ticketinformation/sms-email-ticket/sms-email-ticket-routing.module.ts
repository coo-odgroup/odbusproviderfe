import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SmsEmailTicketComponent} from './sms-email-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: SmsEmailTicketComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class smsEmailTicketRoutingModule { }
