import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../services/banner.service' ;
import { HttpClient } from '@angular/common/http';
import { Busoperator } from '../../model/busoperator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Banner} from '../../model/banner';
import {Constants} from '../../constant/constant' ;
import { NotificationService } from '../../services/notification.service';
import { BusOperatorService } from '../../services/bus-operator.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';

import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import * as _ from 'lodash';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-bannermanagement',
  templateUrl: './bannermanagement.component.html',
  styleUrls: ['./bannermanagement.component.scss']
})
export class BannermanagementComponent implements OnInit {

  per_page=Constants.RecordLimit;
  searchBy='';
  status=''; 
  bannerForm: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  operators: Busoperator[];
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  banners: Banner[];
  bannerRecord: Banner;
  imageSrc:any;
  iconSrc:any;
  imageError:any;
  imgURL: any;
  finalImage:any;
  public imagePath;
  users:any=[];


  path = Constants.PATHURL;

  base64result:any;
  finalJson = {};
  fileName= 'Banner.xlsx';
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
  public message: string;
  public pagination: any;
  public imageSizeFlag = true;
  all: any;

   
  constructor(private spinner: NgxSpinnerService,private bannerService: BannerService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private sanitizer: DomSanitizer, private busOperartorService:BusOperatorService,
    private userService: UserService
    )
     { 
        this.isSubmit = false;
        this.bannerRecord= {} as Banner;
        config.backdrop = 'static';
        config.keyboard = false;
        this.ModalHeading = "Add Banner Line";
        this.ModalBtn = "Save";
   }
   getAll(url:any=''){
            this.spinner.show();
            const data= {
              status:this.searchForm.value.status,
              searchBy:this.searchForm.value.searchBy,
              per_page:this.searchForm.value.per_page
            }; 
     this.bannerService.bannerDataTable(url,data).subscribe(
            res=>{    
              this.banners= res.data.data.data; 
              this.pagination = res.data.data;
              this.all = res.data;
              this.spinner.hide();
              // console.log(res.data.data.data);
            },
    );
   }
   refresh()
    {
      this.searchForm =this.fb.group({
        searchBy:[null],
        status:[null],
        banner_image:[null],
        per_page:Constants.RecordLimit,
      })
      this.getAll();
    }
    page(label:any){
      return label;
     }
   OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    this.spinner.show();

      ////// get all user list

      this.userService.getAllUser().subscribe(
        record=>{
        this.users=record.data;
        this.users.map((i: any) => { i.userData = i.name + '    (  ' + i.email  + '  )'; return i; });
        }
      );


    this.searchForm =this.fb.group({
      searchBy:[null],
      status:[null],
      banner_image:[null],
      per_page:Constants.RecordLimit,
    })
    this.bannerForm = this.fb.group({
      id:[null],
      occassion: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      category: [null],
      url:[null],
      heading:[null],
      user_id:[null, Validators.compose([Validators.required])],
      banner_img:[null],
      start_date: [null, Validators.compose([Validators.required])],
      start_time: [null, Validators.compose([Validators.required])],
      alt_tag: [null, Validators.compose([Validators.required])],
      end_date: [null, Validators.compose([Validators.required])],
      end_time: [null, Validators.compose([Validators.required])],
      iconSrc:[null]
    });
    this.finalImage = null;
    this.formConfirm=this.fb.group({
      id:[null],
    });
    this.getAll();
  }
 
  //////image validation////////
  public picked(event:any, fileSrc:any) {
    this.imageError = null;
            const max_size = 1000000;
            //const allowed_types = ['image/svg+xml'];
            const allowed_types = ['image/png','image/gif','image/jpeg','image/jpg','image/svg+xml'];
            const max_height = 600;
            const max_width = 2400;
    let fileList: FileList = event.target.files;
    this.imageSizeFlag = true;
    if (event.target.files[0].size > max_size) {
      this.imageError =
          'Maximum size allowed is ' + max_size/1024  + 'Kb';
          this.bannerForm.value.imagePath = '';
          this.imgURL='';
          this.imageSizeFlag = false;
      return false;
  }
  if (!_.includes(allowed_types, event.target.files[0].type)) {

      this.imageError = 'Only Images are allowed';
      this.bannerForm.value.imagePath = '';
      this.bannerForm.controls.banner_img.setValue('');
      this.imgURL='';
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
                this.bannerForm.value.imagePath = '';
                this.imgURL='';
            return false;
        } 
      };
  };
    if (fileList.length > 0) {
      const file: File = fileList[0];
      
        this.bannerForm.value.File = file;

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
    // if (!file.type.match(pattern)) {
    //   //alert('invalid format');
    //   return;
    // }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
    
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    this.imageSrc = this.base64result;
    this.bannerForm.value.banner_img=this.base64result;
    this.bannerForm.value.iconSrc=this.base64result;
    this.bannerForm.controls.iconSrc.setValue(this.base64result); 
  }
  preview(files) {
    if (files.length === 0)
      return;
    let mimeType = files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    let reader = new FileReader();
    this.bannerForm.value.imagePath = files[0];
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
    this.imgURL = reader.result; 
   
      this.finalImage= files[0];
      
    }

  }
  ResetAttributes()
  {
    this.bannerRecord = {} as Banner;
    this.bannerForm = this.fb.group({
      id:[null],
      occassion: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      // category: [null],
      url:[null],
      heading:[null],
      user_id:[null, Validators.compose([Validators.required])],
      banner_img:[null],
      start_date: [null, Validators.compose([Validators.required])],
      start_time: [null, Validators.compose([Validators.required])],
      alt_tag: [null, Validators.compose([Validators.required])],
      end_date: [null, Validators.compose([Validators.required])],
      end_time: [null, Validators.compose([Validators.required])],
      iconSrc:[null],
      banner_image:[null],
    });
    this.ModalHeading = "Add Banner";
    this.ModalBtn = "Save";
    this.imgURL="";
    this.imageSrc="";
    this.bannerRecord.banner_img="";  
    this.busOperartorService.readAll().subscribe(
      record=>{
      this.operators=record.data;
      this.operators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });
      }
    );
  }
  addBanner()
  {
    this.spinner.show();
    let fd: any = new FormData();
    fd.append("banner_img", this.finalImage);
    fd.append("user_id",this.bannerForm.value.user_id);
    fd.append("occassion",this.bannerForm.value.occassion);
    // fd.append("category",this.bannerForm.value.category);
    fd.append("url",this.bannerForm.value.url);
    fd.append("heading",this.bannerForm.value.heading);
    fd.append("start_date",this.bannerForm.value.start_date);
    fd.append("start_time",this.bannerForm.value.start_time);
    fd.append("alt_tag",this.bannerForm.value.alt_tag);
    fd.append("end_date",this.bannerForm.value.end_date);
    fd.append("end_time",this.bannerForm.value.end_time);
    fd.append("created_by",localStorage.getItem('USERNAME'));

  //   for (var pair of fd.entries()) {
  //     console.log(pair[0]+ ', ' + pair[1]); 
  // }
  // return false;
    let id = this.bannerRecord?.id;
    if (id != null) {
      fd.append("id",this.bannerRecord.id); 

        // for (var pair of fd.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]); 
        // }
        // return false;

      this.bannerService.update(fd).subscribe(
        resp => {
          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.getAll();
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
            this.spinner.hide();
          }
        }
      );
    }
    else {

      this.bannerService.create(fd).subscribe(
        resp => {
          if (resp.status == 1) {

            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.getAll(); 
          }
          else {

            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
            this.spinner.hide();
          }
        }
      );
    }
  }
  ngAfterViewInit(): void {   
  }
  ngOnDestroy(): void {  
  }
  rerender(): void {  
  }
  editBanner(id)
  { this.imgURL='';
    this.bannerRecord = this.banners[id]; 

    this.bannerForm=this.fb.group({
      id:[this.bannerRecord.id],
      user_id:this.bannerRecord.user_id,
      occassion:[this.bannerRecord.occassion],
      // category:[this.bannerRecord.category],
      url:[this.bannerRecord.url],
      heading:[this.bannerRecord.heading],
      start_date:[this.bannerRecord.start_date],
      start_time:[this.bannerRecord.start_time],
      alt_tag:[this.bannerRecord.alt_tag],
      end_date:[this.bannerRecord.end_date],
      end_time:[this.bannerRecord.end_time],
      banner_img: [],
      iconSrc:[this.bannerRecord.banner_img]
    });

    this.busOperartorService.readAll().subscribe(
      record=>{
      this.operators=record.data;
      this.operators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });
      }
    );
  
    this.ModalHeading = "Edit Banner";
    this.ModalBtn = "Update";  
  }
  getBannerImagepath(banner_img :any){
    let objectURL = 'data:image/*;base64,'+banner_img;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
   }

  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.bannerRecord = this.banners[id];  
  }
  deleteRecord() {
    
    let delitem = this.bannerRecord.id;
    this.bannerService.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.confirmDialogReference.close();
          this.ResetAttributes();
          this.getAll();         
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      });
  }
  changeStatus(event : Event, stsitem:any)
  {
    this.spinner.show();
    this.bannerService.chngsts(stsitem).subscribe(
      resp => {
        if(resp.status==1)
        {
            this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
            this.rerender();
            this.getAll();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
      }
    );
  }

}
