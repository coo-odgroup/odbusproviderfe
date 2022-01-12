import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { CancelTicketRoutingModule } from './cancelticket-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { CancelticketComponent } from './cancelticket.component';
import {NotificationService} from '../../services/notification.service';
import {NgxPrintModule} from 'ngx-print';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    CancelTicketRoutingModule,
    SharedModule,
    FormsModule,NgbModule,
    NgxPrintModule,NgxSpinnerModule
    ],
  declarations: [ CancelticketComponent],
  providers:[NotificationService], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CancelTicketModule { }