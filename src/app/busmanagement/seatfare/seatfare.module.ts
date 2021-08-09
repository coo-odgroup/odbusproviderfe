import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatFareRoutingModule } from './seatfare-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SeatfareComponent } from './seatfare.component';
import {NotificationService} from '../../services/notification.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArchwizardModule } from 'angular-archwizard';
@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    SeatFareRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgSelectModule,
    ReactiveFormsModule,
    ArchwizardModule  ],
  declarations: [ SeatfareComponent],
  providers:[NotificationService]
})
export class SeatFareModule { }