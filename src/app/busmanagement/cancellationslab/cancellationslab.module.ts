import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancellationSlabRoutingModule } from './cancellationslab-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import { CancellationslabComponent } from './cancellationslab.component';
import { NotificationService } from '../../services/notification.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
@NgModule({
  imports: [
    CommonModule,
    CancellationSlabRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgbModule,
    AngularEditorModule
  ],
  declarations: [ CancellationslabComponent],
  providers: [NotificationService]
})
export class CancellationSlabedModule { }