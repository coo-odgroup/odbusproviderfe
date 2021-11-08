import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'seatopenReport',
        loadChildren: () => import('./seatopenreport/seatopenreport.module').then(module => module.SeatOpenReportModule)
      },
      {
        path: 'seatblockReport',
        loadChildren: () => import('./seatblockreport/seatblockreport.module').then(module => module.SeatBlockReportModule)
      },
      {
        path: 'extraseatopenReport',
        loadChildren: () => import('./extraseatopenreport/extraseatopenreport.module').then(module => module.ExtraSeatOpenReportModule)
      },
      {
        path: 'completeReport',
        loadChildren: () => import('./completereport/completereport.module').then(module => module.CompleteReportModule)
      },
      {
        path: 'cancleticketsReport',
        loadChildren: () => import('./cancelticketsreport/cancelticketsreport.module').then(module => module.CancleTicketsReportModule)
      },
      {
        path: 'failedtransactionreport',
        loadChildren: () => import('./failedtransactionreport/failedtransactionreport.module').then(module => module.FailedTransactionReportModule)
      },
      {
        path: 'buscancellationreport',
        loadChildren: () => import('./buscancellationreport/buscancellationreport.module').then(module => module.BusCancellationReportModule)
      },
      {
        path: 'ownerpaymentreport',
        loadChildren: () => import('./ownerpaymentreport/ownerpaymentreport.module').then(module => module.OwnerPaymentReportModule)
      },
      {
        path: 'cleartransactionreport',
        loadChildren: () => import('./cleartransactionreport/cleartransactionreport.module').then(module => module.ClearTransactionReportModule)
      },
      {
        path: 'couponuseduserreport',
        loadChildren: () => import('./couponuseduserreport/couponuseduserreport.model').then(module => module.CouponUsedUserReportModule)
      },
      {
        path: 'contactreport',
        loadChildren: () => import('./contactreport/contactreport.module').then(module => module.ContactReportModule)
      }, 
      {
        path: 'agentwalletrequest',
        loadChildren: () => import('./agentwalletrequest/agentwalletrequest.module').then(module => module.AgentWalletRequestReportModule)
      }                  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
