import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {FailedtransactionreportComponent} from './failedtransactionreport.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { importType } from '@angular/compiler/src/output/output_ast';
import {FailedTransactionReportRoutingModule} from './failedtransactionreport-route.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';



@NgModule({
  imports: [
    CommonModule,
    FailedTransactionReportRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgxPrintModule
  ],
  declarations: [ FailedtransactionreportComponent],
  providers: [NotificationService]
})

export class FailedTransactionReportModule { }