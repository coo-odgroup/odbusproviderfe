import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialFareRoutingModule } from './specialfare-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import {SpecialfareComponent} from './specialfare.component';
import { NotificationService } from '../../services/notification.service';
import {ToastyModule} from 'ng2-toasty';
import { NgSelectModule } from '@ng-select/ng-select';
//import {SelectModule} from 'ng-select';

@NgModule({
  imports: [
    CommonModule,
    SpecialFareRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    //SelectModule,
    NgSelectModule,
    ToastyModule.forRoot()
  ],
  declarations: [ SpecialfareComponent],
  providers: [NotificationService]
})

export class SpecialFareModule { }