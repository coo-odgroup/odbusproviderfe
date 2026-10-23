import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManageuserComponent } from './manageuser.component';

const routes: Routes = [
  {
    path: '',
    component: ManageuserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageuserRoutingModule {}