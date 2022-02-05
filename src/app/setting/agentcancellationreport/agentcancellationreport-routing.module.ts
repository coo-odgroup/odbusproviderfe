import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgentcancellationreportComponent} from './agentcancellationreport.component';

const routes: Routes = [
  {
    path: '',
    component: AgentcancellationreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentcancellationreportRoutingModule { }
