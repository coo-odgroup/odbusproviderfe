import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import {ExtraseatopenreportComponent} from './extraseatopenreport.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { importType } from '@angular/compiler/src/output/output_ast';
import {ExtraSeatOpenReportRoutingModule} from './extraseatopenreport-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ExtraSeatOpenReportRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    DataTablesModule
  ],
  declarations: [ ExtraseatopenreportComponent],
  providers: [NotificationService]
})

export class ExtraSeatOpenReportModule { }