import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagepermissiontoroleComponent } from './managepermissiontorole.component';

const routes: Routes = [
  {
    path: '',
    component: ManagepermissiontoroleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagePermissionToRoleRoutingModule { }
