import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {CleartransactionreportComponent} from './cleartransactionreport.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {ClearTransactionReportRoutingModule} from './cleartransactionreport-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    ClearTransactionReportRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule
  ],
  declarations: [ CleartransactionreportComponent],
  providers: [NotificationService]
})

export class ClearTransactionReportModule { }