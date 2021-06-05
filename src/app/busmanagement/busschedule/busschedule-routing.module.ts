import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BusscheduleComponent} from './busschedule.component';

const routes: Routes = [
  {
    path: '',
    component: BusscheduleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusScheuleRoutingModule { }
