import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'customercancelrefund',
        loadChildren: () => import('./customercancelrefund/customercancelrefund.module').then(module => module.CustomercancelrefundModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageSchedulerRoutingModule { }