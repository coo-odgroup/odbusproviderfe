import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../theme/shared/shared.module';
import { ManageSchedulerRoutingModule } from './managescheduler-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, ManageSchedulerRoutingModule],
})
export class ManageSchedulerModule {}
