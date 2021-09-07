import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { SettingsComponent } from './settings.component';
import { NotificationService } from '../../services/notification.service';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    FormsModule
  ],
  declarations: [ SettingsComponent],
  providers:[NotificationService]
})
export class SettingsModule { }