import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FestivalFareRoutingModule } from './festivalfare-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import {FestivalfareComponent} from './festivalfare.component';
import { NotificationService } from '../../services/notification.service';
import {ToastyModule} from 'ng2-toasty';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FestivalFareRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    DataTablesModule,
    ToastyModule.forRoot()
  ],
  declarations: [ FestivalfareComponent],
  providers: [NotificationService]
})

export class FestivalFareModule { }