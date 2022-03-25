import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../model/user';
import { Constants } from '../../constant/constant';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AssociationService } from '../../services/association.service';
import { BusOperatorService } from './../../services/bus-operator.service';
import {OprassignagentsService} from './../../services/oprassignagents.service';
import { constant } from 'lodash';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-assignagents',
  templateUrl: './assignagents.component.html',
  styleUrls: ['./assignagents.component.scss']
})
export class AssignagentsComponent implements OnInit {

  public form: FormGroup;
  public editform: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  public pwdform: FormGroup;

  pagination: any;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading: any;
  public ModalBtn: any;

  user: User[];
  userRecord: User;
  busoperators: any;
  allUserOperator: any;
  opragents: any;
  assocBusRecord: any;
  buses: any;
  allagent: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private oprassignagentsService: OprassignagentsService,
    private fb: FormBuilder,
    private AssociationService: AssociationService,
    private busOperatorService: BusOperatorService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Assign Agent";
    this.ModalBtn = "Save";
  }


  ngOnInit(): void {
    this.loadServices();
    this.spinner.show();
    this.form = this.fb.group({
      id:[null],
      user_id: [null, Validators.compose([Validators.required])],
      agent_id: [null, Validators.compose([Validators.required])],
    });

    this.formConfirm = this.fb.group({
      id: [null]
    });
    this.searchForm = this.fb.group({
      user_id: [null],
      assoc_id:[null],
      rows_number: Constants.RecordLimit,
    });
    this.search();  
  }

  page(label: any) {
    return label;
  }


  search(pageurl = "") {

    this.spinner.show();
    const data = {
      user_id: this.searchForm.value.user_id,
      assoc_id: this.searchForm.value.assoc_id,
      rows_number: this.searchForm.value.rows_number,
    };

    if (pageurl != "") {
      this.oprassignagentsService.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.opragents = res.data.data;
          this.pagination = res.data;
          this.spinner.hide();
        }
      );
    }
    else {
      this.oprassignagentsService.getAllData(data).subscribe(
        res => {
          this.opragents = res.data.data;
          this.pagination = res.data;
          this.spinner.hide();
          // console.log(this.opragents);
        }
      );
    }
  }


  refresh() 
  {
      this.spinner.show();
      this.searchForm = this.fb.group({
        user_id: [null],
        assoc_id:[null],
        rows_number: Constants.RecordLimit,
      });
      this.search();
  }


  loadServices() {
    this.busOperatorService.readuseroperator().subscribe(
      res => {
        this.allUserOperator = res.data;
        this.allUserOperator.map((i: any) => { i.operatorData = i.bus_operator.organisation_name + '    (  ' + i.bus_operator.operator_name  + '  )'; return i; });
      }
    );

    this.busOperatorService.getAllAgent().subscribe(
      res => {
        // console.log(res.data);
        this.allagent = res.data;
        this.allagent.map((i: any) => { i.agentData = i.name + '   -(  ' + i.location  + '  )'; return i; });
      }
    );
  }

  // check_agent()
  // {
  //   this.buses=[];
  //   const data = {
  //     assoc_id: this.form.value.assocName
  //   };
  //   this.oprassignagentsService.getbuslist(data).subscribe(
  //     res => {
  //       this.buses = res;
  //       this.buses.map((i:any) => { i.testing = i.name + ' - ' + i.bus_number +'('+i.from_location[0].name +'>>'+i.to_location[0].name+')'+'['+i.bus_operator.organisation_name+']' ; return i; });
  //     }
  //   );

  // }

  
  onSelectAll() {
    const selected = this.allagent.map(item => item.id);
    this.form.get('agent_id').patchValue(selected);
  }
  onClearAll() {
    this.form.get('agent_id').patchValue([]);
  }

  OpenModal(content) {
      this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }
  get confirm_password() {
    return this.pwdform.controls['conf_password'];
  }
  
  ResetAttributes() {
    this.buses=[];
    this.userRecord = {} as User;
    this.form = this.fb.group({
      id:[null],
      user_id: [null, Validators.compose([Validators.required])],
      agent_id: [null, Validators.compose([Validators.required])],
    });

    this.form.reset();
    this.ModalHeading = "Assign Agent ";
    this.ModalBtn = "Save";
  }

  addData() {

    this.spinner.show();

    const data = {
      user_id: this.form.value.user_id,
      agent_id: this.form.value.agent_id,
      created_by: localStorage.getItem('USERNAME'),
    };

    this.oprassignagentsService.create(data).subscribe(
          resp => {
            if (resp.status == 1) {
                      this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
                      this.modalReference.close();
                      this.ResetAttributes();
                      this.refresh();
          
                    }
          });

  }

  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.assocBusRecord = this.opragents[id];
  }

  deleteRecord() {
    let delitem = this.assocBusRecord.id;
    const data = {
      id: this.assocBusRecord.id,created_by: localStorage.getItem('USERNAME'),
    };

    this.oprassignagentsService.delete(data).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.confirmDialogReference.close();
          this.ResetAttributes();
          this.search();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      });
  }

}
