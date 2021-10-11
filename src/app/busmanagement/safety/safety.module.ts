import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafetyRoutingModule } from './safety-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SafetyComponent } from './safety.component';
import {NotificationService} from '../../services/notification.service';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    SafetyRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxPrintModule
  ],
  declarations: [ SafetyComponent],
  providers:[NotificationService]
})
export class SafetyModule { }