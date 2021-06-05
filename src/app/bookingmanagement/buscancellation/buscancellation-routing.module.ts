import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BuscancellationComponent} from './buscancellation.component';

const routes: Routes = [
  {
    path: '',
    component: BuscancellationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusCancellationRoutingModule { }
