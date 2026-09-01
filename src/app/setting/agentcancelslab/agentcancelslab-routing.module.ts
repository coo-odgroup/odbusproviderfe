import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgentCancelSlabComponent } from './agentcancelslab.component';

const routes: Routes = [
  {
    path: '',
    component: AgentCancelSlabComponent
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
export class AgentCancelSlabRoutingModule {}