import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ApitransactionreportComponent} from './apitransactionreport.component';

const routes: Routes = [
  {
    path: '',
    component: ApitransactionreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApitransactionreportRoutingModule { }
