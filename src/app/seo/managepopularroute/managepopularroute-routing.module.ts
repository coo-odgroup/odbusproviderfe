import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagePopularRouteComponent } from './managepopularroute.component';

const routes: Routes = [
  {
    path: '',
    component: ManagePopularRouteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagePopularRouteRoutingModule { }
