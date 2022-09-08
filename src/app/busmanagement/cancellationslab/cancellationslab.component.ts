import { Component, OnInit, ViewChild } from '@angular/core';
import { CancellationslabService} from '../../services/cancellationslab.service';
import {Constants} from '../../constant/constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Cancellationslab} from '../../model/cancellationslab';
import { NotificationService } from '../../services/notification.service';
import { Subject } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BusOperatorService } from '../../services/bus-operator.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-cancellationslab',
  templateUrl: './cancellationslab.component.html',
  styleUrls: ['./cancellationslab.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class CancellationslabComponent implements OnInit {

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
  
  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;

  public CancelationSlabList: FormArray;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  @ViewChild("addnew") addnew;

  users:any=[];

  cancellationSlabs: Cancellationslab[];
  cancellationSlabRecord: Cancellationslab;

  //durationPattern = "^[0-9--][0-9_-]{3,7}$";
  durationPattern = "^[0-9]{1,3}-[0-9]{1,3}"
  deductionPattern = /^(\d{0,2}(\.[0-9]{1,2})?|100)$/;
  //deductionPattern = /^(\d{0,2}(\.\d{1,2})?|100(\.00?)?)$/;
  
  
 
  public isSubmit: boolean;
  public mesgdata:any;
  public allDurations:string;
  public allDeductions:string;
  public ModalHeading:any;
  public ModalBtn:any;
  pagination: any;
  busoperators: any;
  all: any;
  // returns all form groups under Cancellation Slab
  get slabFormGroup() {
    return this.form.get('slabs') as FormArray;
  }
  constructor( private spinner: NgxSpinnerService,private http: HttpClient,private busOperatorService: BusOperatorService, private cSlabService:CancellationslabService, private notificationService: NotificationService,private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private userService: UserService) {
    this.isSubmit = false;
    this.cancellationSlabRecord= {} as Cancellationslab;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add CancelationSlab";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'lg' });
  }
 
 
  ngOnInit(){
    this.spinner.show();
    // this.loadcSlab();
    this.form = this.fb.group({
      id:[null],
      user_id: [null, Validators.compose([Validators.required,Validators.minLength(2)])],
      rule_name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])],
      slabs: this.fb.array([this.createSlab()]),
    });
     // set CancellationSlablist to this field
    this.CancelationSlabList = this.form.get('slabs') as FormArray;
    this.formConfirm=this.fb.group({
      id:[null]
    });

    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });

    this.search();
    this.loadServices();
  }
  loadServices() {
    const BusOperator={
      USER_BUS_OPERATOR_ID:localStorage.getItem("USER_BUS_OPERATOR_ID"),
      user_role:localStorage.getItem('ROLE_ID'),
      user_id:localStorage.getItem('USERID')
    };
    if(BusOperator.USER_BUS_OPERATOR_ID=="")
    {
      this.busOperatorService.userOperators(BusOperator).subscribe(
        record=>{
        this.busoperators=record.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });

        }
      );
    }
    else
    {
      this.busOperatorService.readOne(BusOperator.USER_BUS_OPERATOR_ID).subscribe(
        record=>{
        this.busoperators=record.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });

        }
      );
    }

     ////// get all user list

     this.userService.getAllUser().subscribe(
      record=>{
      this.users=record.data;
      this.users.map((i: any) => { i.userData = i.name + '    (  ' + i.email  + '  )'; return i; });
      }
    );

  }
  page(label:any){
    return label;
   }

   
  search(pageurl="")
  {      
    this.spinner.show();
    const data = { 
      name: this.searchForm.value.name,
      rows_number:this.searchForm.value.rows_number, 
      user_role:localStorage.getItem('ROLE_ID'),
      user_id:localStorage.getItem('USERID')
    };
   

    if(pageurl!="")
    {
      this.cSlabService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.cancellationSlabs= res.data.data.data;
          this.pagination= res.data.data;
          this.all =res.data;
          // console.log( this.cancellationSlabs);
           this.spinner.hide();

        }
      );
    }
    else
    {
      this.cSlabService.getAllData(data).subscribe(
        res => {
          this.cancellationSlabs= res.data.data.data;
          this.pagination= res.data.data;
          this.all =res.data;
          this.spinner.hide();
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
     this.spinner.hide();

  }
  title = 'angular-app';
  fileName= 'Cancellation-Slab.csv';

  exportexcel(): void
  {
    
    /* pass here the table id */
    let element = document.getElementById('print-section');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
  }

  // CanclationSlab formgroup
  createSlab(): FormGroup {
    return this.fb.group({ 
      duration: ['', [Validators.required, Validators.pattern(this.durationPattern)]],
      deduction: ['', [Validators.required, Validators.pattern(this.deductionPattern)]],
    });
  }
  // add a CancelationSlab form group
  addSlabs() {
    this.CancelationSlabList.push(this.createSlab());
  }
  // remove cancelationSlab from group
  removeSlab(index) {  
    this.CancelationSlabList.removeAt(index);
  }
  // get the formgroup under form array
  getSlabsFormGroup(index): FormGroup {
    const formGroup = this.CancelationSlabList.controls[index] as FormGroup;
    return formGroup;
  }
  ResetAttributes()
  {
    this.cancellationSlabRecord = {
      rule_name:''
    } as Cancellationslab;

    this.form = this.fb.group({
      id:[null],
      user_id: [null, Validators.compose([Validators.required,Validators.minLength(2)])],
      cancellation_policy_desc:[null],
      rule_name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])],
      slabs: this.fb.array([this.createSlab()]),
    });
    this.CancelationSlabList = this.form.get('slabs') as FormArray;
    this.ModalHeading = "Add CancelationSlab";
    this.ModalBtn = "Save";
  }
  addCancellationSlab()
  {
    this.spinner.show();
    this.allDurations="";
    this.allDeductions="";
    let id:any=this.cancellationSlabRecord.id; 
    const data ={
      user_id:this.form.value.user_id,
      rule_name:this.form.value.rule_name,
      cancellation_policy_desc:this.form.value.cancellation_policy_desc,
      slabs:this.form.value.slabs,
      created_by:localStorage.getItem('USERNAME')
    };
    // console.log(data);
    // return false;
    if(id==null)
    {
      this.cSlabService.create(data).subscribe(
        resp => {
          if(resp.status==1)
          {
              //this.closebutton.nativeElement.click();
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.ResetAttributes();
              this.refresh();
          }
          else{
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
              this.spinner.hide();
          }
        }
      );
    }
    else{
      this.cSlabService.update(id,data).subscribe(
        resp => {
          if(resp.status==1)
          {
              //this.closebutton.nativeElement.click();
              this.notificationService.addToast({title:Constants.RecordUpdateTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.ResetAttributes();
              this.refresh();
          }
          else{
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
            this.spinner.hide();
          }
        }
      );
    }  
  }
  editcSlabs(event : Event, id : any)
  {
    this.cancellationSlabRecord=this.cancellationSlabs[id] ; 
    this.form = this.fb.group({
      id:[this.cancellationSlabRecord.id],
      cancellation_policy_desc:[this.cancellationSlabRecord.cancellation_policy_desc],
      user_id: [this.cancellationSlabRecord.user_id, Validators.compose([Validators.required,Validators.minLength(2)])],
      rule_name: [this.cancellationSlabRecord.rule_name, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      slabs: this.fb.array([this.createSlab()]),
    });
    this.CancelationSlabList = this.form.get('slabs') as FormArray;
    let editSlab=[];
    //let editDuration=[];
    //let editDeduction=[];
    this.CancelationSlabList.removeAt(0);
    let cCount=0;
    for(let items of this.cancellationSlabRecord.slab_info)
    {
      this.CancelationSlabList.push(this.fb.group({ 
        duration: [items.duration, Validators.compose([Validators.required,Validators.minLength(2)])],
        deduction: [items.deduction, Validators.compose([Validators.required,Validators.minLength(2)])]
      }));
      cCount++;
    }
    
    this.form.value.slabs=editSlab; 
     //this.form.value.slabs=editDuration;  
     //this.form.value.slabs=editDeduction; 
     this.ModalHeading = "Edit CancelationSlab";
     this.ModalBtn = "Update";
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'sm' });
  }
  deleteRecord()
  {

    let delitem=this.formConfirm.value.id;
     this.cSlabService.delete(delitem).subscribe(
      resp => {
        if(resp.status==1)
            {
                this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                this.confirmDialogReference.close();

                this.refresh();
            }
            else{
               
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
              this.spinner.hide();
            }
      }); 
  }
  deleteSlab(content, delitem:any)
  {

    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.spinner.show();
    this.cSlabService.chngsts(stsitem).subscribe(
      resp => {
        if(resp.status==1)
        {
            this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
            this.refresh();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
      }
    );
  }

}
