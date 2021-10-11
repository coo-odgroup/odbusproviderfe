import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatingTypeRoutingModule } from './seatingtype-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { SeatingtypeComponent } from './seatingtype.component';
import { NotificationService } from '../../services/notification.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
  imports: [
    CommonModule,
    SeatingTypeRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgbModule,
    NgxPrintModule
  ],
  declarations: [ SeatingtypeComponent],
  providers: [NotificationService]
})
export class SeatingTypeModule { }