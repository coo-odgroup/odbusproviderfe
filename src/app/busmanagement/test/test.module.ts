import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestRoutingModule } from './test-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TestComponent } from './test.component';
import {NotificationService} from '../../services/notification.service';
import {ToastyModule} from 'ng2-toasty';
import {SelectModule} from 'ng-select';
import { DragulaModule } from 'ng2-dragula';
@NgModule({
  imports: [
    CommonModule,
    TestRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    SelectModule,
    ReactiveFormsModule,
    ToastyModule.forRoot(),
    DragulaModule.forRoot()
  ],
  declarations: [ TestComponent],
  providers:[NotificationService]
})
export class TestModule { }