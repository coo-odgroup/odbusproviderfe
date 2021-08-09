import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuswizardRoutingModule } from './buswizard-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BuswizardComponent } from './buswizard.component';
import {NotificationService} from '../../services/notification.service';
import {SelectModule} from 'ng-select';
import { ArchwizardModule } from 'angular-archwizard';
@NgModule({
  imports: [
    CommonModule,
    BuswizardRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    SelectModule,
    ReactiveFormsModule,
    ArchwizardModule
  ],
  declarations: [ BuswizardComponent],
  providers:[NotificationService]
})
export class BuswizardModule { }