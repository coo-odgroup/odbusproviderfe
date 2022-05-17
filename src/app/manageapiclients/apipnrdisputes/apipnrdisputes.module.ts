import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ApipnrdisputesComponent} from './apipnrdisputes.component';
import {ApiPnrDisputesRoutingModule} from './apipnrdisputes-routing.module';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    ApiPnrDisputesRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule,
    NgxSpinnerModule,
    NgbModule
  ],
  declarations: [ ApipnrdisputesComponent],
  providers: [NotificationService], schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class   ApiPnrDisputesModule { }

