import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BusseatfarereportComponent} from './busseatfarereport.component';

const routes: Routes = [
  {
    path: '',
    component: BusseatfarereportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusSeatFareReportRoutingModule { }
