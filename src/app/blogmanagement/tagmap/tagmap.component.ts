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
  selector: 'app-tagmap',
  templateUrl: './tagmap.component.html',
  styleUrls: ['./tagmap.component.scss']
})


export class TagmapComponent implements OnInit {

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
  tagmapform: any;
  blogList:any;
  tagmapdata:any;


  constructor(private spinner: NgxSpinnerService, private http: HttpClient, private notificationService: NotificationService, private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal,
  ) {
    this.isSubmit = false;
    this.bannerRecord = {} as Banner;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Banner Line";
    this.ModalBtn = "Save";
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
    this.tagmapform.reset();
    this.ModalBtn = "Add Category";
  }

  edittagmap(data: any) {
    this.isEditMode = true;
    console.log(this.isEditMode)
    this.ModalBtn = "Update TagMap";

    this.tagmapform.patchValue({
      id: data.id,
      blog_id: data.blog_id,
      tag_id: data.tag_id,
    });

  }


  public addTagmap() {

    if (this.tagmapform.invalid) {
      this.tagmapform.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('blog_id', this.tagmapform.get('blog_id')?.value);
    formData.append('tag_id', this.tagmapform.get('tag_id')?.value);

    if (this.isEditMode) {
      console.log(this.tagmapform.value)
      const id = this.tagmapform.get('id')?.value;

      console.log(id)

      this.http.post(this.apiURL + "/tagmap/" + id, formData)
        .subscribe((res: any) => {
          this.modalReference.close();
          console.log("Map Updated");
        });

    } else {

      this.http.post(this.apiURL + "/add-tagmap", formData)
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


    this.tagmapform = new FormGroup({
      id: new FormControl(null),
      blog_id: new FormControl('', Validators.required),
      tag_id: new FormControl('', Validators.required),
    })


    this.searchForm = this.fb.group({
      searchBy: [null],
      status: [null],
      banner_image: [null],
      per_page: Constants.RecordLimit,
    })
    this.finalImage = null;
    this.getAll();
    this.getAlltag();
    this.getAllblog();
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
    this.http.post(this.apiURL + "/tagmap", "").subscribe((res: any) => {
      this.tagmapdata = res.data;
      this.spinner.hide();
    })
  }

  public getAllblog() {
    this.http.post(this.apiURL + "/blog", "").subscribe((res: any) => {
      this.blogList = res.data;
    })
  }


  getAlltag(url: any = '') {
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


  public getallData() {
    this.http.post(this.apiURL + "/tag", "").subscribe((res: any) => {
      this.tagdata = res.data;
    })
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }


  ResetAttributes() {

    this.tagmapform.reset({
      id: null,
      blog_id: '',
      tag_id: '',
    });

    this.isEditMode = false;

    this.ModalHeading = "Add Tag Map";
    this.ModalBtn = "Save";

  }

  openConfirmDialog(content: any, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.blogRecord = id;
  }
  deleteRecord() {

    let delitem = this.blogRecord;
    this.http.delete(this.apiURL + '/delete-tagmap/' + delitem).subscribe((res: any) => {
      this.notificationService.addToast({ title: 'Success', msg: "Deleted successfully", type: 'success' });
      this.confirmDialogReference.close();
      this.ResetAttributes();
      this.getAll();
    })
  }

}
