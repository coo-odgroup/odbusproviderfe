import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MastersettingComponent} from './mastersetting.component';

const routes: Routes = [
  {
    path: '',
    component: MastersettingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterSettingRoutingModule { }
