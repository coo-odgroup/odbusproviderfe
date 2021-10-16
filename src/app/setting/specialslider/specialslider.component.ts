import { Component, OnInit } from '@angular/core';
import { SpecialsliderService } from '../../services/specialslider.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {SpecialSlider} from '../../model/specialslider';
import {Constants} from '../../constant/constant' ;
import { NotificationService } from '../../services/notification.service';

import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import * as _ from 'lodash';

@Component({
  selector: 'app-specialslider',
  templateUrl: './specialslider.component.html',
  styleUrls: ['./specialslider.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class SpecialsliderComponent implements OnInit {

  per_page=Constants.RecordLimit;
  searchBy='';
  status=''; 
  sliderForm: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  sliders: SpecialSlider[];
  sliderRecord: SpecialSlider;
  imageSrc:any;
  iconSrc:any;
  imageError:any;
  imgURL: any;
  base64result:any;
  finalJson = {};
  fileName= 'Special-Slider.xlsx';
  sliderDefinations = [
    { id: 1, name: 'Bus Offers'},
    { id: 2, name: 'Festive Offers'},
  ];
  //sliderDefinations: ['offer1','offer2'];
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
  public message: string;
  public pagination: any;
  public imageSizeFlag = true;

  constructor(private specialsliderService: SpecialsliderService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private sanitizer: DomSanitizer)
     { 
        this.isSubmit = false;
        this.sliderRecord= {} as SpecialSlider;
        config.backdrop = 'static';
        config.keyboard = false;
        this.ModalHeading = "Add Slider Line";
        this.ModalBtn = "Save";
   }
   getAll(url:any=''){
    //let slider_img='data:image/svg+xml;charset=utf-8;base64,'+this.sliderRecord.slider_img;
            const data= {
              status:this.searchForm.value.status,
              searchBy:this.searchForm.value.searchBy,
              per_page:this.searchForm.value.per_page
            }; 
     this.specialsliderService.sliderDataTable(url,data).subscribe(
            res=>{    
              this.sliders= res.data.data.data; 
              this.pagination = res.data.data;
              //console.log(res.data.data);
            },
    );
   }
   refresh()
    {
      this.searchForm.reset();
      this.getAll();
    }
    page(label:any){
      return label;
     }
   OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    this.searchForm =this.fb.group({
      searchBy:[null],
      status:[null],
      per_page:Constants.RecordLimit,
    })
    this.sliderForm = this.fb.group({
      id:[null],
      occassion: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      category: [null],
      url:[null],
      slider_img:[null],
      start_date: [null, Validators.compose([Validators.required])],
      start_time: [null, Validators.compose([Validators.required])],
      alt_tag: [null, Validators.compose([Validators.required])],
      end_date: [null, Validators.compose([Validators.required])],
      end_time: [null, Validators.compose([Validators.required])],
      iconSrc:[null]
    });
    this.formConfirm=this.fb.group({
      id:[null],
    });
    this.getAll();
  }
 
  //////image validation////////
  public picked(event:any, fileSrc:any) {
    this.imageError = null;
            const max_size = 102400;
            //const allowed_types = ['image/svg+xml'];
            const allowed_types = ['image/x-png','image/gif','image/jpeg','image/jpg','image/svg+xml'];
            const max_height = 100;
            const max_width = 200;
    let fileList: FileList = event.target.files;
    this.imageSizeFlag = true;
    if (event.target.files[0].size > max_size) {
      this.imageError =
          'Maximum size allowed is ' + max_size/1024  + 'Kb';
          this.sliderForm.value.imagePath = '';
          this.imgURL='';
          this.imageSizeFlag = false;
      return false;
  }
  if (!_.includes(allowed_types, event.target.files[0].type)) {

      this.imageError = 'Only Images are allowed';
      this.sliderForm.value.imagePath = '';
      this.sliderForm.controls.slider_img.setValue('');
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
                this.sliderForm.value.imagePath = '';
                this.imgURL='';
            return false;
        } 
      };
  };
    if (fileList.length > 0) {
      const file: File = fileList[0];
      
        this.sliderForm.value.File = file;

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
    this.sliderForm.value.slider_img=this.base64result;
    this.sliderForm.value.iconSrc=this.base64result;
    this.sliderForm.controls.iconSrc.setValue(this.base64result); 
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
    this.sliderForm.value.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
      this.imgURL=this.sanitizer.bypassSecurityTrustResourceUrl(this.imgURL);
    }

  }
  ResetAttributes()
  {
    //this.sliderRecord = {} as SpecialSlider;
    this.sliderForm = this.fb.group({
      id:[null],
      occassion: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      category: [null],
      url:[null],
      slider_img:[null],
      start_date: [null, Validators.compose([Validators.required])],
      start_time: [null, Validators.compose([Validators.required])],
      alt_tag: [null, Validators.compose([Validators.required])],
      end_date: [null, Validators.compose([Validators.required])],
      end_time: [null, Validators.compose([Validators.required])],
      iconSrc:[null]
    });
    this.ModalHeading = "Add Special Slider";
    this.ModalBtn = "Save";
    this.imgURL="";
    this.imageSrc="";
    this.sliderRecord.slider_img="";  
  }
  addSlider()
  {

    this.finalJson = {
      "File": this.imageSrc,
    }

    const data ={
      occassion:this.sliderForm.value.occassion,
      category:this.sliderForm.value.category,
      url:this.sliderForm.value.url,
      start_date:this.sliderForm.value.start_date,
      start_time:this.sliderForm.value.start_time,
      alt_tag:this.sliderForm.value.alt_tag,
      end_date:this.sliderForm.value.end_date,
      end_time:this.sliderForm.value.end_time,
      //slider_img:this.sliderForm.value.slider_img,
      slider_img:this.sliderForm.value.iconSrc,
      created_by:'Admin',
    };
    let id = this.sliderRecord?.id;
    if (id != null) {
      this.specialsliderService.update(id, data).subscribe(
        resp => {
          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.getAll();
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          }
        }
      );
    }
    else {
      this.specialsliderService.create(data).subscribe(
        resp => {
          if (resp.status == 1) {

            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.getAll(); 
          }
          else {

            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
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
  editSlider(id)
  { 
    //console.log(this.sliders);
    this.sliderRecord = this.sliders[id]; 
    //console.log(this.sliderRecord);
    
    this.imgURL =this.sanitizer.bypassSecurityTrustResourceUrl(this.sliderRecord.slider_img); 
    //sliderImgPreview
    let objectURL = 'data:image/*;base64,'+ this.imgURL.changingThisBreaksApplicationSecurity;
   // $('#sliderImgPreview').attr('src', objectURL);

    this.sliderForm=this.fb.group({
      id:[this.sliderRecord.id],
      occassion:[this.sliderRecord.occassion],
      category:[this.sliderRecord.category],
      url:[this.sliderRecord.url],
      //slider_img:[this.sliderRecord.slider_img],
      start_date:[this.sliderRecord.start_date],
      start_time:[this.sliderRecord.start_time],
      alt_tag:[this.sliderRecord.alt_tag],
      end_date:[this.sliderRecord.end_date],
      end_time:[this.sliderRecord.end_time],
      slider_img: [],
      iconSrc:[this.sliderRecord.slider_img]
    });
    
    // this.sliderForm = this.fb.group({
    //   occassion: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
    //   category: [null],
    //   url:[null],
    //   slider_img:[null],
    //   start_date: [null, Validators.compose([Validators.required])],
    //   start_time: [null, Validators.compose([Validators.required])],
    //   alt_tag: [null, Validators.compose([Validators.required])],
    //   end_date: [null, Validators.compose([Validators.required])],
    //   end_time: [null, Validators.compose([Validators.required])],
    //   iconSrc:[this.sliderRecord.slider_img]
    // });
    this.ModalHeading = "Edit Special slider";
    this.ModalBtn = "Update";  
  }
  getBannerImagepath(slider_img :any){
    let objectURL = 'data:image/*;base64,'+slider_img;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
   }

  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    //this.sliderForm.controls.id.setValue(this.sliderRecord.id);
    this.sliderRecord = this.sliders[id];  
  }
  deleteRecord() {
    let delitem = this.sliderRecord.id;
    this.specialsliderService.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.confirmDialogReference.close();
          this.ResetAttributes();
          this.getAll();         
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
        }
      });
  }
  changeStatus(event : Event, stsitem:any)
  {
    this.specialsliderService.chngsts(stsitem).subscribe(
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
