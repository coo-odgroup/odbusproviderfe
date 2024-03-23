import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule} from '../theme/shared/shared.module';
import { FormsModule} from '@angular/forms';
import { AdminchangepasswordComponent } from './adminchangepassword.component';
import { NotificationService } from '../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminchangepasswordRoutingModule } from './adminchangepassword-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintModule } from 'ngx-print';


@NgModule({
  imports: [
    CommonModule,
    AdminchangepasswordRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,NgxPrintModule
  ],
  declarations: [ AdminchangepasswordComponent],
  providers: [NotificationService]
})

export class AdminchangepasswordModule { }
