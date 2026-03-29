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
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})


export class BlogComponent implements OnInit {

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

  blog: any;
  blogCategorydata: any;
  singlblog: any;

  blogForm!: FormGroup;   // For form
  blogList: any[] = [];
  blogcat: any;

  thumbImageFile: any;
  featuredImageFile: any;
  ogImageFile: any;

  blgogcat: any;
  blogRecord: any;


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


  changeStatus(event:any,id:any,data:any){
    return confirm('Are you sure');
  }



  // search(pageurl = "") {
  //   this.spinner.show();
  //   const data = {
  //     status: this.searchForm.value.status,
  //     searchBy: this.searchForm.value.searchBy,
  //     per_page: this.searchForm.value.per_page,
  //     role_id: localStorage.getItem('ROLE_ID'),
  //     userID: localStorage.getItem('USERID'),
  //   };
  //   this.bannerService.bannerDataTable(pageurl, data).subscribe(
  //     res => {
  //       this.banners = res.data.data.data;
  //       this.pagination = res.data.data;
  //       this.all = res.data;
  //       this.spinner.hide();
  //       // console.log(res.data.data.data);
  //     },
  //   );
  // }

  getAll(url: any = '') {
    this.spinner.show();
    const data = {
      status: this.searchForm.value.status,
      searchBy: this.searchForm.value.searchBy,
      per_page: this.searchForm.value.per_page,
      role_id: localStorage.getItem('ROLE_ID'),
      userID: localStorage.getItem('USERID'),
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
    this.blog.reset();
    this.ModalBtn = "Add Category";
  }

  existthumbImageFile: any
  existfeaturedImageFile: any
  existogImageFile: any

  editcategory(data: any) {
    this.isEditMode = true;
    this.thumbImageFile = null;
    this.featuredImageFile = null;
    this.ogImageFile = null;
    console.log(this.isEditMode)
    this.ModalBtn = "Update Blog";


    // existing images
    this.existthumbImageFile = data.thumb_image;
    this.existfeaturedImageFile = data.featured_image;
    this.existogImageFile = data.og_image;

    this.blog.patchValue({
      id: data.id,
      category_id: data.category_id,
      title: data.title,
      slug: data.slug,
      short_description: data.short_description,
      content: data.content,
      thumb_alt_text: data.thumb_alt_text,
      feature_alt_text: data.feature_alt_text,
      author_name: data.author_name,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      meta_keywords: data.meta_keywords,
      canonical_url: data.canonical_url
    });

  }


  onThumbImageChange(event: any) {
    if (event.target.files.length > 0) {
      this.thumbImageFile = event.target.files[0];
    }
  }

  onFeaturedImageChange(event: any) {
    if (event.target.files.length > 0) {
      this.featuredImageFile = event.target.files[0];
    }
  }

  onOgImageChange(event: any) {
    if (event.target.files.length > 0) {
      this.ogImageFile = event.target.files[0];
    }
  }


  public addblog() {
    const formData = new FormData();

    formData.append('category_id', this.blog.get('category_id')?.value);
    formData.append('title', this.blog.get('title')?.value);
    formData.append('slug', this.blog.get('slug')?.value);
    formData.append('short_description', this.blog.get('short_description')?.value);
    formData.append('content', this.blog.get('content')?.value);
    formData.append('thumb_alt_text', this.blog.get('thumb_alt_text')?.value);
    formData.append('feature_alt_text', this.blog.get('feature_alt_text')?.value);
    formData.append('author_name', this.blog.get('author_name')?.value);
    formData.append('meta_title', this.blog.get('meta_title')?.value);
    formData.append('meta_description', this.blog.get('meta_description')?.value);
    formData.append('meta_keywords', this.blog.get('meta_keywords')?.value);
    formData.append('canonical_url', this.blog.get('canonical_url')?.value);

    // ✅ Image fields
    if (this.thumbImageFile) {
      formData.append('thumb_image', this.thumbImageFile);
    }

    if (this.featuredImageFile) {
      formData.append('featured_image', this.featuredImageFile);
    }

    if (this.ogImageFile) {
      formData.append('og_image', this.ogImageFile);
    }

    if (this.isEditMode) {

      const id = this.blog.get('id')?.value;

      this.http.post(this.apiURL + "/blog/" + id, formData)
        .subscribe((res: any) => {
          this.modalReference.close();
          this.getallData();
          this.notificationService.addToast({ title: 'Success', msg: "Blog Updated Successfully", type: 'success' });
          this.blog.reset();
          console.log("Blog Updated");
        });

    } else {
      console.log(formData)
      this.http.post(this.apiURL + "/add-blog", formData)
        .subscribe((res: any) => {
          this.modalReference.close();
          this.getallData();
          this.notificationService.addToast({ title: 'Success', msg: "Blog Created Successfully", type: 'success' });
          this.blog.reset();
          console.log("Blog Created Successfully");
        });

    }
  }

  ngOnInit(): void {
    this.spinner.show();
    this.role_id = localStorage.getItem('ROLE_ID');
    this.usre_name = localStorage.getItem('USERNAME');


    this.blog = new FormGroup({
      id: new FormControl(null),
      category_id: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      slug: new FormControl('', Validators.required),
      short_description: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      thumb_alt_text: new FormControl(''),
      thumb_image: new FormControl(''),
      feature_alt_text: new FormControl('', Validators.required),
      featured_image: new FormControl('', Validators.required),
      author_name: new FormControl('', Validators.required),
      meta_title: new FormControl('', Validators.required),
      meta_description: new FormControl('', Validators.required),
      meta_keywords: new FormControl('', Validators.required),
      og_image: new FormControl('', Validators.required),
      canonical_url: new FormControl('', Validators.required),
    })

    // 👇 Auto generate slug
    this.blog.get('title')?.valueChanges.subscribe((value:any) => {
      const slug = this.generateSlug(value);
      this.blog.get('slug')?.setValue(slug, { emitEvent: false });
    });


    this.getallData();
    this.getcatallData();


    ////// get all user list

    this.userService.getAllUser().subscribe(
      record => {
        this.users = record.data;
        this.users.map((i: any) => { i.userData = i.name + '    (  ' + i.email + '  )'; return i; });
      }
    );


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
    this.http.post(this.apiURL + "/blog", "").subscribe((res: any) => {
      this.blogList = res.data;
    })
  }

  public getcatallData() {
    this.http.post(this.apiURL + "/blogcategory", "").subscribe((res: any) => {
      this.blogcat = res.data;
    })
  }

  // onFileChange(event: any) {
  //   this.selectedFile = event.target.files[0];
  // }


  ResetAttributes() {

    this.blog.reset({
      id: null,
      category_name: '',
      slug: '',
      description: '',
      icon: '',
      banner_image: '',
      meta_title: '',
      meta_description: ''
    });

    this.isEditMode = false;

    this.ModalHeading = "Add Blog";
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
