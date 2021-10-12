import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusOperaorRoutingModule } from './busoperator-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BusoperatorComponent } from './busoperator.component';
import {NotificationService} from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';



@NgModule({
  imports: [
    CommonModule,
    BusOperaorRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgxPrintModule
  ],
  declarations: [ BusoperatorComponent],
  providers:[NotificationService]
})
export class BusOperatorModule { }