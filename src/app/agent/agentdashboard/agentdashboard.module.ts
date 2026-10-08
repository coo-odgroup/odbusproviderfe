import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintModule } from 'ngx-print';
import { AgentdashboardComponent } from './agentdashboard.component';
import { AgentdashboardRoutingModule } from './agentdashboard-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AgentdashboardRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgxPrintModule,
  ],
  declarations: [AgentdashboardComponent],
  providers: [NotificationService],
})
export class AgentdashboardModule {}
