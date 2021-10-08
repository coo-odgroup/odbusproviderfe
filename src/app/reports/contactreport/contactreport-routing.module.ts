import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContactreportComponent} from './contactreport.component';

const routes: Routes = [
  {
    path: '',
    component: ContactreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactReportRoutingModule { }
