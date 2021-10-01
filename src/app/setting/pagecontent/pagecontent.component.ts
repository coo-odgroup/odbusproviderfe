import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Pagecontent } from '../../model/pagecontent';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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

      // name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      // synonym: [null, Validators.compose([Validators.maxLength(15)])]
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    
  }


  OpenModal(content) 
  {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ResetAttributes()
  { 
    this.form.reset();
    this.ModalHeading = "Add Page";
    this.ModalBtn = "Save";
  }

  addData()
  {
    console.log(this.form.value);
  }

  editData()
  {
    

    this.ModalHeading = "Edit Location";
    this.ModalBtn = "Update";
  

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
