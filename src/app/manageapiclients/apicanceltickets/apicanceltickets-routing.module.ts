import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ApicancelticketsComponent} from './apicanceltickets.component';

const routes: Routes = [
  {
    path: '',
    component: ApicancelticketsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiCancelTicketsRoutingModule { }

