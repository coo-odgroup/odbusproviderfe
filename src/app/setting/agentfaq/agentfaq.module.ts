import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentfaqRoutingModule } from './agentfaq-routing.module';
import { AgentfaqComponent } from './agentfaq.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AgentfaqComponent
  ],
  imports: [
    CommonModule,
    AgentfaqRoutingModule,
    ReactiveFormsModule
  ]
})
export class AgentfaqModule {}