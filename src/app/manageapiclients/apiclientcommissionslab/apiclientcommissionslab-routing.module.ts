import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ApiclientcommissionslabComponent} from './apiclientcommissionslab.component';

const routes: Routes = [
  {
    path: '',
    component: ApiclientcommissionslabComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiClientCommissionSlabRoutingModule { }
