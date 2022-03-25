import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../model/user';
import { Constants } from '../../constant/constant';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { PermissiontoroleService } from '../../services/permissiontorole.service';
import { RoleService } from './../../services/role.service';
import { PermissionService } from './../../services/permission.service';
import { constant } from 'lodash';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-managepermissiontorole',
  templateUrl: './managepermissiontorole.component.html',
  styleUrls: ['./managepermissiontorole.component.scss']
})
export class ManagepermissiontoroleComponent implements OnInit 
{
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
    allroles: any;
    permissiontoroles: any;
    permissiontoroleRecord: any;
    buses: any;
    allpermission: any;
    AllMenu:any;    
    SubMenu:any;

    constructor(
      private spinner: NgxSpinnerService,
      private http: HttpClient,
      private notificationService: NotificationService,
      private roleService: RoleService,
      private fb: FormBuilder,
      private permissiontoroleService: PermissiontoroleService,
      private permissionService: PermissionService,
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
      role_id: [null, Validators.compose([Validators.required])],
      menu: [null, Validators.compose([Validators.required])],
      submenu: [null, Validators.compose([Validators.required])],
      add_status: [null],
      update_status: [null],
      view_status: [null],
      delete_status: [null],
    });

    this.formConfirm = this.fb.group({
      id: [null]
    });
    this.searchForm = this.fb.group({
      role_id:[null],
      menu: [null],
      submenu: [null],     
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
        role_id: this.searchForm.value.role_id,
        menu: this.searchForm.value.menu,
        submenu: this.searchForm.value.submenu,
        rows_number: this.searchForm.value.rows_number,
    };

    if (pageurl != "") {
      this.permissiontoroleService.getAllaginationData(pageurl, data).subscribe(
        res => {
            this.permissiontoroles = res.data.data;            
            this.pagination = res.data;
            this.spinner.hide();
        }
      );
    }
    else {
      this.permissiontoroleService.getAllData(data).subscribe(
        res => {
          this.permissiontoroles = res.data.data;
         // console.log(this.permissiontoroles);
          this.pagination = res.data;
          this.spinner.hide();
        }
      );
    }
  }


  refresh() 
  {
      this.spinner.show();
      this.searchForm = this.fb.group({
        menu: [null],
        submenu:[null],
        role_id:[null],

        rows_number: Constants.RecordLimit,
      });
      this.search();
  }


  loadServices() {

    this.permissiontoroleService.menuItems().subscribe(
        res => {
          this.AllMenu = res;
         // console.log(this.AllMenu);
        }
    );

    this.roleService.readAll().subscribe(
      res => {
        this.allroles = res.data;
      }
    );

    // this.permissionService.readAll().subscribe(
    //   res => {
    //     this.allpermission = res.data;
    //     //console.log(this.allpermission);
    //    // this.allpermission.map((i: any) => { i.agentData = i.name + '   -(  ' + i.location  + '  )'; return i; });
    //   }
    // );
  }

  check_submenu()
  {
      this.SubMenu = [];     
      let menu = this.form.value.menu;

      this.permissiontoroleService.subMenuItems(menu).subscribe(
        res => {
          this.SubMenu = res;
         // console.log(this.SubMenu);
        }
      );
  }

  
  onSelectAll() {
    const selected = this.AllMenu.map(item => item.id);
    this.form.get('submenu').patchValue(selected);
  }
  onClearAll() {
    this.form.get('submenu').patchValue([]);
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
      role_id: [null, Validators.compose([Validators.required])],
      menu: [null, Validators.compose([Validators.required])],
      submenu: [null, Validators.compose([Validators.required])],
      add_status: [null],
      update_status: [null],
      view_status: [null],
      delete_status: [null],
    });

    this.form.reset();
    this.ModalHeading = "Assign Role";
    this.ModalBtn = "Save";
  }

  addData() {

    this.spinner.show();

    const data = {     
      role_id: this.form.value.role_id,
      menu: this.form.value.menu,
      submenu: this.form.value.submenu,
      add_status: this.form.value.add_status,
      update_status: this.form.value.update_status,
      view_status: this.form.value.view_status,
      delete_status: this.form.value.delete_status,
      created_by: localStorage.getItem('USERNAME'),
    };

    console.log(data);

    this.permissiontoroleService.create(data).subscribe(
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
    this.permissiontoroleRecord = this.permissiontoroles[id];
  }

  deleteRecord() {
    let delitem = this.permissiontoroleRecord.id;
    const data = {
      id: this.permissiontoroleRecord.id,created_by: localStorage.getItem('USERNAME'),
    };

    this.permissiontoroleService.delete(delitem).subscribe(
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
