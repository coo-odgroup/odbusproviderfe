import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from '../constant/constant';
import { NgxSpinnerService } from "ngx-spinner";

// New
import { cronJob } from '../model/cronJob';
import { CronJobService } from '../services/cronjob.service';

@Component({
  selector: 'app-managecronjob',
  templateUrl: './managecronjob.component.html',
  styleUrls: ['./managecronjob.component.scss']
})

export class ManagecronjobComponent implements OnInit {
  public form!: FormGroup;

  public formConfirm!: FormGroup;
  public searchForm!: FormGroup;
  pagination: any;

  modalReference!: NgbModalRef;
  confirmDialogReference!: NgbModalRef;

  public isSubmit!: boolean;
  public ModalHeading: any;
  public ModalBtn: any;

  all: any;

  // New Veriables
  cronList!: cronJob[];
  cronListRecord!: cronJob;
  public myForm!: FormGroup;
  public cronfrequencies!: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    config: NgbModalConfig,

    // New
    private cj: CronJobService,
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.formConfirm = this.fb.group({
      id: [null]
    });

    this.searchForm = this.fb.group({
      search: [null],
      frequency_id: [null],
      run_type: [null],
      rows_number: Constants.RecordLimit,
    });

    this.search();

    // New
    this.myForm = this.fb.group({
      name: [null, Validators.required],
      command: [null, Validators.required],
      frequency_id: [null, Validators.required],
      run_type: [null, Validators.required],
    });

    this.getCronFrequencies();
  }

  search(pageurl = "") {
    this.spinner.show();

    const data = {
      search: this.searchForm.value.search,
      frequency_id: this.searchForm.value.frequency_id,
      run_type: this.searchForm.value.run_type,
      rows_number: this.searchForm.value.rows_number
    };

    // console.log(data);
    // return;

    if (pageurl != "") {
      this.cj.getAllaginationData(pageurl, data).subscribe(
        res => {
          // console.log(res);
          this.cronList = res.data;
          this.spinner.hide();
        }
      );
    } else {
      this.cj.getAllData(data).subscribe(
        res => {
          // console.log(res);
          this.cronList = res.data;
          this.spinner.hide();
        }
      );
    }
  }

  refresh() {
    this.spinner.show();

    this.searchForm = this.fb.group({
      search: [null],
      frequency_id: [null],
      run_type: [null],
      rows_number: Constants.RecordLimit,
    });

    this.search();
  }

  OpenModal(content: any) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }

  ResetAttributes() {
    this.cronListRecord = {} as cronJob;

    this.myForm = this.fb.group({
      name: [null],
      command: [null],
      frequency_id: [null],
      run_type: [null],
    });

    this.myForm.reset();

    this.ModalHeading = "Add Cron Job";
    this.ModalBtn = "Save";
  }


  addData() {
    this.spinner.show();

    console.log(this.myForm.value);
    // return;

    const data = {
      name: this.myForm.value.name,
      command: this.myForm.value.command,
      frequency_id: this.myForm.value.frequency_id,
      run_type: this.myForm.value.run_type,
      is_active: 1,
      last_run_at: null,
      next_run_at: null
    };

    let id = this.cronListRecord?.id;
    if (id != null) {
      this.cj.update(id, data).subscribe(
        resp => {
          if (resp.status == true) {
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
      this.cj.create(data).subscribe(
        resp => {
          console.log(resp);
          if (resp.status == true) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.refresh();
          } else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
            this.spinner.hide();
          }
        }
      );

    }

  }



  editData(id: any) {
    this.cronListRecord = this.cronList[id];

    this.myForm.controls.name.setValue(this.cronListRecord.name);
    this.myForm.controls.command.setValue(this.cronListRecord.command);
    this.myForm.controls.frequency_id.setValue(this.cronListRecord.frequency_id);
    this.myForm.controls.run_type.setValue(this.cronListRecord.run_type);

    this.ModalHeading = "Edit Page";
    this.ModalBtn = "Update";
  }

  openConfirmDialog(content: any, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.cronListRecord = this.cronList[id];
  }

  deleteRecord() {
    let delitem = this.cronListRecord.id;
    this.cj.delete(delitem).subscribe(
      resp => {
        if (resp.status == true) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.confirmDialogReference.close();
          this.ResetAttributes();
          this.search();
        } else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      });
  }

  // New
  runTypes = [
    { id: 'auto', name: 'Auto' },
    { id: 'manual', name: 'Manual' }
  ];

  getCronFrequencies() {
    this.cj.getCronF().subscribe(
      res => {
        this.cronfrequencies = res.data;
        // console.log(res.data);
      }
    );
  }
}