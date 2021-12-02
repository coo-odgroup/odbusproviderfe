import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { SeatingTypeRoutingModule } from './seatingtype-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { SeatingtypeComponent } from './seatingtype.component';
import { NotificationService } from '../../services/notification.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
  imports: [
    CommonModule,
    SeatingTypeRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxPrintModule,NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ SeatingtypeComponent],
  providers: [NotificationService]
})
export class SeatingTypeModule { }