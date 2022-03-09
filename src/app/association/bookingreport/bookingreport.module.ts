
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {BookingreportComponent} from './bookingreport.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {BookingreportRoutingModule} from './bookingreport-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';
import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  imports: [
    CommonModule,
    BookingreportRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,NgxSpinnerModule,
    NgbModule,NgxPrintModule
  ],
  declarations: [ BookingreportComponent],
  providers: [NotificationService]
})

export class BookingreportModule { }
