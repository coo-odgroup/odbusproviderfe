import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusRoutingModule } from './bus-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BusComponent } from './bus.component';
import {NotificationService} from '../../services/notification.service';
import {ToastyModule} from 'ng2-toasty';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArchwizardModule } from 'angular-archwizard';
@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    BusRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgSelectModule,
    ReactiveFormsModule,
    ArchwizardModule,
    ToastyModule.forRoot()
  ],
  declarations: [ BusComponent],
  providers:[NotificationService]
})
export class BusModule { }