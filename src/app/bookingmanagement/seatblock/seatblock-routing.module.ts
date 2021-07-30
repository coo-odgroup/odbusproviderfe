import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SeatblockComponent} from './seatblock.component';

const routes: Routes = [
  {
    path: '',
    component: SeatblockComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatBlockRoutingModule { }
