import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import {SeatblockreportComponent} from './seatblockreport.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { importType } from '@angular/compiler/src/output/output_ast';
import {SeatBlockReportRoutingModule} from './seatblockreport-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SeatBlockReportRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    DataTablesModule
  ],
  declarations: [ SeatblockreportComponent],
  providers: [NotificationService]
})

export class SeatBlockReportModule { }