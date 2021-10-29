import { Component, OnInit, ViewChild } from '@angular/core';
import { BusService } from '../../services/bus.service';
import { BusOperatorService } from './../../services/bus-operator.service';
import { Constants } from '../../constant/constant';
import { Subject } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Bus } from '../../model/bus';
import { Busgallery } from '../../model/busgallery';
import { BusgalleryService } from '../../services/busgallery.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { count } from 'rxjs/operators';
import * as _ from 'lodash';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-busgallery',
  templateUrl: './busgallery.component.html',
  styleUrls: ['./busgallery.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class BusgalleryComponent implements OnInit {
  public ModalHeading: any;
  public ModalBtn: any;
  public busForm: FormGroup;
  public searchForm: FormGroup;

  confirmDialogReference: NgbModalRef;

  public busGallerries: Busgallery[];
  public busGalleryRecord: Busgallery;

  imgURL: any;
  imageSrc: string;
  File: any;
  finalJson = {};
  base64result: any;
  iconSrc: any;
  imageError: string;
  modalReference: NgbModalRef;
  @ViewChild("addnew") addnew;

  counter = 0;
  busoperators: any;
  buss: any;
  pagination: any;
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private busgalleryService: BusgalleryService,
    private busOperatorService: BusOperatorService,
    private busService: BusService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal) {
    this.busRecord = {} as Bus;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Bus";
    this.ModalBtn = "Save";
  }


  title = 'angular-app';
  fileName = 'Bus-Gallery.xlsx';

  buses: Bus[];
  busRecord: Bus;



  OpenModal(content) {

    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'lg' });
  }


  allBus() {
    this.busService.readAll().subscribe(
      resp => {
        this.buses = resp.data;
      });

  }
  // readAll

  galleryData() {
    this.busgalleryService.getAll().subscribe(
      resp => {
        this.busGallerries = resp.result;
      });
  }

  saveGallery() {
    this.finalJson = {
      "File": this.imageSrc,
    }

    const data = {
      bus_operator_id:this.busForm.value.bus_operator_id,
      bus_id: this.busForm.value.bus_id,
      icon: this.busForm.value.iconSrc,
      created_by: 'Admin',
    };
    this.busgalleryService.create(data).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: 'success' });
          this.modalReference.close();
          this.ResetAttributes();
          this.galleryData();
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
        }
      }
    )

  }
  ResetAttributes() {
    this.busForm = this.fb.group({
      id: [null],
      bus_operator_id: [null, Validators.compose([Validators.required])],
      bus_id: [null, Validators.compose([Validators.required])],
      icon: [null, Validators.compose([Validators.required])],
      iconSrc: [null]
    });
    this.imgURL = "";
    this.imageSrc = "";
  }
  ngOnInit(): void {
    this.loadServices();

    this.busForm = this.fb.group({
      id: [null],
      bus_operator_id: [null, Validators.compose([Validators.required])],
      bus_id: [null, Validators.compose([Validators.required])],
      icon: [null, Validators.compose([Validators.required])],
      iconSrc: [null]
    });

    this.searchForm = this.fb.group({
      bus_id: [null],
      bus_operator_id: [null],
      rows_number: Constants.RecordLimit,
    });


    this.allBus();
    this.galleryData();
    this.search();


  }
 
  public picked(event: any, fileSrc: any) {
    //////image validation////////
    this.imageError = null;
    const max_size = 512000;
    const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
    const max_height = 100;
    const max_width = 200;
    let fileList: FileList = event.target.files;

    if (event.target.files[0].size > max_size) {
      this.imageError =
        'Maximum size allowed is ' + max_size / 1024 + 'Kb';
      this.busForm.value.imagePath = '';
      this.imgURL = '';
      return false;
    }

    if (!_.includes(allowed_types, event.target.files[0].type)) {
      this.imageError = 'Only Images are allowed ( JPG | PNG |JPEG)';
      this.busForm.value.imagePath = '';
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
          this.busForm.value.imagePath = '';
          this.imgURL = '';
          return false;
        }
      };
    };

    if (fileList.length > 0) {
      const file: File = fileList[0];

      this.busForm.value.File = file;

      this.handleInputChange(file); //turn into base64

    }
    else {
      //alert("No file selected");
    }

    this.preview(fileSrc);

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
    this.busForm.value.icon = this.base64result;
    this.busForm.value.iconSrc = this.base64result;

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
    this.busForm.value.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }


  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.busGalleryRecord = this.busGallerries[id];
  }

  deleteRecord() {

    let delitem = this.busGalleryRecord.id;
    this.busgalleryService.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.confirmDialogReference.close();
          this.ResetAttributes();
          this.galleryData();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
        }
      });
  }


  getBannerImagepath(slider_img: any) {
    let objectURL = 'data:image/*;base64,' + slider_img;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
  }

  page(label: any) {
    return label;
  }
  search(pageurl = "") {

    const data = {
      bus_id: this.searchForm.value.bus_id,
      bus_operator_id: this.searchForm.value.bus_operator_id,
      rows_number: this.searchForm.value.rows_number,
    };

    // console.log(data);
    if (pageurl != "") {
      this.busgalleryService.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.busGallerries = res.data.data;
          this.pagination = res.data.links;
          // console.log( this.busGallerries);
        }
      );
    }
    else {
      this.busgalleryService.getAllData(data).subscribe(
        res => {
          this.busGallerries = res.data.data;
          this.pagination = res.data;
          // console.log(this.busGallerries);
        }
      );
    }


  }
  refresh() {
    this.searchForm = this.fb.group({
      bus_id: [null],
      bus_operator_id: [null],
      rows_number: Constants.RecordLimit,
    });

    this.search();
  }

  loadServices() {

    this.busService.all().subscribe(
      res => {
        this.buss = res.data;
      }
    );

    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;

      }
    );
  }

  findOperator(event:any)
  {
    let operatorId=event.id;
    if(operatorId)
    {
      this.busService.getByOperaor(operatorId).subscribe(
        res=>{
          this.buses=res.data;
        }
      );
    }
    
  }



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



}
