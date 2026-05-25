import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateListComponent } from './templatelist.component';

const routes: Routes = [
  {
    path: '',
    component: TemplateListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateListRoutingModule { }
