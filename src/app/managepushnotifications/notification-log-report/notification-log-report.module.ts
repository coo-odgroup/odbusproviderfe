import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../theme/shared/shared.module';

import { NotificationLogReportRoutingModule } from './notification-log-report-routing.module';
import { NotificationLogReportComponent } from './notification-log-report.component';

@NgModule({
  declarations: [
    NotificationLogReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NotificationLogReportRoutingModule
  ]
})
export class NotificationLogReportModule {}