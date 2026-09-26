import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorSeatblockComponent } from './vendor-seatblock.component';

const routes: Routes = [
  {
    path: '',
    component: VendorSeatblockComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorSeatBlockRoutingModule { }
