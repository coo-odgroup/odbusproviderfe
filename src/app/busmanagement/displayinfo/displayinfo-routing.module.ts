import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DisplayInfoComponent} from './displayinfo.component';

const routes: Routes = [
  {
    path: '',
    component: DisplayInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisplayInfoRoutingModule { }
