import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgentcommissionreportComponent} from './agentcommissionreport.component';

const routes: Routes = [
  {
    path: '',
    component: AgentcommissionreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentcommissionreportRoutingModule { }
