import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SeatblockreportComponent} from './seatblockreport.component';

const routes: Routes = [
  {
    path: '',
    component: SeatblockreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatBlockReportRoutingModule { }
