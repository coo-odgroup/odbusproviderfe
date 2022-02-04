import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OuragentComponent} from './ouragent.component';

const routes: Routes = [
  {
    path: '',
    component: OuragentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OuragenttRoutingModule { }
