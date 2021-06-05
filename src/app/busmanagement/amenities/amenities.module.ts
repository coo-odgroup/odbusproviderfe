import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmenitiesRoutingModule } from './amenities-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import { AmenitiesComponent } from './amenities.component';
import {NotificationService} from '../../services/notification.service';
import {ToastyModule} from 'ng2-toasty';

@NgModule({
  imports: [
    CommonModule,
    AmenitiesRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    ToastyModule.forRoot()
  ],
  declarations: [ AmenitiesComponent],
  providers:[NotificationService]
})
export class AmenitiesModule { }