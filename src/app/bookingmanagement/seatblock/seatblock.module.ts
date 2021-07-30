import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import {SeatblockComponent} from './seatblock.component';
import { NotificationService } from '../../services/notification.service';
import {ToastyModule} from 'ng2-toasty';
import { NgSelectModule } from '@ng-select/ng-select';
import {SeatBlockRoutingModule} from './seatblock-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SeatBlockRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    DataTablesModule,
    ToastyModule.forRoot()
  ],
  declarations: [ SeatblockComponent],
  providers: [NotificationService]
})

export class SeatBlockModule { }