import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationRoutingModule } from './location-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LocationComponent } from './location.component';
import { NotificationService } from '../../services/notification.service';

@NgModule({
  imports: [
    CommonModule,
    LocationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule
  ],
  declarations: [ LocationComponent],
  providers: [NotificationService]
})
export class LocationModule { }