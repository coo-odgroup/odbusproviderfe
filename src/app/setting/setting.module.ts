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
import { UserreviewComponent } from './userreview/userreview.component';
import { UserComponent } from './user/user.component';
import { AgentComponent } from './agent/agent.component';
import { AgentcomissionComponent } from './agentcomission/agentcomission.component';
import { AgentfeeComponent } from './agentfee/agentfee.component';
import { OuragentComponent } from './ouragent/ouragent.component';
import { AgentwalletbalanceComponent } from './agentwalletbalance/agentwalletbalance.component';
import { AgentalltransactionComponent } from './agentalltransaction/agentalltransaction.component';
import { AgentfeedbackComponent } from './agentfeedback/agentfeedback.component';
import { AgentbookingreportComponent } from './agentbookingreport/agentbookingreport.component';
import { AgentcommissionreportComponent } from './agentcommissionreport/agentcommissionreport.component';
import { AgentcancellationreportComponent } from './agentcancellationreport/agentcancellationreport.component';
import { FaqComponent } from './faq/faq.component';


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
