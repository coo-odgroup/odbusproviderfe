import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {AgentbookingreportComponent} from './agentbookingreport.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {AgentbookingreportRoutingModule} from './agentbookingreport-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';

import {NgxPrintModule} from 'ngx-print';



@NgModule({
  imports: [
    NgxPrintModule,
    CommonModule,
    AgentbookingreportRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,AngularEditorModule,NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ AgentbookingreportComponent],
  providers: [NotificationService]
})

export class AgentbookingreportModule { }