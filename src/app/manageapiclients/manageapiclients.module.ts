import { ManageApiClientsRoutingModule } from './manageapiclients-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../theme/shared/shared.module';
import { AllapiclientComponent } from './allapiclient/allapiclient.component';
import { ApiclientwalletrequestComponent } from './apiclientwalletrequest/apiclientwalletrequest.component';
import { ApclientwalletbalanceComponent } from './apclientwalletbalance/apclientwalletbalance.component';
import { ApiclientcommissionslabComponent } from './apiclientcommissionslab/apiclientcommissionslab.component';
import { ApibookingsticketsComponent } from './apibookingstickets/apibookingstickets.component';
import { ApicancelticketsComponent } from './apicanceltickets/apicanceltickets.component';
import { ApipnrdisputesComponent } from './apipnrdisputes/apipnrdisputes.component';
import { ManageclientsoperatorComponent } from './manageclientsoperator/manageclientsoperator.component';
import { AlltransactionreportComponent } from './alltransactionreport/alltransactionreport.component';
import { ApitransactionreportComponent } from './apitransactionreport/apitransactionreport.component';


@NgModule({
  declarations: [
  

  ],
  imports: [
    CommonModule,
    SharedModule,
    ManageApiClientsRoutingModule
  ]
})
export class ManageApiClientsModule { }
