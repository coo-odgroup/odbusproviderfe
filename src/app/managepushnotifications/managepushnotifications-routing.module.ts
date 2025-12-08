import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pushnotifications',
        loadChildren: () =>
          import('./pushnotifications/pushnotifications.module').then(
            module => module.PushnotificationsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePushnotificationsRoutingModule {}
