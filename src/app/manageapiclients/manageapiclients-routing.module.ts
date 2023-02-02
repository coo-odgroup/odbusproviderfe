import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'allapiclients',
        loadChildren: () => import('./allapiclient/allapiclient.module').then(module => module.AllApiClientModule)
      },     
      {
        path: 'apiclientwalletrequest',
        loadChildren: () => import('./apiclientwalletrequest/apiclientwalletrequest.module').then(module => module.ApiClientWalletRequestModule)
      },     
      {
        path: 'apclientwalletbalance',
        loadChildren: () => import('./apclientwalletbalance/apclientwalletbalance.module').then(module => module.ApclientwalletbalanceModule)
      },     
      {
        path: 'apiclientcommissionslab',
        loadChildren: () => import('./apiclientcommissionslab/apiclientcommissionslab.module').then(module => module.ApiClientCommissionSlabModule)
      },     
      {
        path: 'apibookingstickets',
        loadChildren: () => import('./apibookingstickets/apibookingstickets.module').then(module => module.ApiBookingsTicketsModule)
      },     
      {
        path: 'apicanceltickets',
        loadChildren: () => import('./apicanceltickets/apicanceltickets.module').then(module => module.ApiCancelTicketsModule)
      },     
      {
        path: 'apipnrdisputes',
        loadChildren: () => import('./apipnrdisputes/apipnrdisputes.module').then(module => module.ApiPnrDisputesModule)
      },     
      {
        path: 'manageclientsoperator',
        loadChildren: () => import('./manageclientsoperator/manageclientsoperator.module').then(module => module.ManageClientsOperatorModule)
      },     
      {
        path: 'alltransactionreport',
        loadChildren: () => import('./alltransactionreport/alltransactionreport.model').then(module => module.AlltransactionreportModule)
      },     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageApiClientsRoutingModule { }
