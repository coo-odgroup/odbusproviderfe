import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignnotificationsComponent } from './campaignnotifications/campaignnotifications.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pushnotifications',
        loadChildren: () =>
          import('./pushnotifications/pushnotifications.module').then(
            (m) => m.PushnotificationsModule,
          ),
      },
      {
        path: 'campaignnotifications',
        loadChildren: () =>
          import('./campaignnotifications/campaignnotifications.module').then(
            (m) => m.CampaignnotificationsModule,
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
