import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingComponent1 } from './landing1.component';
import { Landig1RoutingModule } from './landing1-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbCollapseModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import {ChartModule} from 'angular2-chartjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [LandingComponent1],
  imports: [
    HighchartsChartModule,
    CommonModule,
    Landig1RoutingModule,
    SharedModule,
    NgbNavModule,
    NgbCollapseModule,
    NgbDropdownModule,
    ChartModule,
    NgSelectModule,
    NgbModule,
    NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingModule1 { }
