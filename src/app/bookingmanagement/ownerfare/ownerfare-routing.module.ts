import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OwnerfareComponent} from './ownerfare.component';

const routes: Routes = [
  {
    path: '',
    component: OwnerfareComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerFareRoutingModule { }
