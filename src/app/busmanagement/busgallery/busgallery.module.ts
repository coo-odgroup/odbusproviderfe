import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusGalleryRoutingModule } from './busgallery-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BusgalleryComponent } from './busgallery.component';
import {NotificationService} from '../../services/notification.service';
import {ToastyModule} from 'ng2-toasty';



@NgModule({
  imports: [
    CommonModule,
    BusGalleryRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ToastyModule.forRoot()
  ],
  declarations: [ BusgalleryComponent],
  providers:[NotificationService]
})
export class BusGalleryModule { }