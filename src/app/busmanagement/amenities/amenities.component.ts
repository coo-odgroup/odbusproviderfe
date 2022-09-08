import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Amenities } from '../../model/amenities';
import { AmenitiesService } from '../../services/amenities.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { Subject } from 'rxjs';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from '../../constant/constant';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class AmenitiesComponent implements OnInit {

  @ViewChild("addnew") addnew;
  public form: FormGroup;
  public form1: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  statusDialogReference: NgbModalRef;
  Amenities: Amenities[];
  AmenitiesRecord: Amenities;
  imgURL: any;
  path = Constants.PATHURL;
  //Image upload
  File: any;
  //base64s
  imageSrc: string;
  //json
  finalJson = {};
  base64result: any;
  iconSrc: any;
  imageError: string;
  public isSubmit: boolean;
  public mesgdata: any;
  public ModalHeading: any;
  public ModalBtn: any;
  pagination: any;
  all: any;
  androidURL: string | ArrayBuffer;
  finalAndroidImage: any;
  android_img_Error: string;
  finalImage: any;
 
  constructor(private http: HttpClient, private AmenitiesService: AmenitiesService, private notificationService: NotificationService, private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal, private sanitizer: DomSanitizer , private spinner: NgxSpinnerService,) {
    this.isSubmit = false;
    this.AmenitiesRecord = {} as Amenities;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Amenities";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'lg' });
  }
  statusDialog(content) {
    this.statusDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
  }
  ngOnInit(): void {

    this.spinner.show();
    this.form1 = this.fb.group({
      id: [null],
      reason: [null, Validators.compose([Validators.required])]
    });

    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.required, Validators.maxLength(20)])],
      icon: [null],
      iconSrc: [null],
      android_image: [null],
      androidSrc: [null]
    });

    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
    });

    this.search();
  }
  page(label: any) {
    return label;
  }

  search(pageurl = "") {
    this.spinner.show();
    const data = {
      name: this.searchForm.value.name,
      rows_number: this.searchForm.value.rows_number,
      USER_BUS_OPERATOR_ID:localStorage.getItem('USER_BUS_OPERATOR_ID'),
      user_role:localStorage.getItem('ROLE_ID'),
      user_id:localStorage.getItem('USERID')
    };
    if (pageurl != "") {

      this.AmenitiesService.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.Amenities = res.data.data.data;
          this.pagination = res.data.data;
          this.all =res.data;  
          this.spinner.hide();
        }
      );
    }
    else { 
      this.AmenitiesService.getAllData(data).subscribe(
        res => {
          this.Amenities = res.data.data.data;
          this.pagination = res.data.data;
          this.all =res.data;
          this.spinner.hide();
        }
      );
    }
  }
  refresh() {
    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
    });
    this.search(); 
     this.spinner.hide();

  }
  title = 'angular-app';
  fileName = 'Amenities.csv';

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
  ResetAttributes() {
    this.finalAndroidImage=[];
    this.finalImage=[];
    this.AmenitiesRecord = {
      name: ''
    } as Amenities;
    this.ModalHeading = "Add Amenities";
    this.ModalBtn = "Save";
    this.AmenitiesRecord.icon = "";
    this.imgURL = "";
    this.androidURL = "";
    this.imageSrc = "";
    this.iconSrc = "";
    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.required, Validators.maxLength(20)])],
      icon: [null],
      iconSrc: [null],
      android_image: [null],
      androidSrc: [null]
    });

  }


  addAmenities() {
    this.spinner.show();
    let id: any = this.form.value.id;
    let fd: any = new FormData();
    fd.append("id",this.form.value.id);
    fd.append("android_image", this.finalAndroidImage);
    fd.append("icon", this.finalImage);
    fd.append("name",this.form.value.name);
    fd.append("created_by",localStorage.getItem('USERNAME'));
    fd.append("user_id",localStorage.getItem('USERID'));

    
  //   for (var pair of fd.entries()) {
  //     console.log(pair[0]+ ', ' + pair[1]); 
  // }
  // return false;
    if (id == null) { 
      this.AmenitiesService.create(fd).subscribe(
        resp => {
          // console.log(resp);
          // return;
          if (resp.status == 1) {
            //this.closebutton.nativeElement.click();
            this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.refresh();
          }
          else {
            // let errObj=JSON.parse(resp.message);
            // this.notificationService.addToast({ title: 'Error', msg: errObj.name, type: 'error' });

            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
            this.spinner.hide();
          }
        }
      );
    }
    else {
      this.AmenitiesService.update(fd).subscribe(
        resp => {
          if (resp.status == 1) {
            //this.closebutton.nativeElement.click();
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.ResetAttributes();
            this.modalReference.close();
            this.refresh();
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
            this.spinner.hide();
          }
        }
      );
    }
  }

  editAmenities(event: Event, id: any) {
    this.ModalHeading = "Edit Amenities";
    this.ModalBtn = "Update";
    this.AmenitiesRecord = this.Amenities[id];
    //this.imgURL = this.AmenitiesRecord.icon;
    this.form = this.fb.group({
      id: [this.AmenitiesRecord.id],
      name: [this.AmenitiesRecord.name, Validators.compose([Validators.required, Validators.minLength(2), Validators.required, Validators.maxLength(20)])],
      icon: [],
      iconSrc: [this.AmenitiesRecord.icon],
      androidSrc: [this.AmenitiesRecord.android_image],
    });

  }
  openConfirmDialog(content) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'lg' });
  }
  deleteRecord() {
    this.spinner.show();
    let delitem = this.formConfirm.value.id;
    this.AmenitiesService.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: Constants.SuccessType });
          this.confirmDialogReference.close();
          this.refresh();
        }
        else {

          this.notificationService.addToast({ title: Constants.ErrorTitle, msg: resp.message, type: Constants.ErrorType });
         
        }
      });
  }
  changeStatus() {
    this.spinner.show();
    const data = {
      reason: this.form1.value.reason,
      id: this.form1.value.id
    };
    this.AmenitiesService.chngsts(data.id, data).subscribe(
      resp => {
        if (resp.status == 1) {
          //this.closebutton2.nativeElement.click();
          //info, success, wait, error, warning.
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.statusDialogReference.close();
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      }
    );
  }
  cs(id: any) {
    //this.AmenitiesRecord=this.Amenities[id] ;

    const data = {
      reason: this.form1.value.reason,
      id: this.form1.value.id
    };
    this.AmenitiesService.chngsts(id, data).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      }
    );
  }

  deleteAmenities(content, delitem: any) {
  
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.formConfirm = this.fb.group({
      id: [delitem]
    });
  }

  public picked(event: any, fileSrc: any) {
    //////image validation////////
    this.imageError = null;
    const max_size = 102400;
    const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
    const max_height = 100;
    const max_width = 200;
    let fileList: FileList = event.target.files;

    if (event.target.files[0].size > max_size) {
      this.imageError =
        'Maximum size allowed is ' + max_size / 1024 + 'Kb';
      this.form.value.imagePath = '';
      this.imgURL = '';
      return false;
    }

    if (!_.includes(allowed_types, event.target.files[0].type)) {
      this.imageError = 'Only Images are allowed ( JPG | PNG |JPEG)';
      this.form.value.imagePath = '';
      this.imgURL = '';
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = rs => {
        const img_height = rs.currentTarget['height'];
        const img_width = rs.currentTarget['width'];

        if (img_height > max_height && img_width > max_width) {
          this.imageError =
            'Maximum dimentions allowed ' +
            max_height +
            '*' +
            max_width +
            'px';
          this.form.value.imagePath = '';
          this.imgURL = '';
          return false;
        }
      };
    };
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.preview(fileSrc);
      this.form.patchValue({
        icon: file
      });
      this.handleInputChange(file); //turn into base64

    }
    else {
      //alert("No file selected");
    }
  }

  handleInputChange(files) {
    let file = files;
    let pattern = /image-*/;
    let reader = new FileReader();
    if (!file.type.match(pattern)) {
      //alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);

  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    //this.imageSrc = base64result;

    this.imageSrc = this.base64result;
    this.form.value.icon = this.base64result;
    this.form.value.iconSrc = this.base64result;

  }
  public imagePath;
  public message: string;

  preview(files) {
    if (files.length === 0)
      return;
     
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    let reader = new FileReader();
    this.form.value.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
    this.finalImage= files[0];
  }



  public pickedAndroidIcon(event: any) {
    let androidfileSrc=event.target.files[0];
     //////image validation////////
     this.android_img_Error = null;
     const max_size = 102400;
     const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
     const max_height = 100;
     const max_width = 200;
     let fileList: FileList = event.target.files;
 
     if (event.target.files[0].size > max_size) {
       this.android_img_Error =
         'Maximum size allowed is ' + max_size / 1024 + 'Kb';
       this.form.value.androidIconPath = '';
       this.androidURL = '';
       return false;
     }
 
     if (!_.includes(allowed_types, event.target.files[0].type)) {
       this.android_img_Error = 'Only Images are allowed ( JPG | PNG |JPEG)';
       this.form.value.androidIconPath = '';
       this.androidURL = '';
       return false;
     }
     const reader = new FileReader();
     reader.onload = (e: any) => {
       const image = new Image();
       image.src = e.target.result;
       image.onload = rs => {
         const img_height = rs.currentTarget['height'];
         const img_width = rs.currentTarget['width'];
 
         if (img_height > max_height && img_width > max_width) {
           this.android_img_Error =
             'Maximum dimentions allowed ' +
             max_height +
             '*' +
             max_width +
             'px';
           this.form.value.androidIconPath = '';
           this.androidURL = '';
           return false;
         }
       };
     };
 
     if (fileList.length > 0) {
       const file: File = fileList[0];
 
       this.form.value.File = file;
       
       
       this.androidIconhandleInputChange(file); //turn into base64   
     }
     else {
       //alert("No file selected");
     }
 
     this.androidpreview(androidfileSrc);
 
   }
 
   androidIconhandleInputChange(files) {
     let file = files;
     let pattern = /image-*/;
     let reader = new FileReader();
     if (!file.type.match(pattern)) {
       //alert('invalid format');
       return;
     }
     reader.onloadend = this._handleAndroidIconReaderLoaded.bind(this);
     reader.readAsDataURL(file);
 
   }
   _handleAndroidIconReaderLoaded(e) {
     let reader = e.target;
     this.base64result = reader.result.substr(reader.result.indexOf(',') + 1);
     //this.imageSrc = base64result;
 
     this.androidURL = this.base64result;
     this.form.value.android_image = this.base64result;
     this.form.value.androidSrc = this.base64result;
 
   }
   public androidIconPath;
   public AndroidIconmessage: string;
 
   androidpreview(files) {
   
     if (files.length === 0)
       return;
 
         
     let mimeType = files.type;
     if (mimeType.match(/image\/*/) == null) {
       this.AndroidIconmessage = "Only images are supported.";
       return;
     }
 
     let reader = new FileReader();
     this.form.value.androidIconPath = files;
     reader.readAsDataURL(files);
     reader.onload = (_event) => {
     this.androidURL = reader.result;
    
       this.finalAndroidImage= this.form.value.androidIconPath;
     //  console.log(this.finalAndroidImage);
     
       
     }
   }

   
}
