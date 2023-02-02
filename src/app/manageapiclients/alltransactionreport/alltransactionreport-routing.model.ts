import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AlltransactionreportComponent} from './alltransactionreport.component';

const routes: Routes = [
  {
    path: '',
    component: AlltransactionreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlltransactionreportRoutingModule { }
