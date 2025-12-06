import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPrintModule } from 'ngx-print';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PushnotificationsComponent } from './pushnotifications.component';
import { PushnotificationsRoutingModule } from './pushnotifications-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxPrintModule,
    NgxSpinnerModule,
    NgbModule,
    PushnotificationsRoutingModule,
  ],
  declarations: [PushnotificationsComponent],
  providers: [NotificationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PushnotificationsModule {}
