import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {SeatopenComponent} from './seatopen.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { importType } from '@angular/compiler/src/output/output_ast';
import {SeatOpenRoutingModule} from './seatopen-routing.module';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    SeatOpenRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule
  ],
  declarations: [ SeatopenComponent],
  providers: [NotificationService]
})

export class SeatOpenModule { }