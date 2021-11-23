import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusTypeRoutingModule } from './bustype-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { BustypeComponent } from './bustype.component';
import { NotificationService } from '../../services/notification.service';
import {NgxPrintModule} from 'ngx-print';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  imports: [
    CommonModule,
    BusTypeRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule
    ],
  declarations: [ BustypeComponent],
  providers: [NotificationService]
})

export class BusTypedModule { }