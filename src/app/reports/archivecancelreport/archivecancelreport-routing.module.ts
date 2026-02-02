import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ArchiveCancelReportComponent} from './archivecancelreport.component';

const routes: Routes = [
  {
    path: '',
    component: ArchiveCancelReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchiveCancelReportRoutingModule { }
