import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExtraseablockComponent} from './extraseablock.component';

const routes: Routes = [
  {
    path: '',
    component: ExtraseablockComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraSeatBlockRoutingModule { }
