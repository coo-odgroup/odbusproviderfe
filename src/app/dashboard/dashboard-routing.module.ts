import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'landing',
        loadChildren: () => import('./landing/landing.module').then(module => module.LandingModule)
      },
      {
        path: 'landing1',
        loadChildren : ()=>import('./landing1/landing1.module').then(module => module.LandingModule1)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
