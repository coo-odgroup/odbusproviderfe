import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdjustticketComponent} from './adjustticket.component';

const routes: Routes = [
  {
    path: '',
    component: AdjustticketComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdjusttickettRoutingModule { }
