import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ApibookingsticketsComponent} from './apibookingstickets.component';

const routes: Routes = [
  {
    path: '',
    component: ApibookingsticketsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiBookingsTicketsRoutingModule { }

