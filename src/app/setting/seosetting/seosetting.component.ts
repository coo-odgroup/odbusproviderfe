import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Urlcontent } from '../../model/urlcontent';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BusOperatorService } from './../../services/bus-operator.service';
import { SeosettingService } from '../../services/seosetting.service';
import { Constants } from '../../constant/constant';
import { LocationService } from '../../services/location.service';
import { Location } from '../../model/location';
import * as XLSX from 'xlsx';

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

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading: any;
  public ModalBtn: any;

  urlcontent: Urlcontent[];
  urlcontentRecord: Urlcontent;
  busoperators: any;
  locations: any;

  constructor(
    
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder, private busOperatorService: BusOperatorService,
    private locationService:LocationService,
    private ss: SeosettingService,
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
      seo_type: [null],     
      source_id: [null],
      destination_id: [null],
      page_url: [null, Validators.compose([Validators.required])],
      bus_operator_id: [null, Validators.compose([Validators.required])],
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
      bus_operator_id: [null],
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
      url_description: [null],
      bus_operator_id: [null],
      page_url: [null],
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
    const data = {
      name: this.searchForm.value.name,
      bus_operator_id: this.searchForm.value.bus_operator_id,
      rows_number: this.searchForm.value.rows_number,
    };

    // console.log(data);
    if (pageurl != "") {
      this.ss.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.urlcontent = res.data.data.data;
          this.pagination = res.data.data;
          // console.log( this.BusOperators);
        }
      );
    }
    else {
      this.ss.getAllData(data).subscribe(
        res => {
          this.urlcontent = res.data.data.data;
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
      }
    );

    this.locationService.readAll().subscribe(
      records=>{
        this.locations=records.data;
      }
    );
  }

  addData() {
    const data = {
      page_url: this.form.value.page_url,
      bus_operator_id:this.form.value.bus_operator_id,
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
      bus_operator_id: [this.urlcontentRecord.bus_operator_id],
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

    // this.form.controls.id.setValue(this.urlcontentRecord.id);
    // this.form.controls.bus_operator_id.setValue(this.urlcontentRecord.bus_operator_id);
    // this.form.controls.page_url.setValue(this.urlcontentRecord.page_url);
    // this.form.controls.seo_type.setValue(this.urlcontentRecord.seo_type);
    // this.form.controls.source_id.setValue(this.urlcontentRecord.source_id);
    // this.form.controls.destination_id.setValue(this.urlcontentRecord.destination_id);
    // this.form.controls.url_description.setValue(this.urlcontentRecord.url_description);
    // this.form.controls.meta_title.setValue(this.urlcontentRecord.meta_title);
    // this.form.controls.meta_keyword.setValue(this.urlcontentRecord.meta_keyword);
    // this.form.controls.meta_description.setValue(this.urlcontentRecord.meta_description);
    // this.form.controls.extra_meta.setValue(this.urlcontentRecord.extra_meta);
    // this.form.controls.canonical_url.setValue(this.urlcontentRecord.canonical_url);

    this.ModalHeading = "Edit URL";
    this.ModalBtn = "Update";

    console.log(this.form.controls.seo_type.value);


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
        }
      });
  }


  changeStatus(event: Event, stsitem: any) {
    this.ss.chngsts(stsitem).subscribe(
      resp => {

        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
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
