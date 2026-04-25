import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageseoComponent } from './manageseo.component';

const routes: Routes = [
  {
    path: '',
    component: ManageseoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageSeoRoutingModule { }
