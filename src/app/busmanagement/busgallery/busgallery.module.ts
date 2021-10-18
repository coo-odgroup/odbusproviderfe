import { NgModule } from '@angular/core';
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
    NgSelectModule  
  ],
  declarations: [ BusgalleryComponent],
  providers:[NotificationService]
})
export class BusGalleryModule { }