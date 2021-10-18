import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {SeatblockComponent} from './seatblock.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {SeatBlockRoutingModule} from './seatblock-routing.module';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    SeatBlockRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule
  ],
  declarations: [ SeatblockComponent],
  providers: [NotificationService]
})

export class SeatBlockModule { }