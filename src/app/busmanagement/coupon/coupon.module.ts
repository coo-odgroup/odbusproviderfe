import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponRoutingModule } from './coupon-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { CouponComponent } from './coupon.component';
import {NotificationService} from '../../services/notification.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
@NgModule({
  imports: [
    CommonModule,
    CouponRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    AngularEditorModule
  ],
  declarations: [ CouponComponent],
  providers:[NotificationService]
})
export class CouponModule { }