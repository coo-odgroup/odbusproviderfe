import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsComponent } from './tickets/tickets.component';
import { SeatComponent } from './seat/seat.component';
import { TransactionComponent } from './transaction/transaction.component';



@NgModule({
  declarations: [TicketsComponent, SeatComponent, TransactionComponent],
  imports: [
    CommonModule
  ]
})
export class ReportsModule { }
