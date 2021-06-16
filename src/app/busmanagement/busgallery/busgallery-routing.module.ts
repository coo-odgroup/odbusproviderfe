import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BusgalleryComponent} from './busgallery.component';

const routes: Routes = [
  {
    path: '',
    component: BusgalleryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusGalleryRoutingModule { }
