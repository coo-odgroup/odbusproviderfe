import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignoperatorbusComponent } from './assignoperatorbus.component';

const routes: Routes = [
  {
    path: '',
    component: AssignoperatorbusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignOperatorBusRoutingModule { }