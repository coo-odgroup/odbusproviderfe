import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AllapiclientComponent} from './allapiclient.component';

const routes: Routes = [
  {
    path: '',
    component: AllapiclientComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllApiClientRoutingModule { }
