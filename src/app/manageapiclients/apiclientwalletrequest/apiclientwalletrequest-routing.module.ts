import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ApiclientwalletrequestComponent} from './apiclientwalletrequest.component';

const routes: Routes = [
  {
    path: '',
    component: ApiclientwalletrequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiClientWalletRequestRoutingModule { }
