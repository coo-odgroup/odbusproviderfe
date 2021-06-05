import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SeatfareComponent} from './seatfare.component';

const routes: Routes = [
  {
    path: '',
    component: SeatfareComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatFareRoutingModule { }
