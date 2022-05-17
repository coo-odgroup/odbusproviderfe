import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ApclientwalletbalanceComponent} from './apclientwalletbalance.component';

const routes: Routes = [
  {
    path: '',
    component: ApclientwalletbalanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApclientwalletbalanceRoutingModule { }
