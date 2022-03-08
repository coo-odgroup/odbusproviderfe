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

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
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

    this.spinner.show();
    this.form = this.fb.group({
      assocName: [null, Validators.compose([Validators.required])],
     
    });

    this.formConfirm = this.fb.group({
      id: [null]
    });
    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
    });
    this.search();

    // this.getAll();

    this.loadServices();
  }

  page(label: any) {
    return label;
  }


  search(pageurl = "") {

    this.spinner.show();
    const data = {
      name: this.searchForm.value.name,
      rows_number: this.searchForm.value.rows_number,
    };

    // console.log(data);
    if (pageurl != "") {
      this.AssociationService.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.user = res.data.data.data;
          this.pagination = res.data.data;
          // console.log( this.BusOperators);
          this.spinner.hide();
        }
      );
    }
    else {
      this.AssociationService.getAllData(data).subscribe(
        res => {
          this.user = res.data.data.data;
          this.pagination = res.data.data;
          // console.log( res.data);
          this.spinner.hide();
        }
      );
    }
  }


  refresh() {

    this.spinner.show();
    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
    });
    this.search();
  }


  loadServices() {
    this.busOperatorService.readassoc().subscribe(
      res => {
        this.allAssoc = res.data;
        // console.log(this.allAssoc);
      }
    );
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
      assocName: [null],
    });

    this.form.reset();
    this.ModalHeading = "Add Association";
    this.ModalBtn = "Save";
  }

  addData() {

    this.spinner.show();

    const data = {
      name: this.form.value.name,
    };

    let id = this.userRecord?.id;
    if (id != null) {
      this.AssociationService.update(id, data).subscribe(
        resp => {
          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.refresh();

          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
            this.spinner.hide();
          }
        }
      );
    }
    else {
      this.AssociationService.create(data).subscribe(
        resp => {

          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.refresh();


          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
            this.spinner.hide();
          }
        }
      );

    }

  }


  editData(id) {

    this.userRecord = this.user[id];

    this.editform.controls.id.setValue(this.userRecord.id);
    this.editform.controls.name.setValue(this.userRecord.name);


    this.ModalHeading = "Edit Association";
    this.ModalBtn = "Update";
  }

  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.userRecord = this.user[id];
  }

  deleteRecord() {

    
    let delitem = this.userRecord.id;
    this.AssociationService.delete(delitem).subscribe(
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


  changePassword(id) {


    this.userRecord = this.user[id];

    this.ModalHeading = "Edit Password";
    this.ModalBtn = "Update Password";
  }
  updatePassword() {
    this.spinner.show();
    let id = this.userRecord?.id;
    const updateDate = {
      password: this.pwdform.value.password
    }

    this.AssociationService.changepwd(id, updateDate).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.modalReference.close();
          this.ResetAttributes();
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      }
    );


  }

  changeStatus(event: Event, stsitem: any) {

    this.spinner.show();
    this.AssociationService.changestatus(stsitem).subscribe(
      resp => {

        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.ResetAttributes();
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      }
    );
  }

}
