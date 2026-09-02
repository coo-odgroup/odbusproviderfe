import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgentfaqComponent } from './agentfaq.component';

const routes: Routes = [
  {
    path: '',
    component: AgentfaqComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentfaqRoutingModule {}