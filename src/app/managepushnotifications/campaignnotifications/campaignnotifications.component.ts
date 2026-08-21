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
  operators: any[] = [];
  locations: any[] = [];
  coupons: any[] = [];
  pagination: any;
  all: any;
  pan_pattern = '/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/';

  imagePreview: string | null = null;
  selectedImage: File | null = null;

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
      windowClass: 'campaign-notification-modal',
    });

    this.modalReference.result.finally(() => {
      this.isModalOpening = false;
    });
  }

  ngOnInit(): void {
    this.spinner.show();

    this.getOperators();
    this.getLocations();
    this.getActiveCoupons();
    this.form = this.fb.group({
      id: [null],
      notification_category_id: ['', Validators.required],
      campaign_name: ['', Validators.required],
      title: ['', Validators.required],
      message: ['', Validators.required],
      image: [null],

      type: ['', Validators.required],

      target_type: ['ALL', Validators.required],
      active_user_duration: [''],

      schedule_type: ['', Validators.required],
      schedule_minutes: [0],
      schedules: this.fb.array([]),

      custom_scenario: [''],
      source: [''],
      destination: [''],
      operator_id: [''],
      coupon_code: [''],
    });

    this.form.get('custom_scenario')?.valueChanges.subscribe((value) => {
      if (value !== 'ROUTE') {
        this.form.patchValue({
          source: '',
          destination: '',
        });
      }

      if (value !== 'OPERATOR') {
        this.form.patchValue({
          operator_id: '',
        });
      }
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

  onImageChange(event: any): void {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    this.selectedImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;

    this.form.patchValue({
      image: null,
    });

    this.form.get('image')?.updateValueAndValidity();
  }

  getOperators(): void {
    this.campaignNotificationService.getOperators().subscribe(
      (response: any) => {
        console.log('Operators API response:', response);

        if (response && response.status === true) {
          this.operators = response.data || [];

          console.log('Operators loaded:', this.operators);
        } else {
          this.operators = [];
          console.log('No operators found');
        }
      },
      (error) => {
        console.error('Failed to load operators:', error);
        this.operators = [];
      },
    );
  }

  getLocations(): void {
    this.campaignNotificationService.getLocations().subscribe(
      (response: any) => {
        console.log('Locations API response:', response);

        if (response && response.status === true) {
          this.locations = response.data || [];

          console.log('Locations loaded:', this.locations);
        } else {
          this.locations = [];
          console.log('No Locations found');
        }
      },
      (error) => {
        console.error('Failed to load Locations:', error);
        this.locations = [];
      },
    );
  }

  getActiveCoupons(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.campaignNotificationService.getActiveCoupons().subscribe(
        (response: any) => {
          if (response && response.status === true) {
            this.coupons = response.data || [];

            console.log('Coupons loaded:', this.coupons);

            resolve(this.coupons);
          } else {
            this.coupons = [];
            resolve([]);
          }
        },
        (error) => {
          console.error('Failed to load coupons:', error);
          this.coupons = [];
          reject(error);
        },
      );
    });
  }

  onTypeChange(): void {
    const type = this.form.get('type')?.value;

    console.log('Selected type:', type);

    if (type === 'PROMOTIONAL') {
      this.getActiveCoupons();
    } else {
      this.coupons = [];

      this.form.patchValue({
        custom_scenario: '',
        source: '',
        destination: '',
        operator_id: '',
        coupon_code: '',
      });
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
    data.append('custom_scenario', this.form.value.custom_scenario || '');

    data.append('source', this.form.value.source || '');
    data.append('destination', this.form.value.destination || '');
    data.append('operator_id', this.form.value.operator_id?.toString() || '');
    data.append(
      'active_user_duration',
      this.form.value.target_type === 'ACTIVE'
        ? this.form.value.active_user_duration?.toString() || ''
        : '',
    );
    data.append('coupon_code', this.form.value.coupon_code?.toString() || '');
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

  onImageSelected(event: any): void {
    const file = event.target.files?.[0];

    if (!file) {
      this.imagePreview = null;
      this.selectedImage = null;
      return;
    }

    this.selectedImage = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
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

  targetTypeChange(type: string): void {
    this.form.patchValue({
      target_type: type,
      active_user_duration:
        type === 'ACTIVE' || type === 'CUSTOM'
          ? this.form.get('active_user_duration')?.value
          : '',
    });
  }

  async editCampaignNotification(event: Event, id: any) {
    this.spinner.show();

    // Make sure coupons are loaded before finding the saved coupon
    if (!this.coupons || this.coupons.length === 0) {
      await this.getActiveCoupons();
    }

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
          const custom = res.data.custom;

          // --------------------------------
          // Determine Custom Scenario
          // --------------------------------
          let customScenario = '';

          if (custom && custom.custom_type) {
            switch (Number(custom.custom_type)) {
              case 1:
                customScenario = 'ROUTE';
                break;

              case 2:
                customScenario = 'NEW_USER';
                break;

              case 3:
                customScenario = 'OPERATOR';
                break;

              case 4:
                customScenario = 'SPECIAL_OFFER';
                break;
            }
          }

          console.log('EDIT CAMPAIGN:', campaign);
          console.log('EDIT CUSTOM:', custom);
          console.log('CUSTOM SCENARIO:', customScenario);

          // --------------------------------
          // First patch normal campaign data
          // --------------------------------
          this.form.patchValue({
            id: campaign.id,
            notification_category_id: campaign.notification_category_id,
            campaign_name: campaign.campaign_name,
            title: campaign.title,
            message: campaign.message,
            type: campaign.type,
            target_type: campaign.target_type,
            active_user_duration: campaign.active_user_duration,
            schedule_type: campaign.schedule_type,
            schedule_minutes: campaign.schedule_minutes,
          });

          // --------------------------------
          // Find coupon ID from saved coupon CODE
          // --------------------------------
          let couponId = '';

          if (custom && custom.coupon_code) {
            const selectedCoupon = this.coupons.find(
              (coupon: any) => coupon.coupon_code === custom.coupon_code,
            );

            if (selectedCoupon) {
              couponId = selectedCoupon.id;
            }

            console.log('Saved coupon code:', custom.coupon_code);
            console.log('Matched coupon:', selectedCoupon);
            console.log('Coupon ID:', couponId);
          }

          // --------------------------------
          // Patch custom data
          // IMPORTANT: emitEvent false
          // --------------------------------
          this.form.patchValue(
            {
              custom_scenario: customScenario,

              source: custom?.source_id || '',
              destination: custom?.destination_id || '',

              operator_id: custom?.operator_id || '',

              coupon_code: couponId,
            },
            {
              emitEvent: false,
            },
          );

          console.log('FORM AFTER PATCH:', this.form.value);

          // --------------------------------
          // schedules
          // --------------------------------
          this.schedules.clear();

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
          }

          // --------------------------------
          // Image
          // --------------------------------
          this.selectedImage = null;

          if (campaign.image) {
            this.imagePreview =
              Constants.BASE_URL.replace('/api', '') + '/' + campaign.image;
          } else {
            this.imagePreview = null;
          }

          this.ModalHeading = 'Edit Campaign Notification';
          this.ModalBtn = 'Update';
        },
        (error) => {
          this.spinner.hide();

          console.error('Failed to load campaign notification:', error);
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
