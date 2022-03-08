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
import { constant } from 'lodash';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-assignoperator',
  templateUrl: './assignoperator.component.html',
  styleUrls: ['./assignoperator.component.scss']
})
export class AssignoperatorComponent implements OnInit {
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
  assocOperater: any;
  assocOperaterRecord: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private assocBusOprService: AssocassignbuoperatorService,
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
      busoperator: [null, Validators.compose([Validators.required])],
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
      this.assocBusOprService.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.assocOperater = res.data.data;
          this.pagination = res.data;
          // console.log( this.BusOperators);
          this.spinner.hide();
        }
      );
    }
    else {
      this.assocBusOprService.getAllData(data).subscribe(
        res => {
          this.assocOperater = res.data.data;
          this.pagination = res.data;
          // console.log( this.assocOperater);
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

    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });
      }
    );
  }

  
  onSelectAll() {
    const selected = this.busoperators.map(item => item.id);
    this.form.get('busoperator').patchValue(selected);
  }
  onClearAll() {
    this.form.get('busoperator').patchValue([]);
  }



  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }
  get confirm_password() {
    return this.pwdform.controls['conf_password'];
  }
  ResetAttributes() {
    this.userRecord = {} as User;
    this.form = this.fb.group({
      id:[null],
      assocName: [null, Validators.compose([Validators.required])],
      busoperator: [null, Validators.compose([Validators.required])],
    });

    this.form.reset();
    this.ModalHeading = "Add Bus Operator ";
    this.ModalBtn = "Save";
  }

  addData() {

    this.spinner.show();

    const data = {
      user_id: this.form.value.assocName,
      operator_id: this.form.value.busoperator,
      created_by: localStorage.getItem('USERNAME'),
    };

    this.assocBusOprService.create(data).subscribe(
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
    this.assocOperaterRecord = this.assocOperater[id];
  }

  deleteRecord() {
    let delitem = this.assocOperaterRecord.id;
    const data = {
      id: this.assocOperaterRecord.id
    };
    this.assocBusOprService.delete(data).subscribe(
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
