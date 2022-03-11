import { AssociationRoutingModule } from './association-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../theme/shared/shared.module';
import { AssignagentComponent } from './assignagent/assignagent.component';


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
