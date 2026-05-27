import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../constant/constant';
import { NotificationService } from '../../services/notification.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-tagmap',
  templateUrl: './tagmap.component.html',
  styleUrls: ['./tagmap.component.scss']
})

export class TagmapComponent implements OnInit {

  private apiURL = Constants.BASE_URL;

  public searchForm!: FormGroup;
  public tagmapform!: FormGroup;
  public formConfirm!: FormGroup;

  modalReference!: NgbModalRef;
  confirmDialogReference!: NgbModalRef;

  role_id: any;
  usre_name: any;

  ModalHeading: any;
  ModalBtn: any;

  isEditMode: boolean = false;

  blogList: any[] = [];
  tagdata: any[] = [];
  tagmapdata: any[] = [];

  blogRecord: any;

  finalImage: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {

    config.backdrop = 'static';
    config.keyboard = false;

    this.ModalHeading = "Add Tag Map";
    this.ModalBtn = "Save";
  }

  ngOnInit(): void {

    this.role_id = sessionStorage.getItem('ROLE_ID');
    this.usre_name = sessionStorage.getItem('USERNAME');

    // ================= SEARCH FORM =================

    this.searchForm = this.fb.group({
      searchBy: [''],
      status: [''],
      per_page: [10]
    });

    // ================= CONFIRM FORM =================

    this.formConfirm = this.fb.group({
      id: ['']
    });

    // ================= TAG MAP FORM =================

    this.tagmapform = new FormGroup({
      id: new FormControl(null),
      blog_id: new FormControl('', Validators.required),
      tag_id: new FormControl([], Validators.required),
    });

    this.getAll();
    this.getAllblog();
    this.getAlltag();
  }

  // ================= GET ALL TAG MAP =================

  getAll() {

    this.spinner.show();

    const data = {
      searchBy: this.searchForm.value.searchBy,
      status: this.searchForm.value.status,
      per_page: this.searchForm.value.per_page
    };

    console.log(data);

    this.http.post(this.apiURL + "/tagmap", data)
      .subscribe((res: any) => {

        this.tagmapdata = res.data;

        this.spinner.hide();

      }, error => {

        this.spinner.hide();
        console.log(error);

      });
  }

  // ================= SEARCH =================

  public getallData() {

    this.getAll();

  }

  // ================= REFRESH =================

  refresh() {

    this.searchForm.reset({
      searchBy: '',
      status: '',
      per_page: 10
    });

    this.getAll();

  }

  // ================= GET BLOGS =================

  public getAllblog() {

    this.http.post(this.apiURL + "/blog", "")
      .subscribe((res: any) => {

        this.blogList = res.data;

      });

  }

  // ================= GET TAGS =================

  getAlltag() {

    this.http.post(this.apiURL + "/tag", "")
      .subscribe((res: any) => {

        this.tagdata = res.data;

      });

  }

  // ================= OPEN MODAL =================

  OpenModal(content: any) {

    this.modalReference = this.modalService.open(content, {
      scrollable: true,
      size: 'xl'
    });

  }

  // ================= RESET FORM =================

  ResetAttributes() {

    this.tagmapform.reset({
      id: null,
      blog_id: '',
      tag_id: [],
    });

    this.isEditMode = false;

    this.ModalHeading = "Add Tag Map";
    this.ModalBtn = "Save";

  }

  // ================= EDIT =================

  // edittagmap(data: any) {

  //   this.isEditMode = true;

  //   this.ModalHeading = "Update Tag Map";
  //   this.ModalBtn = "Update";

  //   this.tagmapform.patchValue({
  //     id: data.id,
  //     blog_id: data.blog_id,
  //     tag_id: [data.tag_id]
  //   });

  // }

  edittagmap(data: any) {

    this.isEditMode = true;
    this.ModalHeading = "Edit Tag Map";
    this.ModalBtn = "Update";
    // convert comma string to array
    const selectedTags = data.tag_ids
      ? data.tag_ids.split(',').map((id: any) => Number(id))
      : [];

    console.log(selectedTags);
    this.tagmapform.patchValue({

      id: data.blog_id,

      blog_id: Number(data.blog_id),

      tag_id: selectedTags

    });

  }

  // ================= ADD / UPDATE =================

  public addTagmap() {

    if (this.tagmapform.invalid) {

      this.tagmapform.markAllAsTouched();
      return;

    }

    const formData = new FormData();

    formData.append(
      'blog_id',
      this.tagmapform.get('blog_id')?.value
    );

    const tagIds = this.tagmapform.get('tag_id')?.value;

    tagIds.forEach((id: any) => {

      formData.append('tag_id[]', id);

    });

    // ================= UPDATE =================

    if (this.isEditMode) {

      const id = this.tagmapform.get('id')?.value;

      this.http.post(this.apiURL + "/tagmap/" + id, formData)
        .subscribe((res: any) => {

          this.notificationService.addToast({
            title: 'Success',
            msg: 'Tag Map Updated Successfully',
            type: 'success'
          });

          this.modalReference.close();

          this.ResetAttributes();

          this.getAll();

        });

    }

    // ================= ADD =================

    else {

      this.http.post(this.apiURL + "/add-tagmap", formData)
        .subscribe((res: any) => {

          this.notificationService.addToast({
            title: 'Success',
            msg: 'Tag Map Added Successfully',
            type: 'success'
          });

          this.modalReference.close();

          this.ResetAttributes();

          this.getAll();

        });

    }
  }

  // ================= DELETE DIALOG =================

  openConfirmDialog(content: any, id: any) {

    this.confirmDialogReference = this.modalService.open(content, {
      scrollable: true,
      size: 'md'
    });

    this.blogRecord = id;

  }

  // ================= DELETE =================

  deleteRecord() {

    let delitem = this.blogRecord;

    this.http.delete(this.apiURL + '/delete-tagmap/' + delitem)
      .subscribe((res: any) => {

        this.notificationService.addToast({
          title: 'Success',
          msg: "Deleted successfully",
          type: 'success'
        });

        this.confirmDialogReference.close();

        this.ResetAttributes();

        this.getAll();

      });

  }

}