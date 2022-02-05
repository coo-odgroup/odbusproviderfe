import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {AgentcancellationreportComponent} from './agentcancellationreport.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {AgentcancellationreportRoutingModule} from './agentcancellationreport-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
  imports: [
    CommonModule,NgxPrintModule,
    AgentcancellationreportRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,AngularEditorModule,NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ AgentcancellationreportComponent],
  providers: [NotificationService]
})

export class AgentcancellationreportModule { }