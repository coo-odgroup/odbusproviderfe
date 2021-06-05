import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BusamenitiesComponent} from './busamenities.component';

const routes: Routes = [
  {
    path: '',
    component: BusamenitiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusAmenitiesRoutingModule { }
