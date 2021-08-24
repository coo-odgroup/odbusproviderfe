import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExtraseatopenreportComponent} from './extraseatopenreport.component';

const routes: Routes = [
  {
    path: '',
    component: ExtraseatopenreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraSeatOpenReportRoutingModule { }
