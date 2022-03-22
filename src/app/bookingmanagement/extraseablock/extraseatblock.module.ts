import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from '@angular/common';
import { ExtraSeatBlockRoutingModule } from './extraseatblock-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import { ExtraseablockComponent } from './extraseablock.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {NgxPrintModule} from 'ngx-print';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    ExtraSeatBlockRoutingModule,
    SharedModule,
   NgSelectModule,NgxSpinnerModule,
    FormsModule,NgxPrintModule,NgbModule
  ],
  declarations: [ ExtraseablockComponent],
  providers: [NotificationService],schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ExtraSeatBlockModule { }