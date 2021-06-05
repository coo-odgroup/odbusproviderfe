import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SeatingtypeComponent} from './seatingtype.component';

const routes: Routes = [
  {
    path: '',
    component: SeatingtypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatingTypeRoutingModule { }
