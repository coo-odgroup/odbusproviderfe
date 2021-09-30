import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BannermanagementComponent} from './bannermanagement.component';

const routes: Routes = [
  {
    path: '',
    component: BannermanagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerManagementRoutingModule { }
