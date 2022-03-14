import { UserAccessManagementRoutingModule } from './useraccessmanagement-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../theme/shared/shared.module';
import { ManageroleComponent } from './managerole/managerole.component';
import { ManagepermissionComponent } from './managepermission/managepermission.component';
import { ManagepermissiontoroleComponent } from './managepermissiontorole/managepermissiontorole.component';


@NgModule({
  declarations: [  
   
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserAccessManagementRoutingModule

  ]
})
export class  UserAccessManagementModule { }
