import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SpecialsliderComponent} from './specialslider.component';

const routes: Routes = [
  {
    path: '',
    component: SpecialsliderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialSliderRoutingModule { }
