import { Component, OnInit, ViewChild } from '@angular/core';
import { TicketfareslabService } from '../../services/ticketfareslab.service';
import { Constants } from '../../constant/constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Cancellationslab } from '../../model/cancellationslab';
import { NotificationService } from '../../services/notification.service';
import { Subject } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BusOperatorService } from '../../services/bus-operator.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-ticketfareslab',
  templateUrl: './ticketfareslab.component.html',
  styleUrls: ['./ticketfareslab.component.scss']
})
export class TicketfareslabComponent implements OnInit {

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

  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;

  public CancelationSlabList: FormArray;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  @ViewChild("addnew") addnew;

  cancellationSlabs: Cancellationslab[];
  cancellationSlabRecord: Cancellationslab;

  //durationPattern = "^[0-9--][0-9_-]{3,7}$";
  durationPattern = "^[0-9]{1,3}-[0-9]{1,3}"
  deductionPattern = /^(\d{0,2}(\.[0-9]{1,2})?|100)$/;
  //deductionPattern = /^(\d{0,2}(\.\d{1,2})?|100(\.00?)?)$/;



  public isSubmit: boolean;
  public mesgdata: any;
  public allDurations: string;
  public allDeductions: string;
  public ModalHeading: any;
  public ModalBtn: any;
  pagination: any;
  busoperators: any;
  all: any;
  allOdbusCommission: string;
  allstartingFare: string;
  alluptoFare: string;
  // returns all form groups under Cancellation Slab
  get slabFormGroup() {
    return this.form.get('slabs') as FormArray;
  }
  constructor(private spinner: NgxSpinnerService, private http: HttpClient, private busOperatorService: BusOperatorService, private cSlabService: TicketfareslabService, private notificationService: NotificationService, private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal) {
    this.isSubmit = false;
    this.cancellationSlabRecord = {} as Cancellationslab;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add CancelationSlab";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'lg' });
  }


  ngOnInit() {
    // this.spinner.show();
    // this.loadcSlab();
    this.form = this.fb.group({
      id: [null],
      bus_operator_id: [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      rule_name: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.required, Validators.maxLength(50)])],
      slabs: this.fb.array([this.createSlab()]),
    });
    // set CancellationSlablist to this field
    this.CancelationSlabList = this.form.get('slabs') as FormArray;
    this.formConfirm = this.fb.group({
      id: [null]
    });

    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
    });

    this.search();
    this.loadServices();
  }
  loadServices() {
    const BusOperator = {
      USER_BUS_OPERATOR_ID: localStorage.getItem("USER_BUS_OPERATOR_ID")
    };
    if (BusOperator.USER_BUS_OPERATOR_ID == "") {
      this.busOperatorService.readAll().subscribe(
        record => {
          this.busoperators = record.data;
          this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name + '  )'; return i; });

        }
      );
    }
    else {
      this.busOperatorService.readOne(BusOperator.USER_BUS_OPERATOR_ID).subscribe(
        record => {
          this.busoperators = record.data;
          this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name + '  )'; return i; });

        }
      );
    }

  }
  page(label: any) {
    return label;
  }


  search(pageurl = "") {
    this.spinner.show();
    const data = {
      name: this.searchForm.value.name,
      rows_number: this.searchForm.value.rows_number,
      USER_BUS_OPERATOR_ID: localStorage.getItem('USER_BUS_OPERATOR_ID')
    };


    if (pageurl != "") {
      this.cSlabService.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.cancellationSlabs = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          // console.log( this.cancellationSlabs);
          this.spinner.hide();

        }
      );
    }
    else {
      this.cSlabService.getAllData(data).subscribe(
        res => {
          this.cancellationSlabs = res.data.data.data;
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
      rows_number: Constants.RecordLimit,
    });

    this.search();


  }


  title = 'angular-app';
  fileName = 'ticketfareslab.xlsx';

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












  // CanclationSlab formgroup
  createSlab(): FormGroup {
    return this.fb.group({
      startingFare: ['', [Validators.required]],
      uptoFare: ['', [Validators.required]],
      odbusCommision: ['', [Validators.required]],
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
  ResetAttributes() {
    this.cancellationSlabRecord = {
      rule_name: ''
    } as Cancellationslab;

    this.form = this.fb.group({
      id: [null],
      bus_operator_id: [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      slabs: this.fb.array([this.createSlab()]),
    });
    this.CancelationSlabList = this.form.get('slabs') as FormArray;
    this.ModalHeading = "Add Ticket fare Slab";
    this.ModalBtn = "Save";
  }
  addTicketFareSlab() {
    this.spinner.show();
    this.allstartingFare = "";
    this.alluptoFare = "";
    this.allOdbusCommission = "";
    let id: any = this.cancellationSlabRecord.id;
    const data = {
      bus_operator_id: this.form.value.bus_operator_id,
      slabs: this.form.value.slabs,
      created_by: localStorage.getItem('USERNAME')
    };
  
    if (id == null) {
      this.cSlabService.create(data).subscribe(
        resp => {
          if (resp.status == 1) {
            this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: Constants.SuccessType });
            this.modalReference.close();
            this.ResetAttributes();
            this.refresh();
          }
          else {
    
            this.notificationService.addToast({ title: Constants.ErrorTitle, msg: resp.message, type: Constants.ErrorType });
            this.spinner.hide();
          }
        }
      );
    }
    else {
      this.cSlabService.update(id, data).subscribe(
        resp => {
          if (resp.status == 1) {
            //this.closebutton.nativeElement.click();
            this.notificationService.addToast({ title: Constants.RecordUpdateTitle, msg: resp.message, type: Constants.SuccessType });
            this.modalReference.close();
            this.ResetAttributes();
            this.refresh();
          }
          else {
            this.notificationService.addToast({ title: Constants.ErrorTitle, msg: resp.message, type: Constants.ErrorType });
            this.spinner.hide();
          }
        }
      );
    }
  }
  
  openConfirmDialog(content) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'sm' });
  }
  deleteRecord() {
    this.spinner.show();
    let delitem = this.formConfirm.value.id;

    this.cSlabService.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: Constants.SuccessType });
          this.confirmDialogReference.close();

          this.refresh();
        }
        else {

          this.notificationService.addToast({ title: Constants.ErrorTitle, msg: resp.message, type: Constants.ErrorType });
          this.spinner.hide();
        }
      });
  }
  deleteSlab(content, delitem: any) {

    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.formConfirm = this.fb.group({
      id: [delitem]
    });
  }

  changeStatus(event: Event, stsitem: any) {
    this.spinner.show();
    this.cSlabService.chngsts(stsitem).subscribe(
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

}
