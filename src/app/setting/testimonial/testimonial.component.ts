import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Testimonial } from '../../model/testimonial';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {TestimonialService } from '../../services/testimonial.service';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent implements OnInit {
  public form: FormGroup;
  public searchform: FormGroup;


  public formConfirm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading:any;
  public ModalBtn:any;

  testimonial: Testimonial[];
  testimonialRecord: Testimonial;

  constructor(
    private http: HttpClient, 
    private notificationService: NotificationService, 
    private fb: FormBuilder,
    private ts: TestimonialService,
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
      this.searchform =this.fb.group({
        searchvalue:[null]
      })
      this.form = this.fb.group({
        id:[null],
        posted_by: [null, Validators.compose([Validators.required])],
        testinmonial_content: [null, Validators.compose([Validators.required])],
        location: [null, Validators.compose([Validators.required])],
        designation: [null, Validators.compose([Validators.required])]
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
      this.form = this.fb.group({
        id:[null],
        posted_by: [null],
        testinmonial_content: [null],
        location: [null],
        designation: [null]
        
      });
      this.ModalHeading = "Add Page";
      this.ModalBtn = "Save";
    }
  
    getAll()
    { 

      const data = {
        searchvalue:this.searchform.value.searchvalue
      };
      // this.ts.readAll().subscribe(
      //   res=>{
      //     this.testimonial = res.data;
      //     // console.log(this.testimonial);
      //   }
      // );
      // console.log(data);
      this.ts.readAll(data).subscribe(
        res =>{
          this.testimonial = res.data;
        }
      )
    }
    refresh()
    {
      this.searchform.reset();
      this.getAll();
    }
  
    addData() { 
      // console.log(this.form.value);return false; 
      const data = {
        posted_by:this.form.value.posted_by,
        testinmonial_content:this.form.value.testinmonial_content,
        location:this.form.value.location,
        designation: this.form.value.designation,  
      };
      // console.log(data);
      let id = this.testimonialRecord?.id;
      if (id != null) {
        this.ts.update(id, data).subscribe(
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
        this.ts.create(data).subscribe(
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
      this.testimonialRecord = this.testimonial[id];
      this.form.controls.id.setValue(this.testimonialRecord.id);
      this.form.controls.posted_by.setValue(this.testimonialRecord.posted_by);
      this.form.controls.testinmonial_content.setValue(this.testimonialRecord.testinmonial_content);
      this.form.controls.location.setValue(this.testimonialRecord.location);
      this.form.controls.designation.setValue(this.testimonialRecord.designation);  
      this.ModalHeading = "Edit Location";
      this.ModalBtn = "Update";    
  
    }
  
    openConfirmDialog(content, id: any) {
      this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
      this.testimonialRecord = this.testimonial[id];
    }
  
    deleteRecord() {

      let delitem = this.testimonialRecord.id;
      this.ts.delete(delitem).subscribe(
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
    

    changeStatus(event : Event, stsitem:any)
  {
    this.ts.changestatus(stsitem).subscribe(
      resp => {
        
        if(resp.status==1)
        {
            this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
            this.ResetAttributes();
            this.getAll(); 
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
        height: '150px',
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
