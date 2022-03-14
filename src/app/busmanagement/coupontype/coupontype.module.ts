import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { CouponTypeRoutingModule } from './coupontype-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { CoupontypeComponent } from './coupontype.component';
import {NotificationService} from '../../services/notification.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {NgxPrintModule} from 'ngx-print';



@NgModule({
  imports: [
    CommonModule,
    CouponTypeRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    AngularEditorModule,
    NgxPrintModule,NgxSpinnerModule
  ],
  declarations: [ CoupontypeComponent],
  providers:[NotificationService], schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class CouponTypeModule { }