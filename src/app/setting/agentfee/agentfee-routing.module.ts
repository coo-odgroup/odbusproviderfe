import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgentfeeComponent} from './agentfee.component';

const routes: Routes = [
  {
    path: '',
    component: AgentfeeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentFeeRoutingModule { }
