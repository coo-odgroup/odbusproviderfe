import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BusoperatorComponent} from './busoperator.component';

const routes: Routes = [
  {
    path: '',
    component: BusoperatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusOperaorRoutingModule { }
