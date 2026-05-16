import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardingDroppingComponent } from './boarding_dropping.component';

const routes: Routes = [
  {
    path: '',
    component: BoardingDroppingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardingDroppingRoutingModule { }
