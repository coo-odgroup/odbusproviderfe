import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BlogComponent } from './blog.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { BlogRoutingModule } from './blog-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  imports: [
    CommonModule,
    BlogRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgxPrintModule,NgxSpinnerModule,
    ReactiveFormsModule,
    AngularEditorModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ BlogComponent],
  providers: [NotificationService]
})

export class BlogModule { }