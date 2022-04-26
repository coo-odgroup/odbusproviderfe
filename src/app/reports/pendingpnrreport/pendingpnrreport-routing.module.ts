import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PendingpnrreportComponent } from './pendingpnrreport.component';

const routes: Routes = [
  {
    path: '',
    component: PendingpnrreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingPNRReportRoutingModule { }
