import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../theme/shared/shared.module';
import { BusComponent } from './bus/bus.component';
import { LocationComponent } from './location/location.component';
import { BustypeComponent } from './bustype/bustype.component';
import { SeatingtypeComponent } from './seatingtype/seatingtype.component';
import { BusamenitiesComponent } from './busamenities/busamenities.component';
import { BoardingdropingComponent } from './boardingdroping/boardingdroping.component';
import { SeatlayoutComponent } from './seatlayout/seatlayout.component';
import { BussequenceComponent } from './bussequence/bussequence.component';
import { CancellationslabComponent } from './cancellationslab/cancellationslab.component';
import { BusManagementRoutingModule } from './busmanagement-routing.module';
import { AmenitiesComponent } from './amenities/amenities.component';
import { BusoperatorComponent } from './busoperator/busoperator.component';
import { TestComponent } from './test/test.component';
import { BusscheduleComponent } from './busschedule/busschedule.component';
import { SeatfareComponent } from './seatfare/seatfare.component';
import { SafetyComponent } from './safety/safety.component';
import { BusgalleryComponent } from './busgallery/busgallery.component';
import { SettingsComponent } from './settings/settings.component';
import { OffersComponent } from './offers/offers.component';
import { CouponComponent } from './coupon/coupon.component';
import { CoupontypeComponent } from './coupontype/coupontype.component';
import { ManagestateComponent } from './managestate/managestate.component';




@NgModule({
  declarations: [  
  ],
  imports: [
    CommonModule,
    SharedModule,
    BusManagementRoutingModule
  ]
})
export class BusmanagementModule { }
