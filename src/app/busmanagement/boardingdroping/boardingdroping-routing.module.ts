import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BoardingdropingComponent} from './boardingdroping.component';

const routes: Routes = [
  {
    path: '',
    component: BoardingdropingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardingDroppingRoutingModule { }
