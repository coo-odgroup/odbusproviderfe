import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { AmenitiesRoutingModule } from './amenities-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { AmenitiesComponent } from './amenities.component';
import {NotificationService} from '../../services/notification.service';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    AmenitiesRoutingModule,
    SharedModule,
    FormsModule,
    NgxPrintModule,NgxSpinnerModule
    ],
  declarations: [ AmenitiesComponent],
  providers:[NotificationService], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AmenitiesModule { }