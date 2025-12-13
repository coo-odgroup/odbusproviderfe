import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ApilogreportComponent} from './apilogreport.component';

const routes: Routes = [
  {
    path: '',
    component: ApilogreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApilogReportRoutingModule { }
