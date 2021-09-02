import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FailedtransactionreportComponent} from './failedtransactionreport.component';

const routes: Routes = [
  {
    path: '',
    component: FailedtransactionreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FailedTransactionReportRoutingModule { }
