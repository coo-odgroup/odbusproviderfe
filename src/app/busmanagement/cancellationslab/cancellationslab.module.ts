import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";

import { CommonModule } from '@angular/common';
import { CancellationSlabRoutingModule } from './cancellationslab-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { CancellationslabComponent } from './cancellationslab.component';
import { NotificationService } from '../../services/notification.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';
@NgModule({
  imports: [
    CommonModule,
    CancellationSlabRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,NgxPrintModule,
    AngularEditorModule,NgxSpinnerModule
  ],
  declarations: [ CancellationslabComponent],
  providers: [NotificationService],schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CancellationSlabedModule { }