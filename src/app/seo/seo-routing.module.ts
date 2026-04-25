import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'manageSeo',
        loadChildren: () => import('./manageseo/manageseo.module').then(module => module.ManageSeoModule)
      },
      {
        path: 'manage-distance',
        loadChildren: () => import('./managedistance/managedistance.module').then(module => module.ManageDistanceModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeoRoutingModule { }
