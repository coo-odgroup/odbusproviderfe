import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {AgentwalletrequestComponent} from './agentwalletrequest.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {AgentWalletRequestRoutingModule} from './agentwalletrequest-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    AgentWalletRequestRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgxPrintModule
  ],
  declarations: [ AgentwalletrequestComponent],
  providers: [NotificationService]
})

export class AgentWalletRequestReportModule { }