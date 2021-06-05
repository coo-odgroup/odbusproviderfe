import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SpecialfareComponent} from './specialfare.component';

const routes: Routes = [
  {
    path: '',
    component: SpecialfareComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialFareRoutingModule { }
