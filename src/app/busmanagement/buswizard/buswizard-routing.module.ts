import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BuswizardComponent} from './buswizard.component';

const routes: Routes = [
  {
    path: '',
    component: BuswizardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuswizardRoutingModule { }
