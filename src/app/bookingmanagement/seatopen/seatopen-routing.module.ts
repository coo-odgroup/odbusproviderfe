import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SeatopenComponent} from './seatopen.component';

const routes: Routes = [
  {
    path: '',
    component: SeatopenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatOpenRoutingModule { }
