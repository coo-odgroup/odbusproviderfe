import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssignagentComponent} from './assignagent.component';

const routes: Routes = [
  {
    path: '',
    component: AssignagentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignagentRoutingModule { }


