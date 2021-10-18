import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {CouponuseduserreportComponent} from './couponuseduserreport.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {CouponUsedUserReportRoutingModule} from './couponuseduserreport-route.model';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    CouponUsedUserReportRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule
  ],
  declarations: [ CouponuseduserreportComponent],
  providers: [NotificationService]
})

export class CouponUsedUserReportModule { }