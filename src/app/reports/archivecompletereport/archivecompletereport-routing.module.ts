import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ArchiveCompletereportComponent} from './archivecompletereport.component';

const routes: Routes = [
  {
    path: '',
    component: ArchiveCompletereportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchiveCompletereportRoutingModule { }
