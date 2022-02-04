import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgentfeedbackComponent} from './agentfeedback.component';

const routes: Routes = [
  {
    path: '',
    component: AgentfeedbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentfeedbackRoutingModule { }
