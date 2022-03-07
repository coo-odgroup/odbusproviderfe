import { AssociationRoutingModule } from './association-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../theme/shared/shared.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    AssociationRoutingModule
  ]
})
export class AssociationModule { }
