import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CancelticketsreportComponent} from './cancelticketsreport.component';

const routes: Routes = [
  {
    path: '',
    component: CancelticketsreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancleTicketsReportRoutingModule { }
