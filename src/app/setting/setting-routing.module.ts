import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pagecontent',
        loadChildren: () => import('./pagecontent/pagecontent.module').then(module => module.PageContentModule)
      },
      {
        path: 'socialmedia',
        loadChildren: () => import('./socialmedia/socialmedia.module').then(module => module.SocialMediaModule)
      },
      {
        path: 'association',
        loadChildren: () => import('./association/association.module').then(module => module.AssociationModule)
      },
      {
        path: 'testimonial',
        loadChildren: () => import('./testimonial/testimonial.module').then(module => module.TestimonialModule)
      },
      {
        path: 'bannermanagement',
        loadChildren: () => import('./bannermanagement/bannermanagement.module').then(module => module.BannerManagementModule)
      },
      {
        path: 'seosetting',
        loadChildren: () => import('./seosetting/seosetting.module').then(module => module.SeoSettingModule)
      },
      {
        path: 'specialslider',
        loadChildren: () => import('./specialslider/specialslider.module').then(module => module.SpecialSliderModule)
      },
      {
        path: 'mastersetting',
        loadChildren: () => import('./mastersetting/mastersetting.module').then(module => module.MasterSettingModule)
      }, 
      {
        path: 'userreview',
        loadChildren: () => import('./userreview/userreview.module').then(module => module.UserReviewlModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(module => module.UserModule)
      },
      {
        path: 'agent',
        loadChildren: () => import('./agent/agent.module').then(module => module.AgentModule)
      },
      {
        path: 'agentcomission',
        loadChildren: () => import('./agentcomission/agentcomission.module').then(module => module.AgentComissionModule)
      },
      {
        path: 'agentfee',
        loadChildren: () => import('./agentfee/agentfee.module').then(module => module.AgentFeeModule)
      },
      {
        path: 'ouragent',
        loadChildren: () => import('./ouragent/ouragent.module').then(module => module.OuragentModule)
      },
      {
        path: 'agentalltransaction',
        loadChildren: () => import('./agentalltransaction/agentalltransaction.module').then(module => module.AgentalltransactionModule)
      },
      {
        path: 'agentfeedback',
        loadChildren: () => import('./agentfeedback/agentfeedback.module').then(module => module.AgentfeedbackModule)
      },
      {
        path: 'agentwalletbalance',
        loadChildren: () => import('./agentwalletbalance/agentwalletbalance.module').then(module => module.AgentwalletbalanceModule)
      },
      {
        path: 'agentbookingreport',
        loadChildren: () => import('./agentbookingreport/agentbookingreport.module').then(module => module.AgentbookingreportModule)
      },
      {
        path: 'agentcancellationreport',
        loadChildren: () => import('./agentcancellationreport/agentcancellationreport.module').then(module => module.AgentcancellationreportModule)
      },
      {
        path: 'agentcommissionreport',
        loadChildren: () => import('./agentcommissionreport/agentcommissionreport.module').then(module => module.AgentcommissionreportModule)
      },
      {
        path: 'faq',
        loadChildren: () => import('./faq/faq.module').then(module => module.FaqModule)
      },
    
    
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
