import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssignagentsComponent} from './assignagents.component';

const routes: Routes = [
  {
    path: '',
    component: AssignagentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignagentsRoutingModule { }


