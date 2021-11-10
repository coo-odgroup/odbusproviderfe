import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule} from '../../theme/shared/shared.module';
import { FormsModule} from '@angular/forms';
import { CustomercommissionslabComponent } from './customercommissionslab.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerCommissionSlabRoutingModule } from './customercommissionslab-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintModule } from 'ngx-print';


@NgModule({
  imports: [
    CommonModule,
    CustomerCommissionSlabRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,NgxPrintModule
  ],
  declarations: [ CustomercommissionslabComponent],
  providers: [NotificationService]
})

export class CustomerCommissionslabReportModule { }