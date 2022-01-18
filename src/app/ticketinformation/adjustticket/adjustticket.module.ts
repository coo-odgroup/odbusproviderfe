import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { AdjusttickettRoutingModule } from './adjustticket-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { AdjustticketComponent } from './adjustticket.component';
import {NotificationService} from '../../services/notification.service';
import {NgxPrintModule} from 'ngx-print';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    AdjusttickettRoutingModule,
    SharedModule,
    FormsModule,NgbModule,
    NgxPrintModule,NgxSpinnerModule,NgSelectModule
    ],
  declarations: [ AdjustticketComponent],
  providers:[NotificationService,DatePipe], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdjustticketModule { }