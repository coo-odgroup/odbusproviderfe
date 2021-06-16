import { Component, OnInit, ViewChild } from '@angular/core';
import { BusService } from '../../services/bus.service';
import {Constants} from '../../constant/constant';
import { DataTablesResponse} from '../../model/datatable';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Bus } from '../../model/bus';
import {Busgallery} from '../../model/busgallery';
import {BusgalleryService} from '../../services/busgallery.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { count } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-busgallery',
  templateUrl: './busgallery.component.html',
  styleUrls: ['./busgallery.component.scss'],
  providers: [NgbModalConfig, NgbModal, NgbDropdownConfig]
})
export class BusgalleryComponent implements OnInit {
  public ModalHeading:any;
  public ModalBtn:any;
  public busForm: FormGroup;

  public busGallerries:Busgallery[];
  public busGalleryRecord:Busgallery;

  imgURL: any;
  imageSrc: string;
  File: any;
  finalJson = {};
  base64result:any;
  iconSrc:any;
  imageError: string;
  modalReference: NgbModalRef;
  @ViewChild("addnew") addnew;

  counter=0;
  constructor(private http: HttpClient, private busgalleryService:BusgalleryService, private busService:BusService, private notificationService: NotificationService,  private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal,dpconfig: NgbDropdownConfig) {
    this.busRecord={} as Bus; 
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Bus";
    this.ModalBtn = "Save";
    dpconfig.placement = 'top-left';
    dpconfig.autoClose = false;
  }
  @ViewChild("closebutton") closebutton;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  position = 'bottom-right';
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionsBus: any = {};
  dtSeatTypesOptions: any = {};
  dtSeatTypesOptionsData: any = {};
  buses: Bus[];
  busRecord: Bus;
  loadBus(){
    
    this.dtOptionsBus = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: 'lBfrtip',  
      order:["0","desc"], 
      aLengthMenu:[10, 25, 50, 100, "All"],
      language: {
        searchPlaceholder: "Find Bus",
        processing: "<img src='assets/images/loading.gif' width='30'>"
      },
        
      buttons: [
        { extend: 'copy', className: 'btn btn-sm btn-primary',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     } },
      { extend: 'print', className: 'btn btn-sm btn-danger',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     } },
      { extend: 'excel', className: 'btn btn-sm btn-info',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     } },
      
     {
      text:"Add",
      className: 'btn btn-sm btn-warning',init: function(api, node, config) {
        $(node).removeClass('dt-button')
      },
      action:() => {
       this.addnew.nativeElement.click();
      }
    }
    ],
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            Constants.BASE_URL+'/busDT',
            dataTablesParameters, {}
          ).subscribe(resp => {
           
            this.buses = resp.data.aaData;
            
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: resp.data.aaData
            });
          });
      },
      columns: [
      { data: 'id' },
      { data: 'name'},
      { data: 'via'}, 
      { data: 'bus_number'},
      { title:'Action',data: null,orderable:false},
    ]         
    }; 

   
  }
  OpenModal(content) {
   
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  saveGallery()
  {
    this.finalJson = {
      "File": this.imageSrc,
    }
    
    //let id=this.busGalleryRecord.id;  
    const data ={
      bus_id:this.busForm.value.bus_id,
      icon:this.busForm.value.iconSrc,
      created_by:'Admin',
    };
      this.busgalleryService.create(data).subscribe(
        resp => {
          if(resp.status==1)
          {
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:'success'});
              this.modalReference.close();
              this.ResetAttributes();
              this.rerender();
          }
          else{
              this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
          }
        }
      )
    
  }
  ResetAttributes()
  {
    this.busForm = this.fb.group({
      id:[null],
      bus_id: [null,Validators.compose([Validators.required])],
      icon: [null,Validators.compose([Validators.required])],
      iconSrc:[null]
    }); 
    this.imgURL="";
    this.imageSrc="";
  }
  ngOnInit(): void {
    this.loadBus();
    this.busForm = this.fb.group({
      id:[null],
      bus_id: [null,Validators.compose([Validators.required])],
      icon: [null,Validators.compose([Validators.required])],
      iconSrc:[null]
    }); 
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  public picked(event:any, fileSrc:any) {
    //////image validation////////
    this.imageError = null;
            const max_size = 1024000;
            const allowed_types = ['image/png', 'image/jpeg' ,'image/jpg'];
            const max_height = 100;
            const max_width = 200;
    let fileList: FileList = event.target.files;
    
    if (event.target.files[0].size > max_size) {
      this.imageError =
          'Maximum size allowed is ' + max_size/1024  + 'Kb';
          this.busForm.value.imagePath = '';
          this.imgURL='';
      return false;
  }

  if (!_.includes(allowed_types, event.target.files[0].type)) {
      this.imageError = 'Only Images are allowed ( JPG | PNG |JPEG)';
      this.busForm.value.imagePath = '';
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
                this.busForm.value.imagePath = '';
                this.imgURL='';
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
    this.busForm.value.icon=this.base64result;
    this.busForm.value.iconSrc=this.base64result;
    
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

}
