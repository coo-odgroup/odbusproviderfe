import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssignoperatorreportComponent} from './assignoperatorreport.component';

const routes: Routes = [
  {
    path: '',
    component: AssignoperatorreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignoperatorreportRoutingModule { }
