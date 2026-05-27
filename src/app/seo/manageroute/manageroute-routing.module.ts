import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MangeRouteComponent } from './manageroute.component';

const routes: Routes = [
  {
    path: '',
    component: MangeRouteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MangeRouteRoutingModule { }
