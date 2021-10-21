import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Testimonial } from '../../model/testimonial';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {TestimonialService } from '../../services/testimonial.service';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import{Constants} from '../../constant/constant';


@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent implements OnInit {
  public form: FormGroup;
  public searchForm: FormGroup;
  pagination: any;


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
      
      this.form = this.fb.group({
        id:[null],
        posted_by: [null, Validators.compose([Validators.required])],
        testinmonial_content: [null, Validators.compose([Validators.required])],
        designation: [null, Validators.compose([Validators.required])],
        travel_date: [null, Validators.compose([Validators.required])],
        operator: [null, Validators.compose([Validators.required])],
        destination: [null, Validators.compose([Validators.required])],
        source: [null, Validators.compose([Validators.required])]

      });
      this.formConfirm=this.fb.group({
        id:[null]
      });
      this.searchForm = this.fb.group({  
        name: [null],  
        rows_number: Constants.RecordLimit,
      });
      this.search();
    }

  
  
    OpenModal(content) 
    {
      this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
    }
    ResetAttributes()
    {  this.testimonialRecord = {} as Testimonial;
      
    this.form = this.fb.group({
        id:[null],
        posted_by: [null],
        testinmonial_content: [null],
        designation: [null],
        travel_date: [null],
        operator: [null],
        destination: [null],
        source: [null] 
      });
      this.ModalHeading = "Add Testimonial Content";
      this.ModalBtn = "Save";
    }
  

    page(label:any){
      return label;
     }
  
     
    search(pageurl="")
    {      
      const data = { 
        name: this.searchForm.value.name,
        rows_number:this.searchForm.value.rows_number, 
      };
     
      // console.log(data);
      if(pageurl!="")
      {
        this.ts.getAllaginationData(pageurl,data).subscribe(
          res => {
            this.testimonial= res.data.data.data;
            this.pagination= res.data.data;
            // console.log( this.BusOperators);
          }
        );
      }
      else
      {
        this.ts.getAllData(data).subscribe(
          res => {
            this.testimonial= res.data.data.data;
            this.pagination= res.data.data;
            // console.log( res.data);
          }
        );
      }
    }
  
  
    refresh()
     {  
      this.searchForm = this.fb.group({  
        name: [null],  
        rows_number: Constants.RecordLimit,
      });
       this.search();
      
     }
  
    addData() { 
      // console.log(this.form.value);return false; 
      const data = {
        posted_by:this.form.value.posted_by,
        testinmonial_content:this.form.value.testinmonial_content,
        designation: this.form.value.designation, 
        travel_date: this.form.value.travel_date,
        operator: this.form.value.operator,
        destination: this.form.value.destination,
        source: this.form.value.source
 
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
              this.refresh();
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
              this.refresh();            
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
      this.form.controls.designation.setValue(this.testimonialRecord.designation);
      this.form.controls.travel_date.setValue(this.testimonialRecord.travel_date);
      this.form.controls.operator.setValue(this.testimonialRecord.operator);
      this.form.controls.destination.setValue(this.testimonialRecord.destination);
      this.form.controls.source.setValue(this.testimonialRecord.source);
        
      this.ModalHeading = "Edit Testimonial Content";
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
            this.refresh();         
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
