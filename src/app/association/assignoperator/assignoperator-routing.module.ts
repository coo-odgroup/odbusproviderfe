import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssignoperatorComponent} from './assignoperator.component';

const routes: Routes = [
  {
    path: '',
    component: AssignoperatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignoperatorRoutingModule { }
