import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {AgentwalletbalanceComponent} from './agentwalletbalance.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {AgentwalletbalancekRoutingModule} from './agentwalletbalance-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  imports: [
    CommonModule,
    AgentwalletbalancekRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,AngularEditorModule,NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ AgentwalletbalanceComponent],
  providers: [NotificationService]
})

export class AgentwalletbalanceModule { }