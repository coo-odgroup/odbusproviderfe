import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusSequenceRoutingModule } from './bussequence-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { BussequenceComponent } from './bussequence.component';
import {NotificationService} from '../../services/notification.service';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    BusSequenceRoutingModule,
    SharedModule,
    FormsModule,
    NgxPrintModule
  ],
  declarations: [ BussequenceComponent],
  providers:[NotificationService]
})
export class BusSequenceModule { }