import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'cancelticket',
        loadChildren: () => import('./cancelticket/cancelticket.module').then(module => module.CancelTicketModule)
      },  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketInformationRoutingModule { }
