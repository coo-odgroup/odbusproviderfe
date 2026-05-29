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
  public auther: any;
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

  private consumerfe_url = Constants.CONSUMERFE_URL


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


  changeStatus(event: any, id: any, currentStatus: any) {

    if (!confirm('Are you sure you want to change status?')) {
      return;
    }

    this.spinner.show();

    const newStatus = currentStatus == 1 ? 0 : 1;

    this.http.post(this.apiURL + '/change-blogstatus/' + id, { active_status: newStatus }).subscribe(
      (res: any) => {
        this.spinner.hide();

        if (res.status == 1) {
          this.notificationService.addToast({
            title: 'Success',
            msg: res.data,
            type: 'success'
          });
          this.getallData();
          this.refresh();
        } else {
          this.notificationService.addToast({
            title: 'Error',
            msg: res.data,
            type: 'error'
          });
        }
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  refresh() {

    this.searchForm.reset({
      searchBy: '',
      status: '',
      per_page: 10
    });

    this.getallData();
  }
  page(label: any) {
    return label;
  }
  OpenModal(content: any) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
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
      author_id: data.author_id,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      meta_keywords: data.meta_keywords,
      canonical_url: data.canonical_url,
      og_title: data.og_title,
      og_desc: data.og_desc,
      breadcrumb_schema: this.parseJSON(data.breadcrumb_schema),
      faq_schema: this.parseJSON(data.faq_schema),
      service_schema: this.parseJSON(data.service_schema)
    });

  }

  parseJSON(data: any) {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      return null;
    }
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
    formData.append('author_id', this.blog.get('author_id')?.value);
    formData.append('meta_title', this.blog.get('meta_title')?.value);
    formData.append('meta_description', this.blog.get('meta_description')?.value);
    formData.append('meta_keywords', this.blog.get('meta_keywords')?.value);
    formData.append('canonical_url', this.blog.get('canonical_url')?.value);
    formData.append('og_title', this.blog.get('og_title')?.value);
    formData.append('og_desc', this.blog.get('og_desc')?.value);
    formData.append('breadcrumb_schema', this.blog.get('breadcrumb_schema')?.value);
    formData.append('faq_schema', this.blog.get('faq_schema')?.value);
    formData.append('service_schema', this.blog.get('service_schema')?.value);

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
          console.log(res);
          this.getallData();
          console.log("Blog Updated");
        });

    } else {
      // console.log(formData)
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

  public getAllAuthors() {
    this.http.post(this.apiURL + "/get-allAuthors", "").subscribe((res: any) => {
      this.auther = res.data;
      console.log(this.auther)
    })
  }

  generateSlug(value: string): string {

    return value
      ?.toLowerCase()
      ?.trim()
      ?.replace(/[^a-z0-9\s-]/g, '')
      ?.replace(/\s+/g, '-')
      ?.replace(/-+/g, '-');

  }

  ngOnInit(): void {
    this.getAllAuthors();
    this.spinner.show();
    this.role_id = sessionStorage.getItem('ROLE_ID');
    this.usre_name = sessionStorage.getItem('USERNAME');


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
      author_id: new FormControl('', Validators.required),
      meta_title: new FormControl('', Validators.required),
      meta_description: new FormControl('', Validators.required),
      meta_keywords: new FormControl('', Validators.required),
      og_image: new FormControl('', Validators.required),
      canonical_url: new FormControl('', Validators.required),
      og_title: new FormControl('', Validators.required),
      og_desc: new FormControl('', Validators.required),
      breadcrumb_schema: new FormControl(''),
      faq_schema: new FormControl(''),
      service_schema: new FormControl(''),
    })

    // 👇 Auto generate slug
    // this.blog.get('title')?.valueChanges.subscribe((value: any) => {
    //   const slug = this.generateSlug(value);
    //   this.blog.get('slug')?.setValue(slug, { emitEvent: false });
    // });

    this.blog.get('title')?.valueChanges.subscribe((value: any) => {

      const slug = this.generateSlug(value);

      this.blog.get('slug')?.setValue(slug, { emitEvent: false });

      // category name/slug find from category list
      const categoryId = this.blog.get('category_id')?.value;

      const categoryData = this.blogcat.find(
        (x: any) => x.id == categoryId
      );

      const categorySlug = categoryData
        ? this.generateSlug(categoryData.category_name)
        : '';

      const canonicalUrl =
        `${this.consumerfe_url}blog/${categorySlug}/${slug}`;

      this.blog.get('canonical_url')
        ?.setValue(canonicalUrl, { emitEvent: false });

      // BREADCRUMB SCHEMA
      const breadcrumbSchema = {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home Page",
            "item": `${this.consumerfe_url}`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog Page",
            "item": `${this.consumerfe_url}blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": categoryData?.category_name || '',
            "item": `${this.consumerfe_url}blog/${categorySlug}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": value,
            "item": `${this.consumerfe_url}blog/${categorySlug}/${slug}`
          }
        ]
      };

      this.blog.get('breadcrumb_schema')
        ?.setValue(JSON.stringify(breadcrumbSchema, null, 2), {
          emitEvent: false
        });

    });


    // ALSO UPDATE WHEN CATEGORY CHANGES
    this.blog.get('category_id')?.valueChanges.subscribe((categoryId: any) => {

      const title = this.blog.get('title')?.value;

      const slug = this.generateSlug(title);

      const categoryData = this.blogcat.find(
        (x: any) => x.id == categoryId
      );

      const categorySlug = categoryData
        ? this.generateSlug(categoryData.category_name)
        : '';

      // CANONICAL URL
      const canonicalUrl =
        `${this.consumerfe_url}blog/${categorySlug}/${slug}`;

      this.blog.get('canonical_url')
        ?.setValue(canonicalUrl, { emitEvent: false });


      // BREADCRUMB SCHEMA
      const breadcrumbSchema = {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home Page",
            "item": `${this.consumerfe_url}`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog Page",
            "item": `${this.consumerfe_url}blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": categoryData?.category_name || '',
            "item": `${this.consumerfe_url}blog/${categorySlug}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": title,
            "item": `${this.consumerfe_url}blog/${categorySlug}/${slug}`
          }
        ]
      };

      this.blog.get('breadcrumb_schema')
        ?.setValue(JSON.stringify(breadcrumbSchema, null, 2), {
          emitEvent: false
        });

    });


    this.searchForm = this.fb.group({
      searchBy: [''],
      status: [''],
      category_id: [''],
      author_id: [''],
      per_page: [10]
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

    this.finalImage = null;
  }


  public getallData() {

    const data = {
      searchBy: this.searchForm.value.searchBy,
      status: this.searchForm.value.status,
      per_page: this.searchForm.value.per_page,
      category_id: this.searchForm.value.category_id,
      author_id: this.searchForm.value.author_id,
    };

    this.http.post(this.apiURL + "/blog", data)
      .subscribe((res: any) => {
        this.blogList = res.data;
        this.spinner.hide();
      });

  }

  public getcatallData() {
    this.http.post(this.apiURL + "/blogcategory", "").subscribe((res: any) => {
      this.blogcat = res.data;
    })
  }


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

  openConfirmDialog(content: any, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.blogRecord = id;
  }
  deleteRecord() {

    let delitem = this.blogRecord;
    this.http.delete(this.apiURL + '/delete-blog/' + delitem).subscribe((res: any) => {
      this.notificationService.addToast({ title: 'Success', msg: "Deleted successfully", type: 'success' });
      this.confirmDialogReference.close();
      this.ResetAttributes();
      this.getallData();
    })
  }

}
