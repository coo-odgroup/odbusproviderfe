import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BookingreportComponent} from './bookingreport.component';

const routes: Routes = [
  {
    path: '',
    component: BookingreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingreportRoutingModule { }


