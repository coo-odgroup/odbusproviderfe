import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PagecontentComponent} from './pagecontent.component';

const routes: Routes = [
  {
    path: '',
    component: PagecontentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageContentRoutingModule { }
