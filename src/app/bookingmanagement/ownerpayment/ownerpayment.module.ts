import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerPaymentRoutingModule } from './ownerpayment-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {OwnerpaymentComponent} from './ownerpayment.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
  imports: [
    CommonModule,
    OwnerPaymentRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule
  ],
  declarations: [ OwnerpaymentComponent],
  providers: [NotificationService]
})

export class OwnerPaymentModule { }