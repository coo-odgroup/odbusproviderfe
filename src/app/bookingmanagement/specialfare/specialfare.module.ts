import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialFareRoutingModule } from './specialfare-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {SpecialfareComponent} from './specialfare.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    SpecialFareRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule
  ],
  declarations: [ SpecialfareComponent],
  providers: [NotificationService]
})

export class SpecialFareModule { }