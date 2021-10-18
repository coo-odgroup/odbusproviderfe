import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {SocialmediaComponent} from './socialmedia.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {SocialMediaRoutingModule} from './socialmedia-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    SocialMediaRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgbModule
  ],
  declarations: [ SocialmediaComponent],
  providers: [NotificationService]
})

export class SocialMediaModule { }