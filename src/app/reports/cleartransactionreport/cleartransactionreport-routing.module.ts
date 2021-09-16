import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CleartransactionreportComponent} from './cleartransactionreport.component';

const routes: Routes = [
  {
    path: '',
    component: CleartransactionreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClearTransactionReportRoutingModule { }
