import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Pagecontent } from '../../model/pagecontent';
import { Constants } from '../../constant/constant';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { PagecontentService } from '../../services/pagecontent.service';
import { BusOperatorService } from './../../services/bus-operator.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-pagecontent',
  templateUrl: './pagecontent.component.html',
  styleUrls: ['./pagecontent.component.scss']
})
export class PagecontentComponent implements OnInit {
  public form: FormGroup;

  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  pagination: any;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading: any;
  public ModalBtn: any;

  pagecontent: Pagecontent[];
  pagecontentRecord: Pagecontent;
  busoperators: any;
  all: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private pc: PagecontentService,
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
      bus_operator_id: [null, Validators.compose([Validators.required])],
      page_name: [null, Validators.compose([Validators.required])],
      page_url: [null, Validators.compose([Validators.required])],
      page_description: [null, Validators.compose([Validators.required])],
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
      name: [null],
      bus_operator_id: [null],
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
      bus_operator_id: this.searchForm.value.bus_operator_id,
      rows_number: this.searchForm.value.rows_number,
    };

    // console.log(data);
    if (pageurl != "") {
      this.pc.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.pagecontent = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
        }
      );
    }
    else {
      this.pc.getAllData(data).subscribe(
        res => {
          this.pagecontent = res.data.data.data;
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
    let pagecontent = this.form.controls.page_name.value;
    pagecontent = this.toSeoUrl(pagecontent);
    this.form.controls.page_url.setValue(pagecontent);
  }
  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }
  ResetAttributes() {
    this.pagecontentRecord = {} as Pagecontent;
    this.form = this.fb.group({
      id: [null],
      bus_operator_id: [null],
      page_name: [null],
      page_url: [null],
      page_description: [null],
      meta_title: [null],
      meta_keyword: [null],
      meta_description: [null],
      extra_meta: [null],
      canonical_url: [null]

    });
    this.form.reset();
    this.ModalHeading = "Add Page";
    this.ModalBtn = "Save";
  }

  getAll() {
    this.pc.readAll().subscribe(
      res => {
        this.pagecontent = res.data;
        // console.log(res.data);
      }
    );
  }


  addData() {
    this.spinner.show();

    const data = {
      bus_operator_id: this.form.value.bus_operator_id,
      page_name: this.form.value.page_name,
      page_url: this.form.value.page_url,
      page_description: this.form.value.page_description,
      meta_title: this.form.value.meta_title,
      meta_keyword: this.form.value.meta_keyword,
      meta_description: this.form.value.meta_description,
      extra_meta: this.form.value.extra_meta,
      canonical_url: this.form.value.canonical_url,
      created_by: localStorage.getItem('USERNAME')
    };
    let id = this.pagecontentRecord?.id;
    if (id != null) {
      this.pc.update(id, data).subscribe(
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
      this.pc.create(data).subscribe(
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
    this.pagecontentRecord = this.pagecontent[id];

    // console.log(this.pagecontentRecord);
    this.form.controls.id.setValue(this.pagecontentRecord.id);
    this.form.controls.bus_operator_id.setValue(this.pagecontentRecord.bus_operator_id);
    this.form.controls.page_name.setValue(this.pagecontentRecord.page_name);
    this.form.controls.page_url.setValue(this.pagecontentRecord.page_url);
    this.form.controls.page_description.setValue(this.pagecontentRecord.page_description);
    this.form.controls.meta_title.setValue(this.pagecontentRecord.meta_title);
    this.form.controls.meta_keyword.setValue(this.pagecontentRecord.meta_keyword);
    this.form.controls.meta_description.setValue(this.pagecontentRecord.meta_description);
    this.form.controls.extra_meta.setValue(this.pagecontentRecord.extra_meta);
    this.form.controls.canonical_url.setValue(this.pagecontentRecord.canonical_url);

    this.ModalHeading = "Edit Page";
    this.ModalBtn = "Update";


  }

  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.pagecontentRecord = this.pagecontent[id];
  }

  deleteRecord() {


    let delitem = this.pagecontentRecord.id;
    this.pc.delete(delitem).subscribe(
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
