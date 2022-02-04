import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {OuragentComponent} from './ouragent.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {OuragenttRoutingModule} from './ouragent-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    OuragenttRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,NgxPrintModule,
    NgbModule,AngularEditorModule,NgxSpinnerModule
  ],
  declarations: [ OuragentComponent],
  providers: [NotificationService],schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class OuragentModule { }