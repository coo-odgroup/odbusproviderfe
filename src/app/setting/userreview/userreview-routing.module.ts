
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserreviewComponent} from './userreview.component';

const routes: Routes = [
  {
    path: '',
    component: UserreviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserReviewRoutingModule { }
