import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CancelticketComponent} from './cancelticket.component';

const routes: Routes = [
  {
    path: '',
    component: CancelticketComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancelTicketRoutingModule { }
