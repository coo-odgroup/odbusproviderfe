import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgentbookingreportComponent} from './agentbookingreport.component';

const routes: Routes = [
  {
    path: '',
    component: AgentbookingreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentbookingreportRoutingModule { }
