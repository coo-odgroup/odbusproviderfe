import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { EmployeeRoutingModule } from './employee-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { EmployeeComponent } from './employee.component';
import { NotificationService } from '../../services/notification.service';
import {NgxPrintModule} from 'ngx-print';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule,NgxSpinnerModule
    ],
  declarations: [ EmployeeComponent],
  providers: [NotificationService],schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class EmployeeModule { }