import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {PushnotificationComponent} from './pushnotification.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {PushNotificationRoutingModule} from './pushnotification-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    PushNotificationRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgxPrintModule
  ],
  declarations: [ PushnotificationComponent],
  providers: [NotificationService]
})

export class PushNotificationModule { }