
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {CancelreportComponent} from './cancelreport.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {CancelreportRoutingModule} from './cancelreport-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
  imports: [
    CommonModule,
    CancelreportRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,NgxPrintModule
  ],
  declarations: [ CancelreportComponent],
  providers: [NotificationService]
})

export class CancelreportModule { }
