import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusCancellationRoutingModule } from './buscancellation-routing.module';
import {SharedModule} from '../../theme/shared/shared.module';
import { BuscancellationComponent } from './buscancellation.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
  imports: [
    CommonModule,
    BusCancellationRoutingModule,
    SharedModule,
   NgSelectModule,
    FormsModule,NgxPrintModule
  ],
  declarations: [ BuscancellationComponent],
  providers: [NotificationService]
})

export class BusCancellationModule { }