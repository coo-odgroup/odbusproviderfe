
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManageuseraccessComponent } from './manageuseraccess.component';

const routes: Routes = [
  {
    path: '',
    component: ManageuseraccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageuseraccessRoutingModule {}
