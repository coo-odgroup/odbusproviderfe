import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SeatopenreportComponent} from './seatopenreport.component';

const routes: Routes = [
  {
    path: '',
    component: SeatopenreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatOpenReportRoutingModule { }
