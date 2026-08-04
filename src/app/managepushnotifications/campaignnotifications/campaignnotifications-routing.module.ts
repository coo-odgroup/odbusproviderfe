import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignnotificationsComponent } from './campaignnotifications.component';

const routes: Routes = [
  {
    path: '',
    component: CampaignnotificationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignnotificationsRoutingModule { }