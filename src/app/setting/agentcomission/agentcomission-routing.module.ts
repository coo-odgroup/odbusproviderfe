import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgentcomissionComponent} from './agentcomission.component';

const routes: Routes = [
  {
    path: '',
    component: AgentcomissionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentComissionRoutingModule { }
