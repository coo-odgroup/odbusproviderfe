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
      {
        path: 'signup',
        loadChildren: () => import('./signup/signup.module').then(module =>module.SignupModule)
      },
      {
        path: 'otp',
        loadChildren: () => import('./otp/otp.module').then(module =>module.OtpModule)
      },
      {
        path: 'agentDetails',
        loadChildren: () => import('./agent-details/agent-details.module').then(module =>module.AgentDetailsModule)
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
        path: 'howtouse',
        loadChildren: () => import('./howtouse/howtouse.module').then(module => module.HowtouseModule),
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
      {
        path: 'agent',
        loadChildren: () => import('./agent/agent.module').then(module => module.AgentModule),
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
