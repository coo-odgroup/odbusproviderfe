import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerPaymentRoutingModule } from './ownerpayment-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import {OwnerpaymentComponent} from './ownerpayment.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    OwnerPaymentRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    DataTablesModule
  ],
  declarations: [ OwnerpaymentComponent],
  providers: [NotificationService]
})

export class OwnerPaymentModule { }