import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentdashboardComponent } from './agentdashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AgentdashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentdashboardRoutingModule {}
