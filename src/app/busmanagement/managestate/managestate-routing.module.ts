import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ManagestateComponent} from './managestate.component';

const routes: Routes = [
  {
    path: '',
    component: ManagestateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageStateRoutingModule { }
