import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {BannermanagementComponent} from './bannermanagement.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {BannerManagementRoutingModule} from './bannermanagement-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    BannerManagementRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule
  ],
  declarations: [ BannermanagementComponent],
  providers: [NotificationService]
})

export class BannerManagementModule { }