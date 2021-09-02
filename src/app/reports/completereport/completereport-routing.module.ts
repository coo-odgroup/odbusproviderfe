import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CompletereportComponent} from './completereport.component';

const routes: Routes = [
  {
    path: '',
    component: CompletereportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompleteReportRoutingModule { }
