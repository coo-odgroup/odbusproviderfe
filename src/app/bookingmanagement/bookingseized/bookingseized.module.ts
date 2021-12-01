import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { BookingseizedComponent } from './bookingseized.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { importType } from '@angular/compiler/src/output/output_ast';
import { BookingSeizedRoutingModule } from './bookingseized-routing.module';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  imports: [
    CommonModule,
    // CityClosingRoutingModule,
    BookingSeizedRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule,NgxSpinnerModule
  ],
  declarations: [BookingseizedComponent],
  providers: [NotificationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class BookingseizedModule { }