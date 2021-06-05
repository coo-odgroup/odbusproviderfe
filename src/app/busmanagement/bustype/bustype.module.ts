import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusTypeRoutingModule } from './bustype-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import { BustypeComponent } from './bustype.component';
import { NotificationService } from '../../services/notification.service';
import {ToastyModule} from 'ng2-toasty';


@NgModule({
  imports: [
    CommonModule,
    BusTypeRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    ToastyModule.forRoot()
  ],
  declarations: [ BustypeComponent],
  providers: [NotificationService]
})

export class BusTypedModule { }