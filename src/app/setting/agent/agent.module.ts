import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {AgentComponent} from './agent.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {AgentRoutingModule} from './agent-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    AgentRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,NgxPrintModule,
    NgbModule,AngularEditorModule
  ],
  declarations: [ AgentComponent],
  providers: [NotificationService]
})

export class AgentModule { }