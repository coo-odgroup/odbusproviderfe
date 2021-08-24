import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'seatopenReport',
        loadChildren: () => import('./seatopenreport/seatopenreport.module').then(module => module.SeatOpenReportModule)
      },
      {
        path: 'seatblockReport',
        loadChildren: () => import('./seatblockreport/seatblockreport.module').then(module => module.SeatBlockReportModule)
      },
      {
        path: 'extraseatopenReport',
        loadChildren: () => import('./extraseatopenreport/extraseatopenreport.module').then(module => module.ExtraSeatOpenReportModule)
      }         
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
