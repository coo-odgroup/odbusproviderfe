import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";

import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ExtraseatopenreportComponent} from './extraseatopenreport.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {ExtraSeatOpenReportRoutingModule} from './extraseatopenreport-routing.module';
import {NgxPrintModule} from 'ngx-print';
@NgModule({
  imports: [
    CommonModule,
    ExtraSeatOpenReportRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule,NgxSpinnerModule
  ],schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ ExtraseatopenreportComponent],
  providers: [NotificationService]
})

export class ExtraSeatOpenReportModule { }