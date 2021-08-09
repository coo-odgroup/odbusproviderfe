import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerFareRoutingModule } from './ownerfare-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import {OwnerfareComponent} from './ownerfare.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    OwnerFareRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    DataTablesModule
  ],
  declarations: [ OwnerfareComponent],
  providers: [NotificationService]
})

export class OwnerFareModule { }