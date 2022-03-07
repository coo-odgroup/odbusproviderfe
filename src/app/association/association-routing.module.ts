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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssociationRoutingModule { }
