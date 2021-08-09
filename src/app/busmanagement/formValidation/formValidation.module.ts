import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusTypeRoutingModule } from './formValidation-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import { FormValidationComponent } from './formValidation.component';
import { NotificationService } from '../../services/notification.service';
import {SelectModule} from 'ng-select';


@NgModule({
  imports: [
    CommonModule,
    BusTypeRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    SelectModule,
  ],
  declarations: [ FormValidationComponent],
  providers: [NotificationService]
})

export class FormValidatioModule { }