import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'assignbus',
        loadChildren: () => import('./assignbus/assignbus.module').then(module => module.AssignbusModule)
      },
      {
        path: 'assignoperator',
        loadChildren: () => import('./assignoperator/assignoperator.module').then(module => module.AssignoperatorModule)
      },
      {
        path: 'bookingreport',
        loadChildren: () => import('./bookingreport/bookingreport.module').then(module => module.BookingreportModule)
      },
      {
        path: 'cancelreport',
        loadChildren: () => import('./cancelreport/cancelreport.module').then(module => module.CancelreportModule)
      },
      {
        path: 'assignagent',
        loadChildren: () => import('./assignagent/assign.module').then(module => module.AssignagentModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssociationRoutingModule { }
