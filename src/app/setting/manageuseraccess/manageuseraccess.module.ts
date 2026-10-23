
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ManageuseraccessComponent } from './manageuseraccess.component';

@NgModule({
  declarations: [ManageuseraccessComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ManageuseraccessComponent
      }
    ])
  ]
})
export class ManageuseraccessModule {}
