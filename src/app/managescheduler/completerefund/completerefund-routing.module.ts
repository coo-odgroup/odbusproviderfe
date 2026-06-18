import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompleterefundComponent } from './completerefund.component';
const routes: Routes = [
  {
    path: '',
    component: CompleterefundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompleterefundRoutingModule {}
