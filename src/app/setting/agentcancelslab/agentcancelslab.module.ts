import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSpinnerModule } from 'ngx-spinner';

import { SharedModule } from '../../theme/shared/shared.module';

import { AgentCancelSlabRoutingModule } from './agentcancelslab-routing.module';

import { AgentCancelSlabComponent } from './agentcancelslab.component';

@NgModule({
  declarations: [
    AgentCancelSlabComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SharedModule,
    AgentCancelSlabRoutingModule
  ]
})
export class AgentCancelSlabModule {}