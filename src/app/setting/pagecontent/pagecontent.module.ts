import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../theme/shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import {PagecontentComponent} from './pagecontent.component';
import { NotificationService } from '../../services/notification.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { importType } from '@angular/compiler/src/output/output_ast';
import {PageContentRoutingModule} from './pagecontent-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  imports: [
    CommonModule,
    PageContentRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    DataTablesModule,
    NgbModule,
    AngularEditorModule 
  ],
  declarations: [ PagecontentComponent],
  providers: [NotificationService]
})

export class PageContentModule { }