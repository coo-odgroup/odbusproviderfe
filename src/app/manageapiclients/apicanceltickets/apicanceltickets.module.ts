import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { ApiCancelTicketsRoutingModule} from './apicanceltickets-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ApicancelticketsComponent} from './apicanceltickets.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    ApiCancelTicketsRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule,
    NgxSpinnerModule,
    NgbModule
  ],
  declarations: [ ApicancelticketsComponent],
  providers: [NotificationService], schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class   ApiCancelTicketsModule { }

