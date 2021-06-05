import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancellationSlabRoutingModule } from './cancellationslab-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import { CancellationslabComponent } from './cancellationslab.component';
import { NotificationService } from '../../services/notification.service';
import {ToastyModule} from 'ng2-toasty';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  imports: [
    CommonModule,
    CancellationSlabRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgbModule,
    ToastyModule.forRoot()
  ],
  declarations: [ CancellationslabComponent],
  providers: [NotificationService]
})
export class CancellationSlabedModule { }