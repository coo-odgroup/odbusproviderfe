import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BussequenceComponent} from './bussequence.component';

const routes: Routes = [
  {
    path: '',
    component: BussequenceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusSequenceRoutingModule { }
