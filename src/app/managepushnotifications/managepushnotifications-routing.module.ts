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
            (m) => m.PushnotificationsModule
          )
      },

      {
        path: 'campaignnotifications',
        loadChildren: () =>
          import('./campaignnotifications/campaignnotifications.module').then(
            (m) => m.CampaignnotificationsModule
          )
      },

      {
        path: 'notificationlogreport',
        loadChildren: () =>
          import('./notification-log-report/notification-log-report.module').then(
            (m) => m.NotificationLogReportModule
          )
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagePushnotificationsRoutingModule {}