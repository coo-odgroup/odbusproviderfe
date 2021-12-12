import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssociationRoutingModule } from './association-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule } from '@angular/forms';
import { AssociationComponent } from './association.component';
import {NotificationService} from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  imports: [
    CommonModule,
    AssociationRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,NgxSpinnerModule
  ],
  declarations: [ AssociationComponent],
  providers:[NotificationService]
})
export class AssociationModule { }

