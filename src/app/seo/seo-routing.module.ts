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
      },
      {
        path: 'manage-brd-drp',
        loadChildren: () => import('./boarding_dropping/boarding_dropping.module').then(module => module.BoardingDroppingModule)
      },
      {
        path: 'manage-template',
        loadChildren: () => import('./managetemplate/managetemplate.module').then(module => module.ManageTemplateModule)
      },
      {
        path: 'template-list',
        loadChildren: () => import('./templatelist/templatelist.module').then(module => module.TemplateListModule)
      },
      {
        path: 'manage-routes',
        loadChildren: () => import('./manageroute/manageroute.module').then(module => module.ManageRouteListModule)
      },
      {
        path: 'manage-popular-routes',
        loadChildren: () => import('./managepopularroute/managepopularroute.module').then(module => module.ManagePopularRouteModule)
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeoRoutingModule { }
