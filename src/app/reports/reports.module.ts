import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsComponent } from './tickets/tickets.component';
import { SeatComponent } from './seat/seat.component';
import { TransactionComponent } from './transaction/transaction.component';
import {ReportRoutingModule} from './report-routing.module';
import { SeatopenreportComponent } from './seatopenreport/seatopenreport.component';
import { SeatblockreportComponent } from './seatblockreport/seatblockreport.component';
import { ExtraseatopenreportComponent } from './extraseatopenreport/extraseatopenreport.component';
import { CompletereportComponent } from './completereport/completereport.component';
import { CancelticketsreportComponent } from './cancelticketsreport/cancelticketsreport.component';





@NgModule({
  declarations: [ 
    
  ],
  imports: [
    CommonModule,
    ReportRoutingModule
  ]
})
export class ReportsModule { }
