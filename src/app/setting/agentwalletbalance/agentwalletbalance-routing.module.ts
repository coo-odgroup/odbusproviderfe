import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgentwalletbalanceComponent} from './agentwalletbalance.component';

const routes: Routes = [
  {
    path: '',
    component: AgentwalletbalanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentwalletbalancekRoutingModule { }
