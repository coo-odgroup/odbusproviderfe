import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ManageroleComponent} from './managerole.component';

const routes: Routes = [
  {
    path: '',
    component: ManageroleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageroleRoutingModule { }
