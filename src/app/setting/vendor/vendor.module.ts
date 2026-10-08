import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorRoutingModule } from './vendor-routing.module';
import { VendorComponent } from './vendor.component';

@NgModule({
  declarations: [
    VendorComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    VendorRoutingModule
  ]
})
export class VendorModule {}     