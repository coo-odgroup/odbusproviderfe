import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgentCommissionSlabComponent } from './agentcommission-slab.component';

const routes: Routes = [
  {
    path: '',
    component: AgentCommissionSlabComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AgentCommissionSlabRoutingModule {}