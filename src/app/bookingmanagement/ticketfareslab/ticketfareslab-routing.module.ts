import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TicketfareslabComponent} from './ticketfareslab.component';

const routes: Routes = [
  {
    path: '',
    component: TicketfareslabComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketFareSlabRoutingModule { }
