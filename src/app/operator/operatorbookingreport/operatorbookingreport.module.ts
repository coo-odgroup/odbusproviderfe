import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { OperatorbookingreportComponent } from './operatorbookingreport.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { OperatorBookingReportRoutingModule } from './operatorbookingreport-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    OperatorBookingReportRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgxPrintModule
  ],
  declarations: [ OperatorbookingreportComponent ],
  providers: [NotificationService]
})

export class OperatorBookingReportModule { }