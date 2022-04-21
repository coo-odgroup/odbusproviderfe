import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'cancelticket',
        loadChildren: () => import('./cancelticket/cancelticket.module').then(module => module.CancelTicketModule)
      },
      {
        path: 'adjustticket',
        loadChildren: () => import('./adjustticket/adjustticket.module').then(module => module.AdjustticketModule)
      },  
      {
        path: 'smsemailticket',
        loadChildren: () => import('./sms-email-ticket/sms-email-ticket.module').then(module => module.smsEmailTicketModule)
      },  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketInformationRoutingModule { }
