import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SeatlayoutComponent} from './seatlayout.component';

const routes: Routes = [
  {
    path: '',
    component: SeatlayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatLayoutRoutingModule { }
