
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {AssignagentsComponent} from './assignagents.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {AssignagentsRoutingModule} from './assignagents-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';
import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  imports: [
    CommonModule,
    AssignagentsRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,NgxSpinnerModule,
    NgbModule,NgxPrintModule
  ],
  declarations: [ AssignagentsComponent],
  providers: [NotificationService]
})

export class AssignagentsModule { }
