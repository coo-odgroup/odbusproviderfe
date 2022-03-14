import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
     children: [
       {
            path: 'managerole',
            loadChildren: () => import('./managerole/managerole.module').then(module => module.ManageroleModule)
       },
       {
           path: 'managepermission',
           loadChildren: () => import('./managepermission/managepermission.module').then(module => module.ManagepermissionModule)
       },
       {
           path: 'managepermissiontorole',
           loadChildren: () => import('./managepermissiontorole/managepermissiontorole.module').then(module => module.ManagePermissionToRoleModule)
       },
       
     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAccessManagementRoutingModule { }
