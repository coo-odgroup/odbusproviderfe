import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";

import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { FaqComponent} from './faq.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {FaqRoutingModule} from './faq-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  imports: [
    CommonModule,
    FaqRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,NgxSpinnerModule,
    AngularEditorModule
  ],schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ FaqComponent],
  providers: [NotificationService]
})

export class FaqModule { }