import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialFareRoutingModule } from './specialfare-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import {SpecialfareComponent} from './specialfare.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
//import {SelectModule} from 'ng-select';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    SpecialFareRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    //SelectModule,
    NgSelectModule,
    NgxPrintModule
  ],
  declarations: [ SpecialfareComponent],
  providers: [NotificationService]
})

export class SpecialFareModule { }