import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { FestivalFareRoutingModule } from './festivalfare-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {FestivalfareComponent} from './festivalfare.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
  imports: [
    CommonModule,
    FestivalFareRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,NgxPrintModule,NgxSpinnerModule
  ],
  declarations: [ FestivalfareComponent],
  providers: [NotificationService], schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class FestivalFareModule { }