import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperatorbookingreportComponent } from './operatorbookingreport.component';

const routes: Routes = [
  {
    path: '',
    component: OperatorbookingreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorBookingReportRoutingModule { }