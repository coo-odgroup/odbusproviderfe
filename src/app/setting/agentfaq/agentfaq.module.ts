import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentfaqRoutingModule } from './agentfaq-routing.module';
import { AgentfaqComponent } from './agentfaq.component';

@NgModule({
  declarations: [
    AgentfaqComponent
  ],
  imports: [
    CommonModule,
    AgentfaqRoutingModule
  ]
})
export class AgentfaqModule {}