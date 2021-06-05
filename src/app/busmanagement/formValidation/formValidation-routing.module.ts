import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FormValidationComponent} from './formValidation.component';

const routes: Routes = [
  {
    path: '',
    component: FormValidationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusTypeRoutingModule { }
