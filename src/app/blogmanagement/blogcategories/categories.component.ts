import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../services/banner.service';
import { HttpClient } from '@angular/common/http';
import { Busoperator } from '../../model/busoperator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Banner } from '../../model/banner';
import { Constants } from '../../constant/constant';
import { NotificationService } from '../../services/notification.service';
import { BusOperatorService } from '../../services/bus-operator.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as _ from 'lodash';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})


export class CategoryComponent implements OnInit {

  private apiURL = Constants.BASE_URL;

  per_page = Constants.RecordLimit;
  searchBy = '';
  status = '';
  public searchForm: FormGroup;
  operators: Busoperator[];
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  banners: Banner[];
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
  blogCategorydata: any;
  singlblog: any;


  selectedFile!: File;

  blgogcat: any;
  blogRecord: any;
  formConfirm: FormGroup;



  constructor(private spinner: NgxSpinnerService, private bannerService: BannerService, private http: HttpClient, private notificationService: NotificationService, private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal, private sanitizer: DomSanitizer, private busOperartorService: BusOperatorService,
    private userService: UserService
  ) {
    this.isSubmit = false;
    this.bannerRecord = {} as Banner;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Banner Line";
    this.ModalBtn = "Save";
  }


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
      ['fontSize']
    ]
  };


  getAll(url: any = '') {
    this.spinner.show();
    const data = {
      status: this.searchForm.value.status,
      searchBy: this.searchForm.value.searchBy,
      per_page: this.searchForm.value.per_page,
      role_id: sessionStorage.getItem('ROLE_ID'),
      userID: sessionStorage.getItem('USERID'),
    };
    this.http.post(this.apiURL + "/blogcategory", "").subscribe((res: any) => {
      this.blogCategorydata = res.data;
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
      .replace(/\s+/g, '-')       // replace spaces with -
      .replace(/[^\w\-]+/g, '')   // remove special characters
      .replace(/\-\-+/g, '-');    // remove multiple -
  }


  openAddModal() {
    this.isEditMode = false;
    this.blogCategory.reset();
    this.ModalBtn = "Add Category";
  }

  editcategory(data: any) {
    this.isEditMode = true;
    console.log(this.isEditMode)
    this.ModalBtn = "Update Category";

    this.blogCategory.patchValue({
      id: data.id,  // 👈 very important
      category_name: data.category_name,
      slug: data.slug,
      icon: data.icon,
      description: data.description,
      meta_title: data.meta_title,
      meta_description: data.meta_description
    });

  }


  public addBlogCategory() {

    if (this.blogCategory.invalid) {
      this.blogCategory.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('category_name', this.blogCategory.get('category_name')?.value);
    formData.append('slug', this.blogCategory.get('slug')?.value);
    formData.append('description', this.blogCategory.get('description')?.value);
    formData.append('meta_title', this.blogCategory.get('meta_title')?.value);
    formData.append('meta_description', this.blogCategory.get('meta_description')?.value);
    formData.append('icon', this.blogCategory.get('icon')?.value);

    // ✅ Only append image if selected
    if (this.selectedFile) {
      formData.append('banner_image', this.selectedFile);
    }

    if (this.isEditMode) {

      const id = this.blogCategory.get('id')?.value;

      this.http.post(this.apiURL + "/blogcategory/" + id, formData)
        .subscribe((res: any) => {
          this.modalReference.close();
          this.getAll();
          console.log("Category Updated");
        });

    } else {

      this.http.post(this.apiURL + "/add-blogcategory", formData)
        .subscribe((res: any) => {
          this.modalReference.close();
          this.getAll();
          console.log("Added Successfully");
        });

    }
  }

  ngOnInit(): void {
    this.formConfirm = this.fb.group({
      id: ['']
    });
    this.spinner.show();
    this.role_id = sessionStorage.getItem('ROLE_ID');
    this.usre_name = sessionStorage.getItem('USERNAME');


    this.blogCategory = new FormGroup({
      id: new FormControl(null),
      category_name: new FormControl('', Validators.required),
      slug: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      icon: new FormControl('', Validators.required),
      banner_image: new FormControl(''),
      meta_title: new FormControl('', Validators.required),
      meta_description: new FormControl('', Validators.required),
    })

    // 👇 Auto generate slug
    this.blogCategory.get('category_name')?.valueChanges.subscribe(value => {
      const slug = this.generateSlug(value);
      this.blogCategory.get('slug')?.setValue(slug, { emitEvent: false });
    });


    this.searchForm = this.fb.group({
      searchBy: [null],
      status: [null],
      per_page: [Constants.RecordLimit],
    });

    this.finalImage = null;

    // NOW call API
    this.getallData();

    ////// get all user list

    this.userService.getAllUser().subscribe(
      record => {
        this.users = record.data;
        this.users.map((i: any) => { i.userData = i.name + '    (  ' + i.email + '  )'; return i; });
      }
    );


    // this.searchForm = this.fb.group({
    //   searchBy: [null],
    //   status: [null],
    //   per_page: Constants.RecordLimit,
    // })
    // this.finalImage = null;
    // this.getAll();
  }

  changeStatus(event: any, id: number) {

    console.log(this.apiURL)

    const confirmStatus = confirm('Are you sure you want to change status?');

    if (confirmStatus) {

      const data = {
        id: id
      };

      this.http.post(this.apiURL + '/change-blogcategory-status', data)
        .subscribe((res: any) => {

          if (res.status == 1) {

            // update local array without reload
            this.blogCategorydata.forEach((item: any) => {

              if (item.id == id) {

                item.active_status =
                  item.active_status == 1 ? 0 : 1;
              }
            });

          } else {
            alert(res.message);
          }

        }, error => {
          console.log(error);
        });

    }

  }

  public getallData() {

    const data = {
      searchBy: this.searchForm.value.searchBy,
      status: this.searchForm.value.status,
      per_page: this.searchForm.value.per_page
    };

    this.http.post(this.apiURL + "/blogcategory", data)
      .subscribe((res: any) => {

        this.blogCategorydata = res.data;
        this.spinner.hide();

      });

  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }


  ResetAttributes() {

    this.blogCategory.reset({
      id: null,
      category_name: '',
      slug: '',
      description: '',
      icon: '',
      banner_image: '',
      meta_title: '',
      meta_description: ''
    });

    this.selectedFile = null;
    this.isEditMode = false;

    this.ModalHeading = "Add Blog Category";
    this.ModalBtn = "Save";

  }

  openConfirmDialog(content, id: any) {
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
