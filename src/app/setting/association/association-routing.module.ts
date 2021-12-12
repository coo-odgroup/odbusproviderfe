
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssociationComponent} from './association.component';


const routes: Routes = [
  {
    path: '',
    component: AssociationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssociationRoutingModule { }