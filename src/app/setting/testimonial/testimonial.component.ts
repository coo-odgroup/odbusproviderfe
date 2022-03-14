import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BusOperatorService } from './../../services/bus-operator.service';
import { Testimonial } from '../../model/testimonial';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {TestimonialService } from '../../services/testimonial.service';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { UserService } from '../../services/user.service';
import{Constants} from '../../constant/constant';
import { NgxSpinnerService } from "ngx-spinner";


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
  busoperators: any;


  testimonial: Testimonial[];
  testimonialRecord: Testimonial;
  all: any;
  users:any=[];
  role_id: any;
  usre_name:any ;

  constructor(
    private http: HttpClient, 
    private notificationService: NotificationService, 
    private fb: FormBuilder,
    private ts: TestimonialService, private busOperatorService: BusOperatorService ,
    private modalService: NgbModal,private spinner: NgxSpinnerService,
    config: NgbModalConfig,
    private userService: UserService

    )
    { 
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
        id:[null],
        posted_by: [null, Validators.compose([Validators.required])],
        testinmonial_content: [null, Validators.compose([Validators.required])],
        designation: [null, Validators.compose([Validators.required])],
        travel_date: [null, Validators.compose([Validators.required])],
        user_id: [null, Validators.compose([Validators.required])],
        destination: [null, Validators.compose([Validators.required])],
        source: [null, Validators.compose([Validators.required])]

      });
      this.formConfirm=this.fb.group({
        id:[null]
      });
      this.searchForm = this.fb.group({  
        name: [null],  
        user_id:[null],
        rows_number: Constants.RecordLimit,
      });
      this.search();

      this.loadServices();
    }

  
  
    OpenModal(content) 
    {
      this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
    }
    ResetAttributes()
    {  this.testimonialRecord = {} as Testimonial;
      
    this.form = this.fb.group({
      id:[null],
      posted_by: [null, Validators.compose([Validators.required])],
      testinmonial_content: [null, Validators.compose([Validators.required])],
      designation: [null, Validators.compose([Validators.required])],
      travel_date: [null, Validators.compose([Validators.required])],
      user_id: [null, Validators.compose([Validators.required])],
      destination: [null, Validators.compose([Validators.required])],
      source: [null, Validators.compose([Validators.required])]
      });
      this.ModalHeading = "Add Testimonial Content";
      this.ModalBtn = "Save";
    }
  

    page(label:any){
      return label;
     }
  
     
    search(pageurl="")
    {     this.spinner.show(); 
      const data = { 
        name: this.searchForm.value.name,
        user_id:  this.searchForm.value.user_id,
        rows_number:this.searchForm.value.rows_number, 
        role_id: localStorage.getItem('ROLE_ID'),
        userID: localStorage.getItem('USERID'),
      };
     
      // console.log(data);
      if(pageurl!="")
      {
        this.ts.getAllaginationData(pageurl,data).subscribe(
          res => {
            this.testimonial= res.data.data.data;
            this.pagination= res.data.data;
            this.all= res.data;
            this.spinner.hide();
          }
        );
      }
      else
      {
        this.ts.getAllData(data).subscribe(
          res => {
            this.testimonial= res.data.data.data;
            this.pagination= res.data.data;
            this.all= res.data;
            this.spinner.hide();
          }
        );
      }
    }
  
  
    refresh()
     {  
      this.spinner.show();
      this.searchForm = this.fb.group({  
        name: [null],
        user_id:[null],
        rows_number: Constants.RecordLimit,
      });
       this.search();
      
     }
  
    addData() { 

      this.spinner.show();
      if(this.role_id!=1){
        this.form.controls.user_id.setValue(localStorage.getItem('USERID'));
      }
      // console.log(this.form.value);return false; 
      const data = {
        posted_by:this.form.value.posted_by,
        testinmonial_content:this.form.value.testinmonial_content,
        designation: this.form.value.designation, 
        travel_date: this.form.value.travel_date,
        user_id: this.form.value.user_id,
        destination: this.form.value.destination,
        source: this.form.value.source,
        created_by: localStorage.getItem('USERNAME') 
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
              this.spinner.hide();
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
              this.spinner.hide();
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
      this.form.controls.user_id.setValue(this.testimonialRecord.user_id);
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
            this.spinner.hide();
          }
        });
    }
    

  changeStatus(event : Event, stsitem:any)
  {
    this.spinner.show();
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
