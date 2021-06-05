import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BustypeComponent} from './bustype.component';

const routes: Routes = [
  {
    path: '',
    component: BustypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusTypeRoutingModule { }
