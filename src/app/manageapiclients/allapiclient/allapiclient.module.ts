import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { AllApiClientRoutingModule } from './allapiclient-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {AllapiclientComponent} from './allapiclient.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    AllApiClientRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule,
    NgxSpinnerModule,
    NgbModule
  ],
  declarations: [ AllapiclientComponent],
  providers: [NotificationService], schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AllApiClientModule { }