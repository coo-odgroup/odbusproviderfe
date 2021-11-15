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
  public pwdform:FormGroup;

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
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private us: UserService,
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
    this.form = this.fb.group({
      id: [null],
      name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phone: [null, Validators.compose([Validators.required])],
      password: [null,Validators.compose([Validators.required,Validators.minLength(6),Validators.required,Validators.maxLength(10)])]
    });

    this.editform = this.fb.group({
      id: [null],
      name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phone: [null, Validators.compose([Validators.required])],
    });

    this.pwdform = this.fb.group({
      id: [null],
      password: [null, Validators.compose([Validators.required,Validators.minLength(6),Validators.required,Validators.maxLength(10)])],
      conf_password: [null, Validators.compose([Validators.required])]      
    }, 
    {validator: this.checkPasswords});


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
    const data = {
      name: this.searchForm.value.name,
      bus_operator_id: this.searchForm.value.bus_operator_id,
      rows_number: this.searchForm.value.rows_number,
    };

    // console.log(data);
    if (pageurl != "") {
      this.us.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.user = res.data.data.data;
          this.pagination = res.data.data;
          // console.log( this.BusOperators);
        }
      );
    }
    else {
      this.us.getAllData(data).subscribe(
        res => {
          this.user = res.data.data.data;
          this.pagination = res.data.data;
          // console.log( res.data);
        }
      );
    }
  }


  refresh() {
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
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'lg' });
  }
  ResetAttributes() {
    this.userRecord = {} as User;
    this.form = this.fb.group({
      id: [null],
      bus_operator_id: [null],
      name: [null],
      email: [null],
      phone: [null],
      password: [null]
    });

    this.editform = this.fb.group({
      id: [null],
      bus_operator_id: [null],
      name: [null],
      email: [null],
      phone: [null],
    });
    this.pwdform = this.fb.group({
      id: [null],
      password: [null],
      conf_password: [null]
    });

    this.form.reset();
    this.ModalHeading = "Add User";
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

    const data = {
      bus_operator_id: this.form.value.bus_operator_id,
      name: this.form.value.name,
      email: this.form.value.email,
      phone: this.form.value.phone,
      password: this.form.value.password
    };
    const updateDate={
      bus_operator_id: this.editform.value.bus_operator_id,
      name: this.editform.value.name,
      email: this.editform.value.email,
      phone: this.editform.value.phone,
    }


    // console.log(data);
    let id = this.userRecord?.id;
    if (id != null) {
      this.us.update(id, updateDate).subscribe(
        resp => {
          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.refresh();

          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          }
        }
      );
    }
    else {
      this.us.create(data).subscribe(
        resp => {

          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.refresh();


          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          }
        }
      );

    }

  }


  editData(id) {
    this.userRecord = this.user[id];
  
    this.editform.controls.id.setValue(this.userRecord.id);
    this.editform.controls.bus_operator_id.setValue(this.userRecord.bus_operator_id);
    this.editform.controls.name.setValue(this.userRecord.name);
    this.editform.controls.email.setValue(this.userRecord.email);
    this.editform.controls.phone.setValue(this.userRecord.phone);
   

    this.ModalHeading = "Edit User";
    this.ModalBtn = "Update";
  }

  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.userRecord = this.user[id];
  }

  deleteRecord() {
    let delitem = this.userRecord.id;
    this.us.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.confirmDialogReference.close();
          this.ResetAttributes();
          this.search();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
        }
      });
  }
  

  changePassword(id) {
    this.userRecord = this.user[id];   
   
    this.ModalHeading = "Edit Password";
    this.ModalBtn = "Update Password";
  }
  updatePassword()
  {  
    let id = this.userRecord?.id;  
    const updateDate={
      password: this.pwdform.value.password
    }

    this.us.changepwd(id, updateDate).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.modalReference.close();
          this.ResetAttributes();
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
        }
      }
    );


  }

  changeStatus(event : Event, stsitem:any)
  {
    this.us.changestatus(stsitem).subscribe(
      resp => {
        
        if(resp.status==1)
        {
            this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
            this.ResetAttributes();
            this.refresh(); 
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
      }
    );
  }

  


}
