import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Busoperator } from '../../model/busoperator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Banner } from '../../model/banner';
import { Constants } from '../../constant/constant';
import { NotificationService } from '../../services/notification.service';
import { BusOperatorService } from '../../services/bus-operator.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as _ from 'lodash';
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
  operators: Busoperator[];
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  bannerRecord: Banner;
  imageSrc: any;
  iconSrc: any;
  imageError: any;
  imgURL: any;
  finalImage: any;
  public imagePath: any;
  users: any = [];


  path = Constants.PATHURL;

  base64result: any;
  finalJson = {};
  fileName = 'Banner.csv';
  public isSubmit: boolean;
  public mesgdata: any;
  public ModalHeading: any;
  public ModalBtn: any;
  public message: any;
  public pagination: any;
  public imageSizeFlag = true;
  all: any;
  role_id: any;
  usre_name: any;

  isEditMode: boolean = false;

  blogCategory: any;
  tagdata: any;
  singlblog: any;


  selectedFile!: File;

  blgogcat: any;
  blogRecord: any;
  tagform: any;


  constructor(private spinner: NgxSpinnerService, private http: HttpClient, private notificationService: NotificationService, private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal,
  ) {
    this.isSubmit = false;
    this.bannerRecord = {} as Banner;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Banner Line";
    this.ModalBtn = "Save";
  }

  getAll(url: any = '') {
    this.spinner.show();
    const data = {
      status: this.searchForm.value.status,
      searchBy: this.searchForm.value.searchBy,
      per_page: this.searchForm.value.per_page,
      role_id: localStorage.getItem('ROLE_ID'),
      userID: localStorage.getItem('USERID'),
    };
    this.http.post(this.apiURL + "/tag", "").subscribe((res: any) => {
      this.tagdata = res.data;
      this.spinner.hide();
    })
  }
  refresh() {
    this.searchForm = this.fb.group({
      searchBy: [null],
      status: [null],
      banner_image: [null],
      per_page: Constants.RecordLimit,
    })
    this.getAll();
  }
  page(label: any) {
    return label;
  }
  OpenModal(content: any) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }

  generateSlug(value: string): string {
    if (!value) return '';

    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }


  openAddModal() {
    this.isEditMode = false;
    this.tagform.reset();
    this.ModalBtn = "Add Category";
  }

  editcategory(data: any) {
    this.isEditMode = true;
    console.log(this.isEditMode)
    this.ModalBtn = "Update Tag";

    this.tagform.patchValue({
      id: data.id,
      tag_name: data.tag_name,
      slug: data.slug,
    });

  }


  public addTag() {

    if (this.tagform.invalid) {
      this.tagform.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('tag_name', this.tagform.get('tag_name')?.value);
    formData.append('slug', this.tagform.get('slug')?.value);

    if (this.isEditMode) {

      const id = this.tagform.get('id')?.value;

      console.log(formData)

      this.http.post(this.apiURL + "/tag/" + id, formData)
        .subscribe((res: any) => {
          this.modalReference.close();
          console.log("Tag Updated");
        });

    } else {

      this.http.post(this.apiURL + "/add-tag", formData)
        .subscribe((res: any) => {
          this.modalReference.close();
          console.log("Added Successfully");
        });

    }
  }

  ngOnInit(): void {
    this.spinner.show();
    this.role_id = localStorage.getItem('ROLE_ID');
    this.usre_name = localStorage.getItem('USERNAME');


    this.tagform = new FormGroup({
      id: new FormControl(null),
      tag_name: new FormControl('', Validators.required),
      slug: new FormControl('', Validators.required),
    })

    this.tagform.get('tag_name')?.valueChanges.subscribe((value: any) => {
      const slug = this.generateSlug(value);
      this.tagform.get('slug')?.setValue(slug, { emitEvent: false });
    });

    ////// get all user list

    // this.userService.getAllUser().subscribe(
    //   record => {
    //     this.users = record.data;
    //     this.users.map((i: any) => { i.userData = i.name + '    (  ' + i.email + '  )'; return i; });
    //   }
    // );


    this.searchForm = this.fb.group({
      searchBy: [null],
      status: [null],
      banner_image: [null],
      per_page: Constants.RecordLimit,
    })
    this.finalImage = null;
    this.getAll();
  }


  public getallData() {
    this.http.post(this.apiURL + "/tag", "").subscribe((res: any) => {
      this.tagdata = res.data;
    })
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }


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

  openConfirmDialog(content:any, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.blogRecord = id;
  }
  deleteRecord() {

    let delitem = this.blogRecord;
    this.http.delete(this.apiURL + '/delete-blogcategory/' + delitem).subscribe((res: any) => {
      this.notificationService.addToast({ title: 'Success', msg: "Deleted successfully", type: 'success' });
      this.confirmDialogReference.close();
      this.ResetAttributes();
      this.getAll();
    })
  }

}
