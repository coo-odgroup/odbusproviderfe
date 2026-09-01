import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentsliderComponent } from './agentslider.component';

const routes: Routes = [
  {
    path: '',
    component: AgentsliderComponent
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
export class AgentSliderRoutingModule {}