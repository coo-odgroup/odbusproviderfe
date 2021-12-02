import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";

import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SocialmediaComponent } from './socialmedia.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { SocialMediaRoutingModule } from './socialmedia-routing.module';
import { NgxPrintModule } from 'ngx-print';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    SocialMediaRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule, NgxPrintModule, NgxSpinnerModule
  ], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [SocialmediaComponent],
  providers: [NotificationService]
})

export class SocialMediaModule { }