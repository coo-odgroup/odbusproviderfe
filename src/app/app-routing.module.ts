import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { LoginComponent  } from './theme/layout/admin/login/login.component';
import {AuthComponent} from './theme/layout/auth/auth.component';
import { Routeguard } from './helpers/routeguard';

const routes: Routes = [
  {
    path: '',
    //component: LoginComponent,
    children:[
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then(module =>module.LoginModule)
      },
    ]
  },
  {
    path: '',
    component: AdminComponent,
    
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule),
        canActivate: [Routeguard]
      },
      {
        path: 'busmanagement',
        loadChildren: () => import('./busmanagement/busmanagement.module').then(module => module.BusmanagementModule),
        canActivate: [Routeguard]
      },
      {
        path: 'bookingmanagement',
        loadChildren: () => import('./bookingmanagement/bookingmanagement.module').then(module => module.BookingmanagementModule),
        canActivate: [Routeguard]
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(module => module.ReportsModule),
        canActivate: [Routeguard]
      },
      {
        path: 'setting',
        loadChildren: () => import('./setting/setting.module').then(module => module.SettingModule),
        canActivate: [Routeguard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
