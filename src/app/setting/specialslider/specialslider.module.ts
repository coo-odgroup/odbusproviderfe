import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {SpecialsliderComponent} from './specialslider.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {SpecialSliderRoutingModule} from './specialslider-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    SpecialSliderRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule
  ],
  declarations: [ SpecialsliderComponent],
  providers: [NotificationService]
})

export class SpecialSliderModule { }