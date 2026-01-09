import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent1 } from './landing1.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent1
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Landig1RoutingModule { }
