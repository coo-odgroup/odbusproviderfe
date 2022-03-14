import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SocialMedia } from '../../model/socialmedia';
import { UserService } from '../../services/user.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BusOperatorService } from './../../services/bus-operator.service';
import { SocialmediaService } from '../../services/socialmedia.service';
import { Constants } from '../../constant/constant';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.scss']
})
export class SocialmediaComponent implements OnInit {
  
  public socialFrom: FormGroup;

  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  pagination: any;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading: any;
  public ModalBtn: any;
  users:any=[];
  social: SocialMedia[];
  socialRecord: SocialMedia;
  busoperators: any;
  all: any;
  role_id: any;
  usre_name:any ;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder, private busOperatorService: BusOperatorService,
    private ss: SocialmediaService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private userService: UserService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Location";
    this.ModalBtn = "Save";
  }

  

  ngOnInit(): void {
    this.spinner.show();
    this.role_id= localStorage.getItem('ROLE_ID');
    this.usre_name= localStorage.getItem('USERNAME');
    this.socialFrom = this.fb.group({
      id: [null],
      user_id: [null, Validators.compose([Validators.required])],
      facebook_link: [null],
      twitter_link: [null],
      instagram_link: [null],
      googleplus_link: [null],
      linkedin_link: [null],

    });
    this.formConfirm = this.fb.group({
      id: [null]
    });
    this.searchForm = this.fb.group({
      user_id: [null],
      rows_number: Constants.RecordLimit,
    });

    this.search();
    // this.getAll();
    this.loadServices();
  }


  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'lg' });
  }
  ResetAttributes() {
    this.socialRecord = {} as SocialMedia;
    this.socialFrom = this.fb.group({
      id: [null],
      user_id: [null, Validators.compose([Validators.required])],
      facebook_link: [null],
      twitter_link: [null],
      instagram_link: [null],
      googleplus_link: [null],
      linkedin_link: [null],
    });
    this.ModalHeading = "Add URL";
    this.ModalBtn = "Save";
  }



  page(label: any) {
    return label;
  }


  search(pageurl = "") {
    this.spinner.show();
    const data = {
      name: this.searchForm.value.name,
      role_id: localStorage.getItem('ROLE_ID'),
      user_id: localStorage.getItem('USERID'),
      rows_number: this.searchForm.value.rows_number
    };

    // console.log(data);
    if (pageurl != "") {
      this.ss.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.social = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
        }
      );
    }
    else {
      this.ss.getAllData(data).subscribe(
        res => {
          this.social = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
        }
      );
    }
  }


  refresh() {
    this.spinner.show();
    this.searchForm = this.fb.group({
      user_id: [null],
      rows_number: Constants.RecordLimit,
    });
    this.search();

  }

  title = 'angular-app';
  fileName = 'Seo-Setting.xlsx';

  exportexcel(): void {

    /* pass here the table id */
    let element = document.getElementById('print-section');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }


  loadServices() {

    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });
      }
    );

      ////// get all user list

      this.userService.getAllUser().subscribe(
        record=>{
        this.users=record.data;
        this.users.map((i: any) => { i.userData = i.name + '    (  ' + i.email  + '  )'; return i; });
        }
      );

  }


  addData() {
    this.spinner.show();
    if(this.role_id!=1){
      this.socialFrom.controls.user_id.setValue(localStorage.getItem('USERID'));
    }

    const data = {
      user_id: this.socialFrom.value.user_id,
      facebook_link:this.socialFrom.value.facebook_link,
      twitter_link: this.socialFrom.value.twitter_link,
      instagram_link: this.socialFrom.value.instagram_link,
      googleplus_link: this.socialFrom.value.googleplus_link,
      linkedin_link: this.socialFrom.value.linkedin_link,
      created_by: localStorage.getItem('USERNAME')
    };

    let id = this.socialRecord?.id;
    if (id != null) {
      this.ss.update(id, data).subscribe(
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
      this.ss.create(data).subscribe(
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
    this.socialRecord = this.social[id];

    // console.log(this.urlcontentRecord);
    this.socialFrom.controls.id.setValue(this.socialRecord.id);
    this.socialFrom.controls.user_id.setValue(this.socialRecord.user_id);
    this.socialFrom.controls.facebook_link.setValue(this.socialRecord.facebook_link);
    this.socialFrom.controls.twitter_link.setValue(this.socialRecord.twitter_link);
    this.socialFrom.controls.instagram_link.setValue(this.socialRecord.instagram_link);
    this.socialFrom.controls.googleplus_link.setValue(this.socialRecord.googleplus_link);
    this.socialFrom.controls.linkedin_link.setValue(this.socialRecord.linkedin_link);


    this.ModalHeading = "Edit URL";
    this.ModalBtn = "Update";


  }

  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.socialRecord = this.social[id];
  }

  deleteRecord() {

    let delitem = this.socialRecord.id;
    this.ss.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.confirmDialogReference.close();
          this.ResetAttributes();
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      });
  }


  changeStatus(event: Event, stsitem: any) {
    this.spinner.show();
    this.ss.chngsts(stsitem).subscribe(
      resp => {

        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      }
    );
  }






  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '250px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    // upload: (file: File) => { ... }
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

}
