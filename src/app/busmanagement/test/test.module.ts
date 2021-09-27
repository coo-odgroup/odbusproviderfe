import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestRoutingModule } from './test-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TestComponent } from './test.component';
import {NotificationService} from '../../services/notification.service';

import { DragulaModule } from 'ng2-dragula';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  imports: [
    CommonModule,
    TestRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgbModule,
    DragulaModule.forRoot()
  ],
  declarations: [ TestComponent],
  providers:[NotificationService]
})
export class TestModule { }