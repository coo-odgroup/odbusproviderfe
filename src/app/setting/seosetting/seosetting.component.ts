import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { urlcontent } from '../../model/urlcontent';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {SeosettingService } from '../../services/seosetting.service';

@Component({
  selector: 'app-seosetting',
  templateUrl: './seosetting.component.html',
  styleUrls: ['./seosetting.component.scss']
})
export class SeosettingComponent implements OnInit {

  public form: FormGroup;

  public formConfirm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading:any;
  public ModalBtn:any;

  urlcontent: urlcontent[];
  urlcontentRecord: urlcontent;

  constructor(
    private http: HttpClient, 
    private notificationService: NotificationService, 
    private fb: FormBuilder,
    private ss: SeosettingService,
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
      page_url: [null, Validators.compose([Validators.required])],
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
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'lg' });
  }
  ResetAttributes()
  { 
    this.urlcontentRecord = {} as urlcontent;
    this.form = this.fb.group({
      id:[null],
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

  getAll()
  {
    this.ss.readAll().subscribe(
      res=>{
        this.urlcontent = res.data;
      }
    );
  }
 

  addData() {
    const data = {
      page_url:this.form.value.page_url,
      meta_title: this.form.value.meta_title,
      meta_keyword: this.form.value.meta_keyword,
      meta_description: this.form.value.meta_description,
      extra_meta: this.form.value.extra_meta,
      canonical_url: this.form.value.canonical_url
    };
    // console.log(data);
    let id = this.urlcontentRecord?.id;
    if (id != null) {
      this.ss.update(id, data).subscribe(
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
      this.ss.create(data).subscribe(
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
    this.urlcontentRecord = this.urlcontent[id];
    
    // console.log(this.urlcontentRecord);
    this.form.controls.id.setValue(this.urlcontentRecord.id);
    this.form.controls.page_url.setValue(this.urlcontentRecord.page_url);
    this.form.controls.meta_title.setValue(this.urlcontentRecord.meta_title);
    this.form.controls.meta_keyword.setValue(this.urlcontentRecord.meta_keyword);
    this.form.controls.meta_description.setValue(this.urlcontentRecord.meta_description);
    this.form.controls.extra_meta.setValue(this.urlcontentRecord.extra_meta);
    this.form.controls.canonical_url.setValue(this.urlcontentRecord.canonical_url);

    this.ModalHeading = "Edit URL";
    this.ModalBtn = "Update";
  

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
          this.getAll();         
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
        }
      });
  }
 



}
