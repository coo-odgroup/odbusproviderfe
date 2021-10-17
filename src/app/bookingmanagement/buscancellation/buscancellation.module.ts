import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusCancellationRoutingModule } from './buscancellation-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
//import {FormsModule} from '@angular/forms';
import { BuscancellationComponent } from './buscancellation.component';
import { NotificationService } from '../../services/notification.service';
//import {SelectModule} from 'ng-select';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
  imports: [
    CommonModule,
    BusCancellationRoutingModule,
    SharedModule,
    //FormsModule,
    DataTablesModule,
   // SelectModule,
   NgSelectModule,
    FormsModule,NgxPrintModule
  ],
  declarations: [ BuscancellationComponent],
  providers: [NotificationService]
})

export class BusCancellationModule { }