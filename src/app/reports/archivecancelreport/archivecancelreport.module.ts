import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ArchiveCancelReportComponent} from './archivecancelreport.component';
import {ArchiveCancelReportRoutingModule} from './archivecancelreport-routing.module';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    ArchiveCancelReportRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgxPrintModule,NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ ArchiveCancelReportComponent],
  providers: [NotificationService]
})

export class ArchiveCancelReportModule { }