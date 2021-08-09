import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusScheuleRoutingModule } from './busschedule-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BusscheduleComponent } from './busschedule.component';
import {NotificationService} from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  imports: [
    CommonModule,
    BusScheuleRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgSelectModule  ],
  declarations: [ BusscheduleComponent],
  providers:[NotificationService]
})
export class BusScheduleModule { }