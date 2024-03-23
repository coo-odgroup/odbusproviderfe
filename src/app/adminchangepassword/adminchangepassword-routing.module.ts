import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminchangepasswordComponent} from './adminchangepassword.component';

const routes: Routes = [
  {
    path: '',
    component: AdminchangepasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  AdminchangepasswordRoutingModule { }
