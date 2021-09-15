import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferRoutingModule } from './offers-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { OffersComponent } from './offers.component';
import { NotificationService } from '../../services/notification.service';

@NgModule({
  imports: [
    CommonModule,
    OfferRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule
  ],
  declarations: [ OffersComponent],
  providers: [NotificationService]
})
export class OfferModule { }