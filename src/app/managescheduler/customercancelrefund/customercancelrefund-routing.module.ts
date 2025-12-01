import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomercancelrefundComponent } from './customercancelrefund.component';
const routes: Routes = [
  {
    path: '',
    component: CustomercancelrefundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomercancelrefundRoutingModule { }
