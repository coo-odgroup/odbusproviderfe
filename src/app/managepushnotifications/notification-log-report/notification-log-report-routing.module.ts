import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationLogReportComponent } from './notification-log-report.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationLogReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationLogReportRoutingModule {}