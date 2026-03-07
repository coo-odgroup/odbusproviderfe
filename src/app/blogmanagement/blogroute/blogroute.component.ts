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
  selector: 'app-blogroute',
  templateUrl: './blogroute.component.html',
  styleUrls: ['./blogroute.component.scss']
})


export class BlogrouteComponent implements OnInit {

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
  routeform: any;
  blogList: any;
  locationdata: any;
  blogroutedata:any;


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
    this.routeform.reset();
    this.ModalBtn = "Add Category";
  }

  editcategory(data: any) {
    this.isEditMode = true;
    console.log(this.isEditMode)
    this.ModalBtn = "Update Tag";

    this.routeform.patchValue({
      id: data.id,
      tag_name: data.tag_name,
      slug: data.slug,
    });

  }


  public addTag() {

    if (this.routeform.invalid) {
      this.routeform.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('blog_id', this.routeform.get('blog_id')?.value);
    formData.append('from_city_id', this.routeform.get('from_city_id')?.value);
    formData.append('to_city_id', this.routeform.get('to_city_id')?.value);
    formData.append('route_slug', this.routeform.get('route_slug')?.value);

    if (this.isEditMode) {

      const id = this.routeform.get('id')?.value;

      console.log(formData)

      this.http.post(this.apiURL + "/tag/" + id, formData)
        .subscribe((res: any) => {
          this.modalReference.close();
          console.log("Tag Updated");
        });

    } else {

      this.http.post(this.apiURL + "/add-blogroute", formData)
        .subscribe((res: any) => {
          this.modalReference.close();
          console.log("Added Successfully");
        });

    }
  }

  generateRouteSlug() {

    const fromId = this.routeform.get('from_city_id')?.value;
    const toId = this.routeform.get('to_city_id')?.value;

    if (!fromId || !toId) return;

    if (fromId === toId) {
      alert("From and To city cannot be same");
      this.routeform.get('to_city_id')?.setValue('');
      return;
    }

    const fromCity = this.locationdata.find(x => x.id == fromId);
    const toCity = this.locationdata.find(x => x.id == toId);

    if (fromCity && toCity) {
      const slug = `${fromCity.url}-${toCity.url}`;
      this.routeform.get('route_slug')?.setValue(slug);
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    this.role_id = localStorage.getItem('ROLE_ID');
    this.usre_name = localStorage.getItem('USERNAME');


    this.routeform = new FormGroup({
      id: new FormControl(null),
      blog_id: new FormControl('', Validators.required),
      from_city_id: new FormControl('', Validators.required),
      to_city_id: new FormControl('', Validators.required),
      route_slug: new FormControl('', Validators.required),
    })

    this.routeform.get('from_city_id')?.valueChanges.subscribe(() => {
      this.generateRouteSlug();
    });

    this.routeform.get('to_city_id')?.valueChanges.subscribe(() => {
      this.generateRouteSlug();
    });



    this.searchForm = this.fb.group({
      searchBy: [null],
      status: [null],
      banner_image: [null],
      per_page: Constants.RecordLimit,
    })
    this.finalImage = null;
    this.getAll();
    this.getAllblog();
    this.getallLocation();
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
    this.http.post(this.apiURL + "/blogroute", "").subscribe((res: any) => {
      this.blogroutedata = res.data;
      this.spinner.hide();
    })
  }

  public getAllblog() {
    this.http.post(this.apiURL + "/blog", "").subscribe((res: any) => {
      this.blogList = res.data;
    })
  }


  public getallData() {
    this.http.post(this.apiURL + "/tag", "").subscribe((res: any) => {
      this.tagdata = res.data;
    })
  }

  public getallLocation() {
    this.http.get(this.apiURL + "/locations").subscribe((res: any) => {
      this.locationdata = res.data;
    })
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }


  ResetAttributes() {

    this.routeform.reset({
      id: null,
      tag_name: '',
      slug: '',
    });

    this.isEditMode = false;

    this.ModalHeading = "Add Blog Route";
    this.ModalBtn = "Save";

  }

  openConfirmDialog(content: any, id: any) {
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
