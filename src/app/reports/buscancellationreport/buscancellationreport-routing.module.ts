import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BuscancellationreportComponent} from './buscancellationreport.component';

const routes: Routes = [
  {
    path: '',
    component: BuscancellationreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusCancellationReportRoutingModule { }
