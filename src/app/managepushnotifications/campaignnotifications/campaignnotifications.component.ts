import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { CampaignnotificationService } from '../../services/campaignnotification.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Constants } from '../../constant/constant';
import { BusOperatorService } from '../../services/bus-operator.service';
import {
  NgbModalConfig,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { CampaignNotification } from '../../model/campaignnotification';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-campaignnotifications',
  templateUrl: './campaignnotifications.component.html',
  styleUrls: ['./campaignnotifications.component.scss'],
})
export class CampaignnotificationsComponent implements OnInit {
  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;

  //@ViewChild("addnew") addnew;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  campaignNotifications: CampaignNotification[];
  campaignNotificationRecord: CampaignNotification;
  public isSubmit: boolean;
  isModalOpening = false;
  public validIFSC: any;
  public ModalHeading: any;
  public ModalBtn: any;
  notificationCategories: any[] = [];
  pagination: any;
  all: any;
  pan_pattern = '/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/';

  constructor(
    private spinner: NgxSpinnerService,
    private campaignNotificationService: CampaignnotificationService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private busOperatorService: BusOperatorService,
  ) {
    this.isSubmit = false;
    this.campaignNotificationRecord = {} as CampaignNotification;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = 'Add Campaign Notification';
    this.ModalBtn = 'Save';
  }

  OpenModal(content: any) {
    if (this.isModalOpening) {
      return;
    }

    this.isModalOpening = true;

    this.modalReference = this.modalService.open(content, {
      scrollable: true,
      size: 'xl',
    });

    this.modalReference.result.finally(() => {
      this.isModalOpening = false;
    });
  }

  ngOnInit(): void {
    this.spinner.show();

    this.form = this.fb.group({
      id: [null],
      notification_category_id: ['', Validators.required],
      campaign_name: ['', Validators.required],
      title: ['', Validators.required],
      message: ['', Validators.required],
      image: [null],
      type: ['PROMOTIONAL', Validators.required],
      target_type: ['ALL', Validators.required],
      schedule_type: ['IMMEDIATE', Validators.required],
      schedule_minutes: [0],
      schedules: this.fb.array([]),
    });

    this.formConfirm = this.fb.group({
      id: [null],
    });

    this.searchForm = this.fb.group({
      name: [''],
      status: [''],
      type: [''],
      target_type: [''],
      schedule_type: [''],
      rows_number: Constants.RecordLimit,
    });
    this.getNotificationCategories();
    this.search();
  }

  search(pageurl = '') {
    this.spinner.show();
    const data = {
      name: this.searchForm.value.name,
      status: this.searchForm.value.status,
      type: this.searchForm.value.type,
      target_type: this.searchForm.value.target_type,
      schedule_type: this.searchForm.value.schedule_type,
      rows_number: this.searchForm.value.rows_number,
    };

    // console.log(data);
    if (pageurl != '') {
      this.campaignNotificationService
        .getAllPaginationData(pageurl, data)
        .subscribe((res) => {
          this.campaignNotifications = res.data.data || [];
          this.pagination = res.data;
          this.all = res;
          this.spinner.hide();
        });
    } else {
      this.campaignNotificationService.getAllData(data).subscribe((res) => {
        this.campaignNotifications = res.data.data || [];
        this.pagination = res.data;
        this.all = res;
        //console.log(this.apiuser);
        this.spinner.hide();
      });
    }
  }

  refresh() {
    this.searchForm.reset({
      name: '',
      status: '',
      type: '',
      target_type: '',
      schedule_type: '',
      rows_number: Constants.RecordLimit,
    });

    this.search();

    this.search();
  }

  get schedules(): FormArray {
    return this.form.get('schedules') as FormArray;
  }

  createSchedule(): FormGroup {
    return this.fb.group({
      schedule_date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
    });
  }

  addSchedule(): void {
    this.schedules.push(this.createSchedule());
  }

  removeSchedule(index: number): void {
    if (this.schedules.length > 1) {
      this.schedules.removeAt(index);
    }
  }
  ResetAttributes() {
    this.campaignNotificationRecord = {} as CampaignNotification;
    this.form.reset();
    this.selectedImage = null;
    this.form.patchValue({
      notification_category_id: '',
      type: 'PROMOTIONAL',
      target_type: 'ALL',
      schedule_type: 'IMMEDIATE',
      schedule_minutes: 0,
    });

    this.ModalHeading = 'Add Campaign Notification';
    this.ModalBtn = 'Save';
  }

  selectedImage: File | null = null;

  onImageChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  saveCampaignNotification() {
    console.log('Save Fired');

    console.log(this.form.value);

    console.log(this.selectedImage);

    this.spinner.show();
    const id = this.form.get('id')?.value;
    // console.log(this.form.value);
    // return

    const data = new FormData();

    data.append(
      'notification_category_id',
      this.form.value.notification_category_id?.toString() || '',
    );
    data.append('campaign_name', this.form.value.campaign_name);
    data.append('title', this.form.value.title);
    data.append('message', this.form.value.message);
    data.append('type', this.form.value.type);
    data.append('target_type', this.form.value.target_type);
    data.append('schedule_type', this.form.value.schedule_type);
    data.append(
      'schedule_minutes',
      this.form.value.schedule_minutes?.toString() ?? '0',
    );

    data.append('created_by', sessionStorage.getItem('USERID') || '');

    /*
     * Add schedules only for SCHEDULED campaign
     */
    if (this.form.value.schedule_type === 'SCHEDULED') {
      this.schedules.controls.forEach((schedule, index) => {
        data.append(
          `schedules[${index}][schedule_date]`,
          schedule.get('schedule_date')?.value || '',
        );

        data.append(
          `schedules[${index}][start_time]`,
          schedule.get('start_time')?.value || '',
        );

        data.append(
          `schedules[${index}][end_time]`,
          schedule.get('end_time')?.value || '',
        );
      });
    }

    if (this.selectedImage) {
      data.append('image', this.selectedImage);
    }

    if (id == null) {
      this.campaignNotificationService.create(data).subscribe((resp) => {
        if (resp.status == 1) {
          this.notificationService.addToast({
            title: Constants.SuccessTitle,
            msg: resp.message,
            type: Constants.SuccessType,
          });
          this.modalReference.close();
          //this.closebutton.nativeElement.click();
          this.ResetAttributes();
          this.search();
          this.spinner.hide();
        } else {
          this.notificationService.addToast({
            title: Constants.ErrorTitle,
            msg: resp.message,
            type: Constants.ErrorType,
          });
          this.spinner.hide();
        }
      });
    } else {
      //console.log(data);
      this.campaignNotificationService.update(id, data).subscribe((resp) => {
        if (resp.status == 1) {
          this.notificationService.addToast({
            title: Constants.SuccessTitle,
            msg: resp.message,
            type: Constants.SuccessType,
          });

          this.modalReference.close();
          this.ResetAttributes();
          this.search();
          this.spinner.hide();
        } else {
          this.notificationService.addToast({
            title: Constants.ErrorTitle,
            msg: resp.message,
            type: Constants.ErrorType,
          });

          this.spinner.hide();
        }
      });
    }
  }

  getNotificationCategories() {
    this.campaignNotificationService
      .getNotificationCategories()
      .subscribe((res: any) => {
        if (res.status == 1) {
          this.notificationCategories = res.data || [];
        } else {
          this.notificationCategories = [];
        }
      });
  }

  editCampaignNotification(event: Event, id: any) {
    this.spinner.show();

    this.campaignNotificationService
      .getCampaignNotification(this.campaignNotifications[id].id)
      .subscribe(
        (res: any) => {
          this.spinner.hide();

          if (res.status !== 1) {
            return;
          }

          const campaign = res.data.campaign;
          const schedules = res.data.schedules || [];

          /*
           * Patch campaign fields
           */
          this.form.patchValue({
            id: campaign.id,
            notification_category_id: campaign.notification_category_id,
            campaign_name: campaign.campaign_name,
            title: campaign.title,
            message: campaign.message,
            type: campaign.type,
            target_type: campaign.target_type,
            schedule_type: campaign.schedule_type,
            schedule_minutes: campaign.schedule_minutes,
          });

          /*
           * Clear existing FormArray
           */
          this.schedules.clear();

          /*
           * Add previously saved schedules
           */
          if (campaign.schedule_type === 'SCHEDULED' && schedules.length > 0) {
            schedules.forEach((schedule: any) => {
              this.schedules.push(
                this.fb.group({
                  schedule_date: [schedule.schedule_date, Validators.required],

                  start_time: [schedule.start_time, Validators.required],

                  end_time: [schedule.end_time, Validators.required],
                }),
              );
            });
          } else if (campaign.schedule_type === 'SCHEDULED') {
            /*
             * Safety: show one empty row
             */
            this.addSchedule();
          }

          /*
           * Schedule minutes state
           */
          if (campaign.schedule_type === 'SCHEDULED') {
            this.form.get('schedule_minutes')?.disable();
          } else if (
            campaign.schedule_type === 'BEFORE_EVENT' ||
            campaign.schedule_type === 'AFTER_EVENT'
          ) {
            this.form.get('schedule_minutes')?.enable();
          } else {
            this.form.get('schedule_minutes')?.disable();
          }

          this.ModalHeading = 'Edit Campaign Notification';

          this.ModalBtn = 'Update';

          this.selectedImage = null;
        },
        (error) => {
          this.spinner.hide();

          this.notificationService.addToast({
            title: Constants.ErrorTitle,
            msg: 'Unable to load campaign notification',
            type: Constants.ErrorType,
          });
        },
      );
  }

  openConfirmDialog(content) {
    this.confirmDialogReference = this.modalService.open(content, {
      scrollable: true,
      size: 'md',
    });
  }

  changeStatus(event: Event, stsitem: any) {
    const data = {
      created_by: sessionStorage.getItem('USERID'),
      id: stsitem,
    };
    // console.log(data);
    // return;

    this.spinner.show();
    this.campaignNotificationService.changeStatus(data).subscribe((resp) => {
      if (resp.status == 1) {
        //this.closebutton.nativeElement.click();
        this.notificationService.addToast({
          title: 'Success',
          msg: resp.message,
          type: 'success',
        });
        this.refresh();
      } else {
        this.notificationService.addToast({
          title: 'Error',
          msg: resp.message,
          type: 'error',
        });
      }
    });
  }

  scheduleTypeChange(type: string): void {
    this.form.patchValue({
      schedule_type: type,
    });

    if (type === 'SCHEDULED') {
      // Disable schedule minutes
      this.form.get('schedule_minutes')?.disable();

      // Add first schedule row if none exists
      if (this.schedules.length === 0) {
        this.addSchedule();
      }
    } else {
      // Remove all scheduled rows
      this.schedules.clear();

      // Enable schedule minutes for BEFORE_EVENT / AFTER_EVENT
      if (type === 'BEFORE_EVENT' || type === 'AFTER_EVENT') {
        this.form.get('schedule_minutes')?.enable();
      } else {
        // IMMEDIATE
        this.form.patchValue({
          schedule_minutes: 0,
        });

        this.form.get('schedule_minutes')?.disable();
      }
    }
  }

  title = 'angular-app';
  fileName = 'Campaign-Notification.xlsx';

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

  testSave() {
    console.log('Button Clicked');
    console.log(this.form.value);
  }
}
