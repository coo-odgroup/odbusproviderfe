import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {AssignoperatorComponent} from './assignoperator.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {AssignoperatorRoutingModule} from './assignoperator-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';
import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  imports: [
    CommonModule,
    AssignoperatorRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,NgxSpinnerModule,
    NgbModule,NgxPrintModule
  ],
  declarations: [ AssignoperatorComponent],
  providers: [NotificationService]
})

export class AssignoperatorModule { }