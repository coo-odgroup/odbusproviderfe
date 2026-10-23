import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManageuserRoutingModule } from './manageuser-routing.module';
import { ManageuserComponent } from './manageuser.component';

@NgModule({
  declarations: [
    ManageuserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManageuserRoutingModule
  ]
})
export class ManageuserModule {}