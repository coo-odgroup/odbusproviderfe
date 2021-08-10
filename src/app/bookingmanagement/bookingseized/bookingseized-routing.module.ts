import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BookingseizedComponent} from './bookingseized.component';

const routes: Routes = [
  {
    path: '',
    component: BookingseizedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingSeizedRoutingModule { }
