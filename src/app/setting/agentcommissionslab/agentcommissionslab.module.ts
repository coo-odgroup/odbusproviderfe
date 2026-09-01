import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSpinnerModule } from 'ngx-spinner';

import { SharedModule } from '../../theme/shared/shared.module';

import { AgentCommissionSlabRoutingModule } from './agentcommission-slab-routing.module';
import { AgentCommissionSlabComponent } from './agentcommission-slab.component';

@NgModule({
  declarations: [
    AgentCommissionSlabComponent
  ],

  
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SharedModule,
    AgentCommissionSlabRoutingModule
  ]
})
export class AgentCommissionSlabModule {}