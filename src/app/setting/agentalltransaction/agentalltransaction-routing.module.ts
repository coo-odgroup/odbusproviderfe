import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgentalltransactionComponent} from './agentalltransaction.component';

const routes: Routes = [
  {
    path: '',
    component: AgentalltransactionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentalltransactionRoutingModule { }
