import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusTypeRoutingModule } from './bustype-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import { BustypeComponent } from './bustype.component';
import { NotificationService } from '../../services/notification.service';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    BusTypeRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgxPrintModule
    ],
  declarations: [ BustypeComponent],
  providers: [NotificationService]
})

export class BusTypedModule { }