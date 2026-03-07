import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TagmapComponent } from './tagmap.component';


const routes: Routes = [
  {
    path: '',
    component: TagmapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagmapRoutingModule { }
