import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import {AuthComponent} from './theme/layout/auth/auth.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard/landing',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule)
      },
      {
        path: 'busmanagement',
        loadChildren: () => import('./busmanagement/busmanagement.module').then(module => module.BusmanagementModule)
      },
      {
        path: 'bookingmanagement',
        loadChildren: () => import('./bookingmanagement/bookingmanagement.module').then(module => module.BookingmanagementModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(module => module.ReportsModule)
      },
      {
        path: 'setting',
        loadChildren: () => import('./setting/setting.module').then(module => module.SettingModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
