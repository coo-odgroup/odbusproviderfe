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
import { NgxSpinnerService } from "ngx-spinner";

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
  bus_image_1: [];
  bus_image_5: [];
  bus_image_4: [];
  bus_image_3: [];
  bus_image_2: [];
  img_1: any;
  img_2: any;
  img_3: any;
  img_5: any;
  img_4: any;

  role =localStorage.getItem('ROLE_ID');
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private busgalleryService: BusgalleryService,
    private busOperatorService: BusOperatorService,
    private busService: BusService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    config: NgbModalConfig,  private spinner: NgxSpinnerService,
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
  fileName = 'Bus-Gallery.csv';

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
  imageBusImage1(event: any)
  {
    let Img_1=event.target.files[0];
    if (Img_1.length === 0)
    return;
    this.bus_image_1= Img_1;
  }
  imageBusImage2(event: any)
  {
    let Img_2=event.target.files[0];
    if (Img_2.length === 0)
    return;
    this.bus_image_2= Img_2;
  }
  imageBusImage3(event: any)
  {
    let Img_3=event.target.files[0];
    if (Img_3.length === 0)
    return;
    this.bus_image_3= Img_3;
  }
  imageBusImage4(event: any)
  {
    let Img_4=event.target.files[0];
    if (Img_4.length === 0)
    return;
    this.bus_image_4= Img_4;
  }
  imageBusImage5(event: any)
  {
    let Img_5=event.target.files[0];
    if (Img_5.length === 0)
    return;
    this.bus_image_5= Img_5;
  }

  saveGallery() {
    this.spinner.show();
    this.finalJson = {
      "File": this.imageSrc,
    }

    let id: any = this.busForm.value.id;
    let fd: any = new FormData();
    fd.append("id",this.busForm.value.id);
    fd.append("bus_image_1", this.bus_image_1);
    fd.append("bus_image_2", this.bus_image_2);
    fd.append("bus_image_3", this.bus_image_3);
    fd.append("bus_image_4", this.bus_image_4);
    fd.append("bus_image_5", this.bus_image_5);
    fd.append("bus_operator_id",this.busForm.value.bus_operator_id);
    fd.append("bus_id",this.busForm.value.bus_id);
    fd.append("created_by",localStorage.getItem('USERNAME'));
    
  // for (var pair of fd.entries()) {
  // console.log(pair[0]+ ', ' + pair[1]); 
  // }
  // return false;

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
            this.spinner.hide();
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
            this.spinner.hide();
          }
        }
      );
    }
  }
    editGallery(event: Event,id:any) {
      this.ModalHeading = "Edit Bus Photos";
      this.ModalBtn = "Update";
      this.busGalleryRecord = this.busGallerries[id];
      // console.log(this.busGalleryRecord );
      // return
      this.busForm = this.fb.group({
        id: [this.busGalleryRecord.id],
        bus_id: [this.busGalleryRecord.bus_id, Validators.compose([Validators.required, Validators.minLength(2), Validators.required, Validators.maxLength(15)])],
        bus_operator_id: [this.busGalleryRecord.bus_operator_id, Validators.compose([Validators.required])],
        icon_1: [null],
        icon_2: [null],
        icon_3: [null],
        icon_4: [null],
        icon_5: [null],
      });
     this.img_1= this.busGalleryRecord.bus_image_1,
     this.img_2= this.busGalleryRecord.bus_image_2,
     this.img_3=this.busGalleryRecord.bus_image_3,
     this.img_4= this.busGalleryRecord.bus_image_4,
     this.img_5= this.busGalleryRecord.bus_image_5
    }
    ///////////////////////////////////////////
    

 
  ResetAttributes() {
    this.img_1= [];
    this.img_2= [];
    this.img_3= [];
    this.img_4= [];
    this.img_5= [];
    this.bus_image_1=[];
    this.bus_image_5=[];
    this.bus_image_4=[];
    this.bus_image_3=[];
    this.bus_image_2=[];
    this.busForm = this.fb.group({
      id: [null],
      bus_operator_id: [null, Validators.compose([Validators.required])],
      bus_id: [null, Validators.compose([Validators.required])],
      icon_1: [null],
      icon_2: [null],
      icon_3: [null],
      icon_4: [null],
      icon_5: [null],
      iconSrc: [null]
    });
    this.imgURL = "";
    this.imageSrc = "";
    this.busGalleryRecord.icon="";  
  }
  ngOnInit(): void {
    this.spinner.show();
    this.loadServices();

    this.bus_image_1=[];
    this.bus_image_5=[];
    this.bus_image_4=[];
    this.bus_image_3=[];
    this.bus_image_2=[];

    this.busForm = this.fb.group({
      id: [null],
      bus_operator_id: [null, Validators.compose([Validators.required])],
      bus_id: [null, Validators.compose([Validators.required])],
      icon_1: [null],
      icon_2: [null],
      icon_3: [null],
      icon_4: [null],
      icon_5: [null],
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
          this.spinner.hide();
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
    this.spinner.show();
    const data = {
      bus_id: this.searchForm.value.bus_id,
      bus_operator_id: this.searchForm.value.bus_operator_id,
      rows_number: this.searchForm.value.rows_number,
      USER_BUS_OPERATOR_ID:localStorage.getItem('BUS_OPERATOR_ID')
    };

    console.log(data);
    if (pageurl != "") {
      this.busgalleryService.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.busGallerries = res.data.data;
          this.pagination = res.data.links;
          this.spinner.hide();
          
          // console.log( this.busGallerries);
        }
      );
    }
    else {
      this.busgalleryService.getAllData(data).subscribe(
        res => {
          this.busGallerries = res.data.data;
          this.pagination = res.data;
          this.spinner.hide();
          // console.log(this.pagination);
        }
      );
    }


  }
  refresh() {
    this.spinner.show();
    this.searchForm = this.fb.group({
      bus_id: [null],
      bus_operator_id: [null],
      rows_number: Constants.RecordLimit,
    });
    this.loadServices();
    this.search();
   
   
  }

  loadServices() {
    if(localStorage.getItem('ROLE_ID')== '1'){
      this.busService.all().subscribe(
        res => {
          this.buses = res.data;
          this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });
        }
      );
    }
    else if(localStorage.getItem('ROLE_ID')== '4'){
      let operatorId=localStorage.getItem("BUS_OPERATOR_ID");
    if(operatorId)
    {
      this.busService.getByOperaor(operatorId).subscribe(
        res=>{
          this.buses=res.data;
          this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });

          
        }
      );
    }
    
    }

    const BusOperator={
      USER_BUS_OPERATOR_ID:localStorage.getItem("BUS_OPERATOR_ID")
    };
    if(BusOperator.USER_BUS_OPERATOR_ID!="" && localStorage.getItem('ROLE_ID')!= '1')
    {
      this.busOperatorService.readOne(BusOperator.USER_BUS_OPERATOR_ID).subscribe(
        record=>{
        this.busoperators=record.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });
        }
      );
    }
    else
    {
      this.busOperatorService.readAll().subscribe(
        record=>{
        this.busoperators=record.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });
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
          this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });

          
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
