import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { ApclientwalletbalanceRoutingModule} from './apclientwalletbalance-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ApclientwalletbalanceComponent} from './apclientwalletbalance.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    ApclientwalletbalanceRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule,
    NgxSpinnerModule,
    NgbModule
  ],
  declarations: [ ApclientwalletbalanceComponent],
  providers: [NotificationService], schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ApclientwalletbalanceModule { }

