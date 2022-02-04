import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {AgentalltransactionComponent} from './agentalltransaction.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {AgentalltransactionRoutingModule} from './agentalltransaction-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  imports: [
    CommonModule,
    AgentalltransactionRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,AngularEditorModule,NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ AgentalltransactionComponent],
  providers: [NotificationService]
})

export class AgentalltransactionModule { }