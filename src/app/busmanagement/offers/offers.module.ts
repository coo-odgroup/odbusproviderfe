import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferRoutingModule } from './offers-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { OffersComponent } from './offers.component';
import { NgxSpinnerModule } from "ngx-spinner";
import {NotificationService} from '../../services/notification.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {NgxPrintModule} from 'ngx-print';
@NgModule({
  imports: [
    CommonModule,
    OfferRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    NgbModule,
    NgSelectModule,
    AngularEditorModule,NgxPrintModule
  ],
  declarations: [ OffersComponent],
  providers: [NotificationService]
})
export class OfferModule { }