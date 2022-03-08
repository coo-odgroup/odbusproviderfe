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
      id: [null],
      name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      location:['', Validators.compose([Validators.required])],
      president_name:[null],
      president_phone:[null],
      general_secretary_name:[null],
      general_secretary_phone:[null],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.required, Validators.maxLength(10)])]
    });

    this.editform = this.fb.group({
      id: [null],
      name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      location:['', Validators.compose([Validators.required])],
      president_name:[null],
      president_phone:[null],
      general_secretary_name:[null],
      general_secretary_phone:[null],
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
        // this.busoperators = res.data;
        this.allAssoc = res.data;
        // console.log(res.data);
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
      name: [null],
      email: [null],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      location:['', Validators.compose([Validators.required])],
      president_name:[null],
      president_phone:[null],
      general_secretary_name:[null],
      general_secretary_phone:[null],
      password: [null]
    });

    this.editform = this.fb.group({
      id: [null],
      name: [null],
      email: [null],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      location:['', Validators.compose([Validators.required])],
      president_name:[''],
      president_phone:[''],
      general_secretary_name:[''],
      general_secretary_phone:[''],
    });

    this.pwdform = this.fb.group({
      id: [null],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.required, Validators.maxLength(10)])],
      conf_password: [null, Validators.compose([Validators.required])]
    },
      { validator: this.checkPasswords });

    this.form.reset();
    this.ModalHeading = "Assign Bus For Association";
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
      name: this.form.value.name,
      email: this.form.value.email,
      phone: this.form.value.phone,
      password: this.form.value.password,
      location: this.form.value.location,
      president_name:this.form.value.president_name,
      president_phone:this.form.value.president_phone,
      general_secretary_name:this.form.value.general_secretary_name,
      general_secretary_phone:this.form.value.general_secretary_phone
    };


    const updateDate = {
      name: this.editform.value.name,
      email: this.editform.value.email,
      phone: this.editform.value.phone,
      location: this.editform.value.location,
      president_name:this.editform.value.president_name,
      president_phone:this.editform.value.president_phone,
      general_secretary_name:this.editform.value.general_secretary_name,
      general_secretary_phone:this.editform.value.general_secretary_phone
    }


    // console.log(this.editform);
    // return false;
    let id = this.userRecord?.id;
    if (id != null) {
      this.AssociationService.update(id, updateDate).subscribe(
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
    this.editform.controls.email.setValue(this.userRecord.email);
    this.editform.controls.phone.setValue(this.userRecord.phone);
    this.editform.controls.location.setValue(this.userRecord.location);
    this.editform.controls.president_name.setValue(this.userRecord.president_name);
    this.editform.controls.president_phone.setValue(this.userRecord.president_phone);
    this.editform.controls.general_secretary_name.setValue(this.userRecord.general_secretary_name);
    this.editform.controls.general_secretary_phone.setValue(this.userRecord.general_secretary_phone);



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
