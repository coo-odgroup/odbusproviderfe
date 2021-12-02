import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";

import { CommonModule } from '@angular/common';
import { BusRoutingModule } from './bus-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BusComponent } from './bus.component';
import {NotificationService} from '../../services/notification.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArchwizardModule } from 'angular-archwizard';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    BusRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    ArchwizardModule,
    NgxPrintModule,NgxSpinnerModule
    ],
  declarations: [ BusComponent],
  providers:[NotificationService],schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BusModule { }