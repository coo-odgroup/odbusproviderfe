import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancellationSlabRoutingModule } from './cancellationslab-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { CancellationslabComponent } from './cancellationslab.component';
import { NotificationService } from '../../services/notification.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {NgxPrintModule} from 'ngx-print';
@NgModule({
  imports: [
    CommonModule,
    CancellationSlabRoutingModule,
    SharedModule,
    FormsModule,
    NgbModule,NgxPrintModule,
    AngularEditorModule
  ],
  declarations: [ CancellationslabComponent],
  providers: [NotificationService]
})
export class CancellationSlabedModule { }