import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ExtraseatopenreportComponent} from './extraseatopenreport.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {ExtraSeatOpenReportRoutingModule} from './extraseatopenreport-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ExtraSeatOpenReportRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
  ],
  declarations: [ ExtraseatopenreportComponent],
  providers: [NotificationService]
})

export class ExtraSeatOpenReportModule { }