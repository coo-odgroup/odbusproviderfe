import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule} from '../../theme/shared/shared.module';
import { DataTablesModule} from 'angular-datatables';
import { FormsModule} from '@angular/forms';
import { BookingseizedComponent } from './bookingseized.component';
import { NotificationService } from '../../services/notification.service';

import { NgSelectModule } from '@ng-select/ng-select';
import { importType } from '@angular/compiler/src/output/output_ast';
import {BookingSeizedRoutingModule} from './bookingseized-routing.module';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    // CityClosingRoutingModule,
    BookingSeizedRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    DataTablesModule,
    NgxPrintModule
  ],
  declarations: [BookingseizedComponent],
  providers: [NotificationService]
})

export class BookingseizedModule { }