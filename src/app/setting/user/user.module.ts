import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {UserComponent} from './user.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {UserRoutingModule} from './user-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule,AngularEditorModule
  ],
  declarations: [ UserComponent],
  providers: [NotificationService]
})

export class UserModule { }