import { SettingRoutingModule } from './setting-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../theme/shared/shared.module';
import { PagecontentComponent } from './pagecontent/pagecontent.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { SocialmediaComponent } from './socialmedia/socialmedia.component';
import { MastersettingComponent } from './mastersetting/mastersetting.component';
import { BannermanagementComponent } from './bannermanagement/bannermanagement.component';
import { SpecialsliderComponent } from './specialslider/specialslider.component';
import { SeosettingComponent } from './seosetting/seosetting.component';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingRoutingModule
  ]
})
export class SettingModule { }
