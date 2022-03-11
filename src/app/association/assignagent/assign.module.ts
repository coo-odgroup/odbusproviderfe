
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {AssignagentComponent} from './assignagent.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {AssignagentRoutingModule} from './assignagent-route.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';
import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  imports: [
    CommonModule,
    AssignagentRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,NgxSpinnerModule,
    NgbModule,NgxPrintModule
  ],
  declarations: [ AssignagentComponent],
  providers: [NotificationService]
})

export class AssignagentModule { }
