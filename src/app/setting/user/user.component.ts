import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../model/user';
import { Constants } from '../../constant/constant';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UserService } from '../../services/user.service';
import { BusOperatorService } from './../../services/bus-operator.service';
import { constant } from 'lodash';

import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

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

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private userService: UserService,
    private busOperatorService: BusOperatorService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Location";
    this.ModalBtn = "Save";
  }


  ngOnInit(): void {

    this.spinner.show();
    this.form = this.fb.group({
      id: [null],
      name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.required, Validators.maxLength(10)])]
    });

    this.editform = this.fb.group({
      id: [null],
      name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
    });

    this.pwdform = this.fb.group({
      id: [null],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.required, Validators.maxLength(10)])],
      conf_password: [null, Validators.compose([Validators.required])]
    },
      { validator: this.checkPasswords });


    this.formConfirm = this.fb.group({
      id: [null]
    });
    this.searchForm = this.fb.group({
      name: [null],
      bus_operator_id: [null],
      rows_number: Constants.RecordLimit,
    });
    this.search();

    // this.getAll();

    this.loadServices();
  }



  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('password').value;
    const confirmPassword = group.get('conf_password').value;

    return password === confirmPassword ? null : { notSame: true }
  }





  page(label: any) {
    return label;
  }


  search(pageurl = "") {

    this.spinner.show();
    const data = {
      name: this.searchForm.value.name,
      bus_operator_id: this.searchForm.value.bus_operator_id,
      rows_number: this.searchForm.value.rows_number,
    };

    // console.log(data);
    if (pageurl != "") {
      this.userService.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.user = res.data.data.data;
          this.pagination = res.data.data;
          // console.log( this.BusOperators);
          this.spinner.hide();
        }
      );
    }
    else {
      this.userService.getAllData(data).subscribe(
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
      bus_operator_id: [null],
      rows_number: Constants.RecordLimit,
    });
    this.search();
  }


  loadServices() {
    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
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
      id: [null],
      bus_operator_id: [null],
      name: [null],
      email: [null],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      password: [null]
    });

    this.editform = this.fb.group({
      id: [null],
      bus_operator_id: [null],
      name: [null],
      email: [null],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
    });

    this.pwdform = this.fb.group({
      id: [null],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.required, Validators.maxLength(10)])],
      conf_password: [null, Validators.compose([Validators.required])]
    },
      { validator: this.checkPasswords });

    this.form.reset();
    this.ModalHeading = "Add Operator";
    this.ModalBtn = "Save";
  }

  // getAll()
  // {
  //   this.pc.readAll().subscribe(
  //     res=>{
  //       this.url = res.data;
  //       // console.log(res.data);
  //     }
  //   );
  // }


  addData() {

    this.spinner.show();

    const data = {
      bus_operator_id: this.form.value.bus_operator_id,
      name: this.form.value.name,
      email: this.form.value.email,
      phone: this.form.value.phone,
      password: this.form.value.password
    };


    const updateDate = {
      name: this.editform.value.name,
      email: this.editform.value.email,
      phone: this.editform.value.phone,
    }


    // console.log(data);
    let id = this.userRecord?.id;
    if (id != null) {
      this.userService.update(id, updateDate).subscribe(
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
      this.userService.create(data).subscribe(
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
    this.editform.controls.email.setValue(this.userRecord.email);
    this.editform.controls.phone.setValue(this.userRecord.phone);


    this.ModalHeading = "Edit Operator";
    this.ModalBtn = "Update";
  }

  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.userRecord = this.user[id];
  }

  deleteRecord() {

    
    let delitem = this.userRecord.id;
    this.userService.delete(delitem).subscribe(
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

    this.spinner.show();
    this.userRecord = this.user[id];

    this.ModalHeading = "Edit Password";
    this.ModalBtn = "Update Password";
  }
  updatePassword() {
    let id = this.userRecord?.id;
    const updateDate = {
      password: this.pwdform.value.password
    }

    this.userService.changepwd(id, updateDate).subscribe(
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
    this.userService.changestatus(stsitem).subscribe(
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
