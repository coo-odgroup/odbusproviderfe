import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OwnerpaymentreportComponent} from './ownerpaymentreport.component';

const routes: Routes = [
  {
    path: '',
    component: OwnerpaymentreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerPaymentReportRoutingModule { }
