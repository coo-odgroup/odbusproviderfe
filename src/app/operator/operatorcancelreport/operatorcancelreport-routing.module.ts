import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperatorcancelreportComponent } from './operatorcancelreport.component';

const routes: Routes = [
  {
    path: '',
    component: OperatorcancelreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorCancelReportRoutingModule { }