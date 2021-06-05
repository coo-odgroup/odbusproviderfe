import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusAmenitiesRoutingModule } from './busamenities-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import { BusamenitiesComponent } from './busamenities.component';
import {NotificationService} from '../../services/notification.service';
import {ToastyModule} from 'ng2-toasty';



@NgModule({
  imports: [
    CommonModule,
    BusAmenitiesRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    ToastyModule.forRoot()
  ],
  declarations: [ BusamenitiesComponent],
  providers:[NotificationService]
})
export class BusAmenitiesModule { }