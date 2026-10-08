import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { VendorSeatBlockRoutingModule } from './vendor-seatblock-routing.module';
import { VendorSeatblockComponent } from './vendor-seatblock.component';

@NgModule({
  imports: [
    CommonModule,
    VendorSeatBlockRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule,NgxSpinnerModule,NgbModule
  ],
  declarations: [ VendorSeatblockComponent],
  providers: [NotificationService],schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class VendorSeatBlockModule { }