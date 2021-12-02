import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { CouponRoutingModule } from './coupon-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { CouponComponent } from './coupon.component';
import {NotificationService} from '../../services/notification.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {NgxPrintModule} from 'ngx-print';
@NgModule({
  imports: [
    CommonModule,
    CouponRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    AngularEditorModule,
    NgxPrintModule,NgxSpinnerModule
  ],
  declarations: [ CouponComponent],
  providers:[NotificationService], schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class CouponModule { }