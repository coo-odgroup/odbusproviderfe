import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
      path: '',
      children: [
        {
            path: 'assignoperator',
            loadChildren: () => import('./assignoperator/assignoperator.module').then(module => module.AssignOperatorModule)
        },  
        {
            path: 'assignoperatorbus',
            loadChildren: () => import('./assignoperatorbus/assignoperatorbus.module').then(module => module.AssignOperatorBusModule)
        }, 
        {
            path: 'assignagent',
            loadChildren: () => import('./assignagents/assignagents.module').then(module => module.AssignagentsModule)
        },               
        {
            path: 'operatorbookingreport',
            loadChildren: () => import('./operatorbookingreport/operatorbookingreport.module').then(module => module.OperatorBookingReportModule)
        },
        {
            path: 'operatorcancelreport',
            loadChildren: () => import('./operatorcancelreport/operatorcancelreport.module').then(module => module.OperatorCancelReportModule)
        },
      ]
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class OperatorRoutingModule {}