import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafetyRoutingModule } from './safety-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SafetyComponent } from './safety.component';
import {NotificationService} from '../../services/notification.service';
import {ToastyModule} from 'ng2-toasty';
import {SelectModule} from 'ng-select';
@NgModule({
  imports: [
    CommonModule,
    SafetyRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    SelectModule,
    ReactiveFormsModule,
    ToastyModule.forRoot()
  ],
  declarations: [ SafetyComponent],
  providers:[NotificationService]
})
export class SafetyModule { }