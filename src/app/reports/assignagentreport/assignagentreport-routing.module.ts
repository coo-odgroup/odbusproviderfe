import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssignagentreportComponent} from './assignagentreport.component';

const routes: Routes = [
  {
    path: '',
    component: AssignagentreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignagentreportRoutingModule { }
