import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CouponuseduserreportComponent} from './couponuseduserreport.component';

const routes: Routes = [
  {
    path: '',
    component: CouponuseduserreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponUsedUserReportRoutingModule { }
