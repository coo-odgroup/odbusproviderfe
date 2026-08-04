import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../theme/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from '../../services/notification.service';

import { CampaignnotificationsComponent } from './campaignnotifications.component';
import { CampaignnotificationsRoutingModule } from './campaignnotifications-routing.module';

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
    CampaignnotificationsRoutingModule,
  ],
  declarations: [
    CampaignnotificationsComponent
  ],
  providers: [
    NotificationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CampaignnotificationsModule { }