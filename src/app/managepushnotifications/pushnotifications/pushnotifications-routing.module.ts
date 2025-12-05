import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PushnotificationsComponent } from './pushnotifications.component';
const routes: Routes = [
  {
    path: '',
    component: PushnotificationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PushnotificationsRoutingModule {}
