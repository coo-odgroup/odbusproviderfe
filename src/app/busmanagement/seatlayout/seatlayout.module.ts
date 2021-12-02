import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { SeatLayoutRoutingModule } from './seatlayout-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { SeatlayoutComponent } from './seatlayout.component';
import { NotificationService } from '../../services/notification.service';
import { DragulaModule } from 'ng2-dragula';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    SeatLayoutRoutingModule,
    SharedModule,
    FormsModule,
    NgxPrintModule,
    NgSelectModule,NgxSpinnerModule,
    DragulaModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ SeatlayoutComponent],
  providers:[NotificationService]
})
export class SeatLayoutdModule { }