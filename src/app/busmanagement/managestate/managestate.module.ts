import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { ManageStateRoutingModule } from './managestate-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ManagestateComponent } from './managestate.component';
import { NotificationService } from '../../services/notification.service';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
  imports: [
    CommonModule,
    ManageStateRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPrintModule,
    NgxSpinnerModule
  ],
  declarations: [ ManagestateComponent],
  providers: [NotificationService],schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ManageStateModule { }