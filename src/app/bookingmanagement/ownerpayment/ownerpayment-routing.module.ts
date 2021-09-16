import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OwnerpaymentComponent} from './ownerpayment.component';

const routes: Routes = [
  {
    path: '',
    component: OwnerpaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerPaymentRoutingModule { }
