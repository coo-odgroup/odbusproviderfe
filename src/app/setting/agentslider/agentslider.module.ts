import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AgentsliderComponent } from './agentslider.component';
import { AgentSliderRoutingModule } from './agentslider-routing.module';

@NgModule({
  declarations: [
    AgentsliderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxSpinnerModule,
    AgentSliderRoutingModule
  ]
})
export class AgentSliderModule {}