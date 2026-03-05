import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { TagComponent } from './tag.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagRoutingModule } from './tag-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  imports: [
    CommonModule,
    TagRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgxPrintModule,NgxSpinnerModule,
    ReactiveFormsModule,
    AngularEditorModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ TagComponent],
  providers: [NotificationService]
})

export class TagModule { }