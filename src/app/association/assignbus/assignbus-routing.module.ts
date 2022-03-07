import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssignbusComponent} from './assignbus.component';

const routes: Routes = [
  {
    path: '',
    component: AssignbusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignbusRoutingModule { }
