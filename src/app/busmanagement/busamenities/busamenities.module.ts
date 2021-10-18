import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusAmenitiesRoutingModule } from './busamenities-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { BusamenitiesComponent } from './busamenities.component';
import {NotificationService} from '../../services/notification.service';



@NgModule({
  imports: [
    CommonModule,
    BusAmenitiesRoutingModule,
    SharedModule,
    FormsModule
  ],
  declarations: [ BusamenitiesComponent],
  providers:[NotificationService]
})
export class BusAmenitiesModule { }