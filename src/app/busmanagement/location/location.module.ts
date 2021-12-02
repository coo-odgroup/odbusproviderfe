import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { LocationRoutingModule } from './location-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LocationComponent } from './location.component';
import { NotificationService } from '../../services/notification.service';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
  imports: [
    CommonModule,
    LocationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPrintModule,NgxSpinnerModule
  ],
  declarations: [ LocationComponent],
  providers: [NotificationService],schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LocationModule { }