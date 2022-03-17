import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssignbusreportComponent} from './assignbusreport.component';

const routes: Routes = [
  {
    path: '',
    component: AssignbusreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignbusreportRoutingModule { }
