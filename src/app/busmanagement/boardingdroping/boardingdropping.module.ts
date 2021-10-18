import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardingDroppingRoutingModule } from './boardingdroping-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BoardingdropingComponent } from './boardingdroping.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    BoardingDroppingRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgxPrintModule
  ],
  declarations: [ BoardingdropingComponent],
  providers: [NotificationService]
})
export class BoardingDroppingModule { }