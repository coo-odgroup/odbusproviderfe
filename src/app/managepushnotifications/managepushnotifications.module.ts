import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../theme/shared/shared.module';
import { ManagePushnotificationsRoutingModule } from './managepushnotifications-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, ManagePushnotificationsRoutingModule],
})
export class ManagePushnotificationsModule {}
