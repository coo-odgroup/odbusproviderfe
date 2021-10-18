import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Pagecontent } from '../../model/pagecontent';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {PagecontentService } from '../../services/pagecontent.service';
@Component({
  selector: 'app-pagecontent',
  templateUrl: './pagecontent.component.html',
  styleUrls: ['./pagecontent.component.scss']
})
export class PagecontentComponent implements OnInit {
  public form: FormGroup;

  public formConfirm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading:any;
  public ModalBtn:any;

  pagecontent: Pagecontent[];
  pagecontentRecord: Pagecontent;

  constructor(
    private http: HttpClient, 
    private notificationService: NotificationService, 
    private fb: FormBuilder,
    private pc: PagecontentService,
    private modalService: NgbModal,
    config: NgbModalConfig
    )
    { 
      config.backdrop = 'static';
      config.keyboard = false;
      this.ModalHeading = "Add New Location";
      this.ModalBtn = "Save"; 
    }


    
    

  ngOnInit(): void {
    this.form = this.fb.group({
      id:[null],
      page_name: [null, Validators.compose([Validators.required])],
      page_url: [null, Validators.compose([Validators.required])],
      page_description: [null, Validators.compose([Validators.required])],
      meta_title: [null],
      meta_keyword: [null],
      meta_description: [null],
      extra_meta: [null],
      canonical_url: [null]
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    this.getAll();
  }


  OpenModal(content) 
  {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ResetAttributes()
  { 
    this.pagecontentRecord = {} as Pagecontent;
    this.form = this.fb.group({
      id:[null],
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

  getAll()
  {
    this.pc.readAll().subscribe(
      res=>{
        this.pagecontent = res.data;
        // console.log(res.data);
      }
    );
  }
 

  addData() {

    const data = {
      page_name:this.form.value.page_name,
      page_url:this.form.value.page_url,
      page_description:this.form.value.page_description,
      meta_title: this.form.value.meta_title,
      meta_keyword: this.form.value.meta_keyword,
      meta_description: this.form.value.meta_description,
      extra_meta: this.form.value.extra_meta,
      canonical_url: this.form.value.canonical_url

    };
    let id = this.pagecontentRecord?.id;
    if (id != null) {
      this.pc.update(id, data).subscribe(
        resp => {
          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.getAll();

          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
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
            this.getAll();

           
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          }
        }
      );

    }

  }


  editData(id)
  {  
    this.pagecontentRecord = this.pagecontent[id];
    
    // console.log(this.pagecontentRecord);
    this.form.controls.id.setValue(this.pagecontentRecord.id);
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
          this.getAll();         
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
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
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
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
