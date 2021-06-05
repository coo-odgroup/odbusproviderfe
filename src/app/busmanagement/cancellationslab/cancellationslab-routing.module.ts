import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CancellationslabComponent} from './cancellationslab.component';

const routes: Routes = [
  {
    path: '',
    component: CancellationslabComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancellationSlabRoutingModule { }
