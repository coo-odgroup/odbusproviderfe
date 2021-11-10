import { AgentRoutingModule } from './agent-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../theme/shared/shared.module';
import { AgentcompletereportComponent } from './agentcompletereport/agentcompletereport.component';
import { AgentcomissionreportComponent } from './agentcomissionreport/agentcomissionreport.component';
import { AgentticketcancellationreportComponent } from './agentticketcancellationreport/agentticketcancellationreport.component';
import { AgentwalletreportComponent } from './agentwalletreport/agentwalletreport.component';
import { CommissionslabComponent } from './commissionslab/commissionslab.component';
import { CustomercommissionslabComponent } from './customercommissionslab/customercommissionslab.component';


@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule,
    SharedModule,
    AgentRoutingModule
  ]
})
export class AgentModule { }
