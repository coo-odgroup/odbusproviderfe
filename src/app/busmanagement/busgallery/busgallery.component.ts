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
  public isSubmit: boolean;
  imgURL: any;
  path = Constants.PATHURL;
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
    private modalService: NgbModal) 
    {
    this.busRecord = {} as Bus;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Bus Photos";
    this.ModalBtn = "Save";
    this.isSubmit = false;
    this.busGalleryRecord= {} as Busgallery;
   }


  title = 'angular-app';
  fileName = 'Bus-Gallery.xlsx';

  buses: Bus[];
  busRecord: Bus;



  OpenModal(content) {

    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'lg' });
  }


  // allBus() {
  //   this.busService.readAll().subscribe(
  //     resp => {
  //       this.buses = resp.data;
  //     });

  // }
  // readAll

  // galleryData() {
  //   this.busgalleryService.getAll().subscribe(
  //     resp => {
  //       this.busGallerries = resp.result;
  //     });
  // }

  saveGallery() {
    this.finalJson = {
      "File": this.imageSrc,
    }

    let id: any = this.busForm.value.id;
    let fd: any = new FormData();
    fd.append("id",this.busForm.value.id);
    fd.append("icon", this.busForm.get('icon').value);
    fd.append("bus_operator_id",this.busForm.value.bus_operator_id);
    fd.append("bus_id",this.busForm.value.bus_id);
    fd.append("created_by",localStorage.getItem('USERNAME'));
    // const data = {
    //   bus_operator_id:this.busForm.value.bus_operator_id,
    //   bus_id: this.busForm.value.bus_id,
    //   icon: this.busForm.value.iconSrc,
    //   created_by:localStorage.getItem('USERNAME'),
    // };

    if (id == null) { 
      this.busgalleryService.create(fd).subscribe(

        resp => {
          if (resp.status == 1) {
            this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes(); 
            this.refresh();
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          }
        }
      )
    }
    else {
      this.busgalleryService.update(fd).subscribe(
        resp => {
          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.ResetAttributes();
            this.modalReference.close();
            this.refresh();
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          }
        }
      );
    }
  }
    editGallery(event: Event,id:any) {
      this.ModalHeading = "Edit Bus Photos";
      this.ModalBtn = "Update";
      this.busGalleryRecord = this.busGallerries[id];
  
      this.imgURL = this.getBannerImagepath(this.busGalleryRecord.icon);
      this.busForm = this.fb.group({
        id: [this.busGalleryRecord.id],
        bus_id: [this.busGalleryRecord.bus_id, Validators.compose([Validators.required, Validators.minLength(2), Validators.required, Validators.maxLength(15)])],
        bus_operator_id: [this.busGalleryRecord.bus_operator_id, Validators.compose([Validators.required])],
        icon: [],
        iconSrc: [this.busGalleryRecord.icon]
      });
    }
    ///////////////////////////////////////////
    

 
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
    this.busGalleryRecord.icon="";  
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


    // this.allBus();
 
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
      //const file: File = fileList[0];
      const file: File = fileList[0];
      this.preview(fileSrc);
      this.busForm.patchValue({
        icon: file
      });
      //this.busForm.value.File = file;

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
          this.refresh();
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
      USER_BUS_OPERATOR_ID:localStorage.getItem('USER_BUS_OPERATOR_ID')
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
    this.loadServices();
    this.search();
   
  }

  loadServices() {

    this.busService.all().subscribe(
      res => {
        this.buses = res.data;
      }
    );
    const BusOperator={
      USER_BUS_OPERATOR_ID:localStorage.getItem("USER_BUS_OPERATOR_ID")
    };
    if(BusOperator.USER_BUS_OPERATOR_ID=="")
    {
      this.busOperatorService.readAll().subscribe(
        record=>{
        this.busoperators=record.data;
        }
      );
    }
    else
    {
      this.busOperatorService.readOne(BusOperator.USER_BUS_OPERATOR_ID).subscribe(
        record=>{
        this.busoperators=record.data;
        }
      );
    }

    
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
