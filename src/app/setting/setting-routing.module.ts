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
    
    
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
