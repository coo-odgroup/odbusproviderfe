import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoupontypeComponent } from './coupontype.component';

const routes: Routes = [
  {
    path: '',
    component: CoupontypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponTypeRoutingModule { }
