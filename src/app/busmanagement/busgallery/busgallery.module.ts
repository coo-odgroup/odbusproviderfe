import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { BusGalleryRoutingModule } from './busgallery-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BusgalleryComponent } from './busgallery.component';
import {NotificationService} from '../../services/notification.service';
import {NgxPrintModule} from 'ngx-print';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  imports: [
    CommonModule,
    BusGalleryRoutingModule,
    SharedModule,NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPrintModule,
    NgSelectModule  ,NgxSpinnerModule
  ],
  declarations: [ BusgalleryComponent],
  providers:[NotificationService],schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BusGalleryModule { }