import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { SpecialFareRoutingModule } from './specialfare-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {SpecialfareComponent} from './specialfare.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    SpecialFareRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule,NgxSpinnerModule
  ],
  declarations: [ SpecialfareComponent],
  providers: [NotificationService] ,schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class SpecialFareModule { }