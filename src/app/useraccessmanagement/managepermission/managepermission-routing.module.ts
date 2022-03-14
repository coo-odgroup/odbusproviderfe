import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagepermissionComponent} from './managepermission.component';

const routes: Routes = [
  {
    path: '',
    component: ManagepermissionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagePermissionRoutingModule { }
