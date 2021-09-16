import { BookingManagementRoutingModule } from './bookingmanagement-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../theme/shared/shared.module';
import { BuscancellationComponent } from './buscancellation/buscancellation.component';
import { SeatblockComponent } from './seatblock/seatblock.component';
import { SeatopenComponent } from './seatopen/seatopen.component';
import { SpecialfareComponent } from './specialfare/specialfare.component';
import { OwnerfareComponent } from './ownerfare/ownerfare.component';
import { FestivalfareComponent } from './festivalfare/festivalfare.component';
import { OwnerpaymentComponent } from './ownerpayment/ownerpayment.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    BookingManagementRoutingModule
  ]
})
export class BookingmanagementModule { }
