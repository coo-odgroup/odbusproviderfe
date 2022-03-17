import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Urlcontent } from '../../model/urlcontent';
import { UserService } from '../../services/user.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BusOperatorService } from './../../services/bus-operator.service';
import { SeosettingService } from '../../services/seosetting.service';
import { Constants } from '../../constant/constant';
import { LocationService } from '../../services/location.service';
import { Location } from '../../model/location';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-seosetting',
  templateUrl: './seosetting.component.html',
  styleUrls: ['./seosetting.component.scss']
})
export class SeosettingComponent implements OnInit {

  public form: FormGroup;

  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  pagination: any;
  users:any=[];


  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading: any;
  public ModalBtn: any;

  urlcontent: Urlcontent[];
  urlcontentRecord: Urlcontent;
  busoperators: any;
  locations: any;
  all: any;
  role_id: any;
  usre_name:any ;


  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder, private busOperatorService: BusOperatorService,
    private locationService:LocationService,
    private ss: SeosettingService,
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

    this.form = this.fb.group({
      id: [null],
      seo_type: [null],     
      source_id: [null],
      destination_id: [null],
      page_url: [null, Validators.compose([Validators.required])],
      user_id: [null, Validators.compose([Validators.required])],
      url_description: [null],
      meta_title: [null],
      meta_keyword: [null],
      meta_description: [null],
      extra_meta: [null],
      canonical_url: [null]
    });
    this.formConfirm = this.fb.group({
      id: [null]
    });
    this.searchForm = this.fb.group({
      user_id: [null],
      name: [null],
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
    this.urlcontentRecord = {} as Urlcontent;
    this.form = this.fb.group({
      id: [null],
      seo_type: [null],     
      source_id: [null],
      destination_id: [null],
      page_url: [null, Validators.compose([Validators.required])],
      user_id: [null],
      url_description: [null],
      meta_title: [null],
      meta_keyword: [null],
      meta_description: [null],
      extra_meta: [null],
      canonical_url: [null]
    });
    this.form.reset();
    this.ModalHeading = "Add URL";
    this.ModalBtn = "Save";
  }

  // getAll()
  // {
  //   this.ss.readAll().subscribe(
  //     res=>{
  //       this.urlcontent = res.data;
  //       // console.log(res.data);
  //     }
  //   );
  // }

  page(label: any) {
    return label;
  }


  search(pageurl = "") {
    this.spinner.show();
    const data = {
      name: this.searchForm.value.name,
      user_id: this.searchForm.value.user_id,
      rows_number: this.searchForm.value.rows_number,
      role_id: localStorage.getItem('ROLE_ID'),
      userID: localStorage.getItem('USERID'),
    };

    // console.log(data);
    if (pageurl != "") {
      this.ss.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.urlcontent = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
        }
      );
    }
    else {
      this.ss.getAllData(data).subscribe(
        res => {
          this.urlcontent = res.data.data.data;
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
      name: [null],
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

    this.locationService.readAll().subscribe(
      records=>{
        this.locations=records.data;
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
      this.form.controls.user_id.setValue(localStorage.getItem('USERID'));
    }

    const data = {
      page_url: this.form.value.page_url,
      user_id:this.form.value.user_id,
      seo_type:this.form.value.seo_type,
      source_id:this.form.value.source_id,
      destination_id:this.form.value.destination_id,
      url_description: this.form.value.url_description,
      meta_title: this.form.value.meta_title,
      meta_keyword: this.form.value.meta_keyword,
      meta_description: this.form.value.meta_description,
      extra_meta: this.form.value.extra_meta,
      canonical_url: this.form.value.canonical_url,
      created_by: localStorage.getItem('USERNAME') 
    };

    let id = this.urlcontentRecord?.id;
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
    this.urlcontentRecord = this.urlcontent[id];
    // console.log(this.urlcontentRecord);
    // return
    this.form = this.fb.group({

      id:[this.urlcontentRecord.id],
      user_id: [this.urlcontentRecord.user_id],
      page_url: [this.urlcontentRecord.page_url],
      seo_type: [(this.urlcontentRecord.seo_type).toString()],
      source_id: [this.urlcontentRecord.source_id],
      destination_id: [this.urlcontentRecord.destination_id],
      url_description: [this.urlcontentRecord.url_description],
      meta_title: [this.urlcontentRecord.meta_title],
      meta_keyword: [this.urlcontentRecord.meta_keyword],
      meta_description: [this.urlcontentRecord.meta_description],
      extra_meta: [this.urlcontentRecord.extra_meta],
      canonical_url: [this.urlcontentRecord.canonical_url],
      
    });

    this.ModalHeading = "Edit URL";
    this.ModalBtn = "Update";

    //console.log(this.form.controls.seo_type.value);


  }


  toSeoUrl(url) {
    return url.toString()               // Convert to string
      .normalize('NFD')               // Change diacritics
      .replace(/[\u0300-\u036f]/g, '') // Remove illegal characters
      .replace(/\s+/g, '-')            // Change whitespace to dashes
      .toLowerCase()                  // Change to lowercase
      .replace(/&/g, '-and-')          // Replace ampersand
      .replace(/[^a-z0-9\-]/g, '')     // Remove anything that is not a letter, number or dash
      .replace(/-+/g, '-')             // Remove duplicate dashes
      .replace(/^-*/, '')              // Remove starting dashes
      .replace(/-*$/, '');             // Remove trailing dashes
  }
  
  generate_url() {
    let source_id = this.form.controls.source_id.value;
    let dest_id = this.form.controls.destination_id.value;
    if(source_id!=null && dest_id!=null){
      
      let source_name='';
      let dest_name='';
      
      this.locations.filter((itm) =>{
        if(source_id===itm.id){
          source_name=itm.name;
        }

        if(dest_id===itm.id){
          dest_name=itm.name;
        }

      });

      let source_url = this.toSeoUrl(source_name);
      let dest_url = this.toSeoUrl(dest_name);
      let full_url =source_url+'-'+dest_url+'-bus-services';
      this.form.controls.page_url.setValue(full_url);

    }
   
  }

  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.urlcontentRecord = this.urlcontent[id];
  }

  deleteRecord() {
   
    let delitem = this.urlcontentRecord.id;
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
