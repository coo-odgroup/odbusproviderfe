import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {MastersettingComponent} from './mastersetting.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {MasterSettingRoutingModule} from './mastersetting-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    MasterSettingRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
  
    NgbModule
  ],
  declarations: [ MastersettingComponent],
  providers: [NotificationService]
})

export class MasterSettingModule { }