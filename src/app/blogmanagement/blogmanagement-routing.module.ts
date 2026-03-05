import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'addCategory',
        loadChildren: () => import('./blogcategories/categories.module').then(module => module.CategoryModule)
      },
      {
        path: 'addBlog',
        loadChildren: () => import('./blog/blog.module').then(module => module.BlogModule)
      },
      {
        path: 'addTag',
        loadChildren: () => import('./tags/tag.module').then(module => module.TagModule)
      },
      {
        path: 'addTagmap',
        loadChildren: () => import('./tagmap/tagmap.module').then(module => module.TagmapModule)
      },
      {
        path: 'addBlogroute',
        loadChildren: () => import('./blogroute/blogroute.module').then(module => module.BlogrouteModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogmanagementModule { }
