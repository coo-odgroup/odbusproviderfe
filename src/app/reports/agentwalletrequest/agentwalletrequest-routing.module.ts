import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgentwalletrequestComponent} from './agentwalletrequest.component';

const routes: Routes = [
  {
    path: '',
    component: AgentwalletrequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentWalletRequestRoutingModule { }
