import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";

import { CommonModule } from '@angular/common';
import { SafetyRoutingModule } from './safety-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
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
    ReactiveFormsModule,
    NgxPrintModule,NgxSpinnerModule
  ], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ SafetyComponent],
  providers:[NotificationService]
})
export class SafetyModule { }