import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FestivalfareComponent} from './festivalfare.component';

const routes: Routes = [
  {
    path: '',
    component: FestivalfareComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FestivalFareRoutingModule { }
