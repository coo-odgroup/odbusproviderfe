import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageTemplateComponent } from './managetemplate.component';

const routes: Routes = [
  {
    path: '',
    component: ManageTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageTemplateRoutingModule { }
