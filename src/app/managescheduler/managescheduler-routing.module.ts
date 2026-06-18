import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'customercancelrefund',
        loadChildren: () => import('./customercancelrefund/customercancelrefund.module').then(module => module.CustomercancelrefundModule)
      },
      {
        path: 'completerefund',
        loadChildren: () => import('./completerefund/completerefund.module').then(module => module.CompleterefundModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageSchedulerRoutingModule { }