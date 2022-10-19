import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { Constants } from '../../constant/constant';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BusOperatorService } from './../../services/bus-operator.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FaqService } from '../../services/faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  public form: FormGroup;

  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  pagination: any;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading: any;
  public ModalBtn: any;
  users:any=[];
  role_id: any;
  usre_name:any ;

  faqcontent: any;
  faqcontentRecord:any;
  busoperators: any;
  all: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    // private pc: PagecontentService,
    private busOperatorService: BusOperatorService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private userService: UserService,
    private fs: FaqService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Location";
    this.ModalBtn = "Save";
  }





  ngOnInit(): void {
    // this.spinner.show();
    this.role_id= localStorage.getItem('ROLE_ID');
    this.usre_name= localStorage.getItem('USERNAME');
    this.form = this.fb.group({
      id: [null],      
      title: [null, Validators.compose([Validators.required])],
      content: [null, Validators.compose([Validators.required])]
    });

    this.formConfirm = this.fb.group({
      id: [null]
    });

    this.searchForm = this.fb.group({
      title: [null],
      rows_number: Constants.RecordLimit,
    });
    this.search();
  }

  page(label: any) {
    return label;
  }


  search(pageurl = "") {
    // this.spinner.show();

    const data = {
      title: this.searchForm.value.title,
      rows_number: this.searchForm.value.rows_number
    };

    // console.log(data);
    // return;
    if (pageurl != "") {
      this.fs.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.faqcontent = res.data.data.data;

          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
        }
      );
    }
    else {
      this.fs.getAllData(data).subscribe(
        res => {
          this.faqcontent = res.data.data.data;
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
      title: [null],
      rows_number: Constants.RecordLimit,
    });
    this.search();

  }


  // loadServices() {

  //   this.busOperatorService.readAll().subscribe(
  //     res => {
  //       this.busoperators = res.data;
  //       this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });
  //     }
  //   );


  //    ////// get all user list

  //    this.userService.getAllUser().subscribe(
  //     record=>{
  //     this.users=record.data;
  //     this.users.map((i: any) => { i.userData = i.name + '    (  ' + i.email  + '  )'; return i; });
  //     }
  //   );

  // }

  
  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }
  ResetAttributes() {
    // this.faqcontent = {} as faqcontent;
    this.form = this.fb.group({
      id: [null],      
      title: [null, Validators.compose([Validators.required])],
      content: [null, Validators.compose([Validators.required])]
    });
    this.form.reset();
    this.ModalHeading = "Add FAQ";
    this.ModalBtn = "Save";
  }

  addData() {
    this.spinner.show();
    if(this.role_id!=1){
      this.form.controls.user_id.setValue(localStorage.getItem('USERID'));
    }

    const data = {
      title: this.form.value.title,
      content: this.form.value.content,
      created_by: localStorage.getItem('USERNAME')
    };
    // console.log(data);
    // return;

    let id = this.faqcontentRecord?.id;
    if (id != null) {
      this.fs.update(id, data).subscribe(
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
      this.fs.create(data).subscribe(
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
    this.faqcontentRecord = this.faqcontent[id];

    // console.log(this.pagecontentRecord);
    this.form.controls.id.setValue(this.faqcontentRecord.id);
    this.form.controls.title.setValue(this.faqcontentRecord.title);
    this.form.controls.content.setValue(this.faqcontentRecord.content);

    this.ModalHeading = "Edit Page";
    this.ModalBtn = "Update";


  }

  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.faqcontentRecord = this.faqcontent[id];
  }

  deleteRecord() {
    let delitem = this.faqcontentRecord.id;
    this.fs.delete(delitem).subscribe(
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


  changeStatus(event : Event, stsitem:any)
  {
    this.spinner.show();
    this.fs.changestatus(stsitem).subscribe(
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
