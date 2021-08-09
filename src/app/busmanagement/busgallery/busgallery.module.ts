import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusGalleryRoutingModule } from './busgallery-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BusgalleryComponent } from './busgallery.component';
import {NotificationService} from '../../services/notification.service';



@NgModule({
  imports: [
    CommonModule,
    BusGalleryRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule  ],
  declarations: [ BusgalleryComponent],
  providers:[NotificationService]
})
export class BusGalleryModule { }