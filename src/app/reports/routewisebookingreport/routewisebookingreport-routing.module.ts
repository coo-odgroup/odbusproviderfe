import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import {CompletereportComponent} from './completereport.component';
import { RouteWiseBookingreport } from './routewisebookingreport.component';

const routes: Routes = [
  {
    path: '',
    component: RouteWiseBookingreport
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteWiseBookingreportModule { }
