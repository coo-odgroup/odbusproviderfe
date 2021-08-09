import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatLayoutRoutingModule } from './seatlayout-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import { SeatlayoutComponent } from './seatlayout.component';
import { NotificationService } from '../../services/notification.service';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
  imports: [
    CommonModule,
    SeatLayoutRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    DragulaModule.forRoot()
  ],
  declarations: [ SeatlayoutComponent],
  providers:[NotificationService]
})
export class SeatLayoutdModule { }