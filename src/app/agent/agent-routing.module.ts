import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'notification',
        loadChildren: () => import('./notification/notification.module').then(module => module.NotificationModule)
      },
      {
        path: 'wallet',
        loadChildren: () => import('./wallet/wallet.module').then(module => module.WalletModule)
      }
     
    
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule { }
