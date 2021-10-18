import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerFareRoutingModule } from './ownerfare-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {OwnerfareComponent} from './ownerfare.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
  imports: [
    CommonModule,
    OwnerFareRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule
  ],
  declarations: [ OwnerfareComponent],
  providers: [NotificationService]
})

export class OwnerFareModule { }