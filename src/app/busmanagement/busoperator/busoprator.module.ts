import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { BusOperaorRoutingModule } from './busoperator-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BusoperatorComponent } from './busoperator.component';
import {NotificationService} from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';



@NgModule({
  imports: [
    CommonModule,
    BusOperaorRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgxPrintModule,NgxSpinnerModule
  ],
  declarations: [ BusoperatorComponent],
  providers:[NotificationService], schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BusOperatorModule { }