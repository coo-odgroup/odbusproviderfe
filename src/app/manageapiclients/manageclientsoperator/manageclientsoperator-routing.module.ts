import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ManageclientsoperatorComponent} from './manageclientsoperator.component';

const routes: Routes = [
  {
    path: '',
    component: ManageclientsoperatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageClientsOperatorRoutingModule { }
