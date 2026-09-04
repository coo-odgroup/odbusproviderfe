import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  NgbModalConfig,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

import { Constants } from '../../constant/constant';
import { NotificationService } from '../../services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-agentslider',
  templateUrl: './agentslider.component.html',
  styleUrls: ['./agentslider.component.scss'],
  providers: [NgbModalConfig, NgbModal],
})
export class AgentsliderComponent implements OnInit {
  per_page = Constants.RecordLimit;
  searchBy = '';
  status = '';

  sliderForm: FormGroup;
  formConfirm: FormGroup;
  searchForm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  sliders: any[] = [];
  sliderRecord: any = {};

  role_id: any;
  userData: any;
  userId: any;

  imageError: any;
  imgURL: any;
  selectedFile: File = null;

  path = Constants.BASE_URL + '/';

  public isSubmit = false;
  public ModalHeading: any = 'Add Agent Slider';
  public ModalBtn: any = 'Save';
  public message: string;
  public pagination: any;
  public imageSizeFlag = true;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    const userId = sessionStorage.getItem('USERID');

    if (userId) {
      this.userId = Number(userId);
      console.log('Logged-in User ID:', this.userId);
    } else {
      this.userId = null;
      console.error('USERID not found in sessionStorage');
    }

    this.searchForm = this.fb.group({
      searchBy: [null],
      status: [null],
      per_page: [Constants.RecordLimit],
    });

    this.createSliderForm();

    this.formConfirm = this.fb.group({
      id: [null],
    });

    this.getAll();
  }

  createSliderForm(): void {
    this.sliderForm = this.fb.group({
      id: [null],

      // File is NOT part of the reactive form.
      url: [null],

      alt_tag: [null, Validators.required],

      slider_description: [null],

      default_slider: [false],

      sequence: [null],

      // Dates are optional
      start_date: [null],
      end_date: [null],
    });
  }

  getAll(url: string = ''): void {
    this.spinner.show();

    const params: any = {
      per_page: this.searchForm.value.per_page || 10,
    };

    // Only send status if selected
    if (
      this.searchForm.value.status !== null &&
      this.searchForm.value.status !== ''
    ) {
      params.status = this.searchForm.value.status;
    }

    // Only send search if entered
    if (
      this.searchForm.value.searchBy !== null &&
      this.searchForm.value.searchBy !== ''
    ) {
      params.searchBy = this.searchForm.value.searchBy;
    }

    const apiUrl = url || this.path + 'getAgentSliders';

    console.log('Agent Slider API:', apiUrl);
    console.log('Agent Slider Params:', params);

    this.http.post(apiUrl, params).subscribe(
      (res: any) => {
        this.spinner.hide();

        console.log('Agent Slider API RESPONSE:', res);

        if (res && res.status === true) {
          /*
           * Laravel paginate() response:
           *
           * res.data = pagination object
           * res.data.data = actual records
           */

          this.sliders =
            res.data && Array.isArray(res.data.data) ? res.data.data : [];

          this.pagination = res.data;

          console.log('Agent Slider Records:', this.sliders);
        } else {
          this.sliders = [];
          this.pagination = null;

          console.log('Agent Slider API returned no data:', res);
        }
      },
      (error) => {
        this.spinner.hide();

        console.error('Get Agent Slider Error:', error);

        this.sliders = [];
        this.pagination = null;

        this.notificationService.addToast({
          title: 'Error',
          msg: error.error?.message || 'Unable to load agent sliders.',
          type: 'error',
        });
      },
    );
  }

  refresh(): void {
    this.searchForm.patchValue({
      searchBy: null,
      status: null,
      per_page: Constants.RecordLimit,
    });

    this.getAll();
  }

  page(label: any): any {
    return label;
  }

  OpenModal(content: any): void {
    this.modalReference = this.modalService.open(content, {
      scrollable: true,
      size: 'xl',
    });
  }

  ResetAttributes(): void {
    this.sliderRecord = {};

    this.createSliderForm();

    this.ModalHeading = 'Add Agent Slider';
    this.ModalBtn = 'Save';

    this.imgURL = '';
    this.imageError = null;

    this.selectedFile = null;

    this.imageSizeFlag = true;
    this.isSubmit = false;
  }

  picked(event: any): boolean {
    this.imageError = null;
    this.imageSizeFlag = true;

    const maxSize = 102400; // 100 KB

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    const files: FileList = event.target.files;

    if (!files || files.length === 0) {
      return false;
    }

    const file: File = files[0];

    // File size
    if (file.size > maxSize) {
      this.imageError = 'Maximum size allowed is 100Kb';

      this.selectedFile = null;
      this.imgURL = '';
      this.imageSizeFlag = false;

      event.target.value = '';

      return false;
    }

    // File type
    if (allowedTypes.indexOf(file.type) === -1) {
      this.imageError = 'Only JPG, JPEG and PNG images are allowed.';

      this.selectedFile = null;
      this.imgURL = '';

      event.target.value = '';

      return false;
    }

    // Store selected file
    this.selectedFile = file;

    // Preview
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imgURL = e.target.result;
    };

    reader.readAsDataURL(file);

    return true;
  }

  addSlider(): void {
    this.isSubmit = true;

    const id = this.sliderForm.value.id;
    const createdBy = sessionStorage.getItem('USERID');

    if (!createdBy || createdBy === 'null' || createdBy === 'undefined') {
      this.notificationService.addToast({
        title: 'Error',
        msg: 'User ID not found. Please login again.',
        type: 'error',
      });
      return;
    }
  

    if (this.sliderForm.invalid) {
      this.sliderForm.markAllAsTouched();

      return;
    }

    this.spinner.show();

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('slider_img', this.selectedFile);
    }

    formData.append('url', this.sliderForm.value.url || '');
    formData.append('alt_tag', this.sliderForm.value.alt_tag || '');
    formData.append(
      'slider_description',
      this.sliderForm.value.slider_description || '',
    );
    formData.append(
      'default_slider',
      this.sliderForm.value.default_slider ? '1' : '0',
    );
    formData.append('sequence', this.sliderForm.value.sequence || '');
    formData.append('start_date', this.sliderForm.value.start_date || '');
    formData.append('end_date', this.sliderForm.value.end_date || '');

    let apiUrl = '';
    let request: any;

    if (id == null) {
      formData.append('created_by', sessionStorage.getItem('USERID') || '');
      apiUrl = this.path + 'addAgentSlider';
      request = this.http.post(apiUrl, formData);
    } else {
      formData.append('updated_by', sessionStorage.getItem('USERID') || '');
      apiUrl = this.path + 'updateAgentSlider/' + id;
      request = this.http.post(apiUrl, formData);
    }

    request.subscribe(
      (resp: any) => {
        this.spinner.hide();

        if (resp.status) {
          this.notificationService.addToast({
            title: 'Success',
            msg: resp.message,
            type: 'success',
          });

          if (this.modalReference) {
            this.modalReference.close();
          }

          this.ResetAttributes();

          this.getAll();
        } else {
          this.notificationService.addToast({
            title: 'Error',
            msg: resp.message || 'Unable to save slider.',
            type: 'error',
          });
        }
      },
      (error) => {
        this.spinner.hide();

        console.error('Agent Slider API Error:', error);

        let message = 'Something went wrong.';

        if (error.error?.message) {
          if (typeof error.error.message === 'string') {
            message = error.error.message;
          } else if (error.error.message instanceof Object) {
            message = Object.keys(error.error.message)
              .map((key) => {
                const value = error.error.message[key];

                if (Array.isArray(value)) {
                  return value.join(' ');
                }

                return String(value);
              })
              .join(' ');
          } else {
            message = 'Validation failed.';
          }
        }

        this.notificationService.addToast({
          title: 'Error',
          msg: message,
          type: 'error',
        });
      },
    );
  }

  editSlider(index: number): void {
    this.sliderRecord = this.sliders[index];

    /*
     * Clear selected file.
     * Existing image is only previewed.
     */
    this.selectedFile = null;
    this.imageError = null;
    this.imageSizeFlag = true;
    this.imgURL = '';

    this.sliderForm = this.fb.group({
      id: [this.sliderRecord.id],

      url: [this.sliderRecord.url || ''],

      alt_tag: [this.sliderRecord.alt_tag || '', Validators.required],

      slider_description: [this.sliderRecord.slider_description || ''],

      default_slider: [
        this.sliderRecord.default_slider == 1 ||
          this.sliderRecord.default_slider === true,
      ],

      sequence: [this.sliderRecord.sequence],

      // Optional
      start_date: [this.sliderRecord.start_date || ''],

      end_date: [this.sliderRecord.end_date || ''],
    });

    /*
     * Existing image preview
     */
    if (this.sliderRecord.file_name && this.sliderRecord.image_path) {
      this.imgURL =
        this.path + this.sliderRecord.image_path + this.sliderRecord.file_name;
    }

    this.ModalHeading = 'Edit Agent Slider';
    this.ModalBtn = 'Update';

    this.isSubmit = false;
  }

  openConfirmDialog(content: any, index: number): void {
    this.confirmDialogReference = this.modalService.open(content, {
      scrollable: true,
      size: 'md',
    });

    this.sliderRecord = this.sliders[index];
  }

  deleteRecord(): void {
    const id = this.sliderRecord.id;

    this.spinner.show();

    this.http.delete(this.path + 'deleteAgentSlider/' + id).subscribe(
      (resp: any) => {
        this.spinner.hide();

        if (resp.status) {
          this.notificationService.addToast({
            title: 'Success',
            msg: resp.message,
            type: 'success',
          });

          if (this.confirmDialogReference) {
            this.confirmDialogReference.close();
          }

          this.ResetAttributes();

          this.getAll();
        } else {
          this.notificationService.addToast({
            title: 'Error',
            msg: resp.message || 'Unable to delete slider.',
            type: 'error',
          });
        }
      },
      (error) => {
        this.spinner.hide();

        this.notificationService.addToast({
          title: 'Error',
          msg: error.error?.message || 'Unable to delete slider.',
          type: 'error',
        });
      },
    );
  }

  changeStatus(event: Event, id: any): void {
    console.log('=================================');
    console.log('CHANGE SLIDER STATUS');
    console.log('SLIDER ID:', id);
    console.log('=================================');

    if (!id) {
      this.notificationService.addToast({
        title: 'Error',
        msg: 'Slider ID not found.',
        type: 'error',
      });

      return;
    }

    this.spinner.show();

    this.http.put(this.path + 'changeAgentSliderStatus/' + id, {}).subscribe(
      (resp: any) => {
        this.spinner.hide();

        console.log('CHANGE STATUS RESPONSE:', resp);

        if (resp && resp.status === true) {
          this.notificationService.addToast({
            title: 'Success',
            msg: resp.message || 'Slider status updated successfully.',
            type: 'success',
          });

          /*
           * Reload the table so the badge changes
           * from Active <-> Pending immediately.
           */
          this.getAll();
        } else {
          this.notificationService.addToast({
            title: 'Error',
            msg:
              resp && resp.message
                ? resp.message
                : 'Unable to change slider status.',
            type: 'error',
          });
        }
      },

      (error) => {
        this.spinner.hide();

        console.error('CHANGE SLIDER STATUS ERROR:', error);

        this.notificationService.addToast({
          title: 'Error',
          msg:
            error && error.error && error.error.message
              ? error.error.message
              : 'Unable to change slider status.',
          type: 'error',
        });
      },
    );
  }

  updateDefault(slider: any): void {
    if (!slider.default_slider) {
      return;
    }

    this.spinner.show();

    this.http
      .put(this.path + 'changeAgentSliderDefault/' + slider.id, {})
      .subscribe(
        (resp: any) => {
          this.spinner.hide();

          if (resp.status) {
            this.notificationService.addToast({
              title: 'Success',
              msg: resp.message,
              type: 'success',
            });

            this.getAll();
          } else {
            this.notificationService.addToast({
              title: 'Error',
              msg: resp.message || 'Unable to update default slider.',
              type: 'error',
            });

            this.getAll();
          }
        },
        (error) => {
          this.spinner.hide();

          this.notificationService.addToast({
            title: 'Error',
            msg: error.error?.message || 'Unable to update default slider.',
            type: 'error',
          });

          this.getAll();
        },
      );
  }

  updateSequence(slider: any): void {
    if (
      slider.sequence === null ||
      slider.sequence === undefined ||
      slider.sequence === '' ||
      Number(slider.sequence) < 1
    ) {
      this.notificationService.addToast({
        title: 'Error',
        msg: 'Sequence must be greater than 0.',
        type: 'error',
      });

      return;
    }

    this.http
      .put(this.path + 'updateAgentSliderSequence/' + slider.id, {
        sequence: Number(slider.sequence),
      })
      .subscribe(
        (resp: any) => {
          if (resp.status) {
            this.notificationService.addToast({
              title: 'Success',
              msg: resp.message,
              type: 'success',
            });

            this.getAll();
          } else {
            this.notificationService.addToast({
              title: 'Error',
              msg: resp.message || 'Unable to update sequence.',
              type: 'error',
            });
          }
        },
        (error) => {
          this.notificationService.addToast({
            title: 'Error',
            msg: error.error?.message || 'Unable to update sequence.',
            type: 'error',
          });
        },
      );
  }

  closeModal(): void {
    if (this.modalReference) {
      this.modalReference.close();
    }

    this.ResetAttributes();
  }

  ngOnDestroy(): void {}
}
