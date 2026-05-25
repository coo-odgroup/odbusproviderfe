import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Busoperator } from '../../model/busoperator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Banner } from '../../model/banner';
import { Constants } from '../../constant/constant';
import { NotificationService } from '../../services/notification.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})

export class TagComponent implements OnInit {

  private apiURL = Constants.BASE_URL;

  per_page = Constants.RecordLimit;
  searchBy = '';
  status = '';

  public searchForm: FormGroup;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  bannerRecord: Banner;

  path = Constants.PATHURL;

  public isSubmit: boolean;
  public ModalHeading: any;
  public ModalBtn: any;

  role_id: any;
  usre_name: any;

  isEditMode: boolean = false;

  tagdata: any;
  blogRecord: any;

  tagform: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {

    this.isSubmit = false;
    this.bannerRecord = {} as Banner;

    config.backdrop = 'static';
    config.keyboard = false;

    this.ModalHeading = "Add Tag";
    this.ModalBtn = "Save";
  }

  ngOnInit(): void {

    this.role_id = sessionStorage.getItem('ROLE_ID');
    this.usre_name = sessionStorage.getItem('USERNAME');

    // Tag Form
    this.tagform = new FormGroup({
      id: new FormControl(null),
      tag_name: new FormControl('', Validators.required),
      slug: new FormControl('', Validators.required),
    });

    // Auto Slug
    this.tagform.get('tag_name')?.valueChanges.subscribe((value: any) => {

      const slug = this.generateSlug(value);

      this.tagform.get('slug')?.setValue(slug, {
        emitEvent: false
      });

    });

    // Search Form
    this.searchForm = this.fb.group({
      searchBy: [''],
      status: [''],
      per_page: [10]
    });

    this.getallData();
  }

  // ===========================
  // Get All Tags
  // ===========================

  public getallData() {

    this.spinner.show();

    const data = {
      searchBy: this.searchForm.value.searchBy,
      status: this.searchForm.value.status,
      per_page: this.searchForm.value.per_page
    };

    this.http.post(this.apiURL + "/tag", data)
      .subscribe((res: any) => {

        this.tagdata = res.data;

        this.spinner.hide();

      }, error => {

        this.spinner.hide();

      });

  }

  // ===========================
  // Refresh
  // ===========================

  refresh() {

    this.searchForm.reset({
      searchBy: '',
      status: '',
      per_page: 10
    });

    this.getallData();
  }

  // ===========================
  // Open Modal
  // ===========================

  OpenModal(content: any) {

    this.modalReference = this.modalService.open(content, {
      scrollable: true,
      size: 'xl'
    });

  }

  // ===========================
  // Generate Slug
  // ===========================

  generateSlug(value: string): string {

    if (!value) return '';

    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  // ===========================
  // Reset Form
  // ===========================

  ResetAttributes() {

    this.tagform.reset({
      id: null,
      tag_name: '',
      slug: '',
    });

    this.isEditMode = false;

    this.ModalHeading = "Add Tag";
    this.ModalBtn = "Save";
  }

  // ===========================
  // Edit Tag
  // ===========================

  editcategory(data: any) {

    this.isEditMode = true;

    this.ModalHeading = "Update Tag";
    this.ModalBtn = "Update";

    this.tagform.patchValue({
      id: data.id,
      tag_name: data.tag_name,
      slug: data.slug,
    });

  }

  // ===========================
  // Add / Update Tag
  // ===========================

  public addTag() {

    if (this.tagform.invalid) {

      this.tagform.markAllAsTouched();

      return;
    }

    const formData = new FormData();

    formData.append('tag_name', this.tagform.get('tag_name')?.value);
    formData.append('slug', this.tagform.get('slug')?.value);

    // =====================
    // Update
    // =====================

    if (this.isEditMode) {

      const id = this.tagform.get('id')?.value;

      this.http.post(this.apiURL + "/tag/" + id, formData)
        .subscribe((res: any) => {

          this.modalReference.close();

          this.notificationService.addToast({
            title: 'Success',
            msg: "Tag Updated Successfully",
            type: 'success'
          });

          this.getallData();

          this.ResetAttributes();

        });

    }

    // =====================
    // Add
    // =====================

    else {

      this.http.post(this.apiURL + "/add-tag", formData)
        .subscribe((res: any) => {

          this.modalReference.close();

          this.notificationService.addToast({
            title: 'Success',
            msg: "Tag Added Successfully",
            type: 'success'
          });

          this.getallData();

          this.ResetAttributes();

        });

    }

  }

  // ===========================
  // Status Change
  // ===========================

  changeStatus(event: any, id: any, currentStatus: any) {

    if (!confirm('Are you sure you want to change status?')) {
      return;
    }

    const newStatus = currentStatus == 1 ? 0 : 1;

    this.http.post(this.apiURL + '/change-tag-status/' + id, {
      active_status: newStatus
    }).subscribe((res: any) => {

      if (res.status == 1) {

        this.notificationService.addToast({
          title: 'Success',
          msg: 'Status Updated Successfully',
          type: 'success'
        });

        this.getallData();
      }

    });

  }

  // ===========================
  // Delete Modal
  // ===========================

  openConfirmDialog(content: any, id: any) {

    this.confirmDialogReference = this.modalService.open(content, {
      scrollable: true,
      size: 'md'
    });

    this.blogRecord = id;
  }

  // ===========================
  // Delete Tag
  // ===========================

  deleteRecord() {

    let delitem = this.blogRecord;

    this.http.delete(this.apiURL + '/tag/' + delitem)
      .subscribe((res: any) => {

        this.notificationService.addToast({
          title: 'Success',
          msg: "Deleted successfully",
          type: 'success'
        });

        this.confirmDialogReference.close();

        this.ResetAttributes();

        this.getallData();

      });

  }

}