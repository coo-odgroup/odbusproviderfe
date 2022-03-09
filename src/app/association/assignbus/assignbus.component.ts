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
import { AssocassignbuoperatorService } from './../../services/assocassignbuoperator.service';
import {AssocassignbusService} from './../../services/assocassignbus.service';
import { constant } from 'lodash';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-assignbus',
  templateUrl: './assignbus.component.html',
  styleUrls: ['./assignbus.component.scss']
})
export class AssignbusComponent implements OnInit {

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
  allAssoc: any;
  assocBus: any;
  assocBusRecord: any;
  buses: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private assocBusService: AssocassignbusService,
    private fb: FormBuilder,
    private AssociationService: AssociationService,
    private busOperatorService: BusOperatorService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Association";
    this.ModalBtn = "Save";
  }


  ngOnInit(): void {
    this.loadServices();
    this.spinner.show();
    this.form = this.fb.group({
      id:[null],
      assocName: [null, Validators.compose([Validators.required])],
      bus_id: [null, Validators.compose([Validators.required])],
    });

    this.formConfirm = this.fb.group({
      id: [null]
    });
    this.searchForm = this.fb.group({
      name: [null],
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
      name: this.searchForm.value.name,
      assoc_id: this.searchForm.value.assoc_id,
      rows_number: this.searchForm.value.rows_number,
    };

    // console.log(data);
    if (pageurl != "") {
      this.assocBusService.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.assocBus = res.data.data;
          this.pagination = res.data;
          // console.log( this.BusOperators);
          this.spinner.hide();
        }
      );
    }
    else {
      this.assocBusService.getAllData(data).subscribe(
        res => {
          this.assocBus = res.data.data;
          this.pagination = res.data;
          // console.log( this.assocBus);
          this.spinner.hide();
        }
      );
    }
  }


  refresh() {

    this.spinner.show();
    this.searchForm = this.fb.group({
      name: [null],
      assoc_id:[null],
      rows_number: Constants.RecordLimit,
    });
    this.search();
  }


  loadServices() {
    this.busOperatorService.readassoc().subscribe(
      res => {
        this.allAssoc = res.data;
      }
    );

    // this.busOperatorService.readAll().subscribe(
    //   res => {
    //     this.busoperators = res.data;
    //     this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });
    //   }
    // );
  }

  check_bus()
  {
    this.buses=[];
    const data = {
      assoc_id: this.form.value.assocName
    };
    this.assocBusService.getbuslist(data).subscribe(
      res => {
        this.buses = res;
        this.buses.map((i:any) => { i.testing = i.name + ' - ' + i.bus_number +'('+i.from_location[0].name +'>>'+i.to_location[0].name+')'+'['+i.bus_operator.organisation_name+']' ; return i; });
      }
    );

  }

  
  onSelectAll() {
    const selected = this.buses.map(item => item.id);
    this.form.get('bus_id').patchValue(selected);
  }
  onClearAll() {
    this.form.get('bus_id').patchValue([]);
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
      assocName: [null, Validators.compose([Validators.required])],
      bus_id: [null, Validators.compose([Validators.required])],
    });

    this.form.reset();
    this.ModalHeading = "Assign Bus ";
    this.ModalBtn = "Save";
  }

  addData() {

    this.spinner.show();

    const data = {
      user_id: this.form.value.assocName,
      bus_id: this.form.value.bus_id,
      created_by: localStorage.getItem('USERNAME'),
    };

    this.assocBusService.create(data).subscribe(
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
    this.assocBusRecord = this.assocBus[id];
  }

  deleteRecord() {
    let delitem = this.assocBusRecord.id;
    const data = {
      id: this.assocBusRecord.id
    };
    // console.log(data);
    // return;
    this.assocBusService.delete(data).subscribe(
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
