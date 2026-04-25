import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageDistanceComponent } from './managedistance.component';

const routes: Routes = [
  {
    path: '',
    component: ManageDistanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageDistanceRoutingModule { }
