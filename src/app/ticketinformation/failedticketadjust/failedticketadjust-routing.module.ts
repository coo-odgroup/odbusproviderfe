import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FailedticketadjustComponent} from './failedticketadjust.component';

const routes: Routes = [
  {
    path: '',
    component: FailedticketadjustComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FailedticketadjustRoutingModule { }
