import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPrintModule } from 'ngx-print';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompleterefundComponent } from './completerefund.component';
import { CompleterefundRoutingModule } from './completerefund-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxPrintModule,
    NgxSpinnerModule,
    NgbModule,
    CompleterefundRoutingModule
  ],
  declarations: [CompleterefundComponent],
  providers: [NotificationService], schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class CompleterefundModule { }