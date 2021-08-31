import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Amenities} from '../../model/amenities';
import {DataTablesResponse} from '../../model/datatable';
import {AmenitiesService} from  '../../services/amenities.service';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {Constants} from '../../constant/constant';
import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import * as _ from 'lodash';
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
  
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  statusDialogReference: NgbModalRef;
  //@ViewChild("closebutton") closebutton;
  //@ViewChild("closebutton2") closebutton2;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  
  position = 'bottom-right';
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionAmenities: any = {};
  dtSeatTypesOptions: any = {};
  dtSeatTypesOptionsData: any = {};
  endpoint = 'http://127.0.0.1:8000/api';
  Amenities: Amenities[];
  AmenitiesRecord: Amenities;
  imgURL: any;
  
  //Image upload

  File: any;
  
  //base64s
  imageSrc: string;
  
  //json
  finalJson = {};
  base64result:any;
  iconSrc:any;

  imageError: string;
  
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;

  constructor(private http: HttpClient,private AmenitiesService:AmenitiesService, private notificationService: NotificationService,private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal, private sanitizer: DomSanitizer) { 
    this.isSubmit = false;
    this.AmenitiesRecord= {} as Amenities;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Amenities";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'lg' });
  }
  statusDialog(content) {
    this.statusDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  loadAmenities(){
    this.dtOptionAmenities = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: 'lBfrtip',
      order:["0","desc"],
      aLengthMenu:[10, 25, 50, 100, "All"],     
      buttons: [
        { extend: 'copy', className: 'btn btn-sm btn-primary',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     },
     exportOptions: {
      columns: "thead th:not(.noExport)"
     } 
     },
      { extend: 'print', className: 'btn btn-sm btn-danger',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     },
     exportOptions: {
      columns: "thead th:not(.noExport)"
     } 
     },
      { extend: 'excel', className: 'btn btn-sm btn-info',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     },
     exportOptions: {
      columns: "thead th:not(.noExport)"
     } 
     },
      { extend: 'csv', className: 'btn btn-sm btn-success',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     },
     exportOptions: {
      columns: "thead th:not(.noExport)"
     } 
     },
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
    language: {
      searchPlaceholder: "Find Amenities",
      processing: "<img src='assets/images/loading.gif' width='30'>"
    },
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            Constants.BASE_URL+'/AmenitiesDT',
            dataTablesParameters, {}
          ).subscribe(resp => {
            this.Amenities = resp.data.aaData;
            for(let items of this.Amenities)
            {
              this.AmenitiesRecord=items;
              let icon='data:image/svg+xml;charset=utf-8;base64,'+this.AmenitiesRecord.icon;
              this.AmenitiesRecord.icon=icon;
            }
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: resp.data.aaData
            });
          });
      },
      columns: [{ data: 'id' }, { data: 'name' }, { data: 'created_at' },{ data: 'created_by' }, { 
        data: 'status',
        render:function(data)
        {
          return (data=="1")?"Active":"Pending"
        } 
      },{ title:'Action',data: null, orderable:false,className: "noExport" }]      
      
    };
  }
  
  
  ngOnInit(): void {
    this.form1=this.fb.group({
      id:[null],
      reason: [null,Validators.compose([Validators.required])]
    });

    this.form = this.fb.group({
      id:[null],
      name: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      icon: [null,Validators.compose([Validators.required])],
      iconSrc:[null]
    });  

    this.loadAmenities();
  }

  ResetAttributes()
  {
    this.AmenitiesRecord={
      name:''
    } as Amenities;
    this.ModalHeading = "Add Amenities";
    this.ModalBtn = "Save";
    this.AmenitiesRecord.icon="";
    this.imgURL="";
    this.imageSrc="";
    this.form = this.fb.group({
      id:[null],
      name: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      icon: ['',Validators.compose([Validators.required])],
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

  addAmenities()
  {
    this.finalJson = {
      "File": this.imageSrc,
    }
    
    let id:any=this.form.value.id;  
    const data ={
      //id:this.AmenitiesRecord.id,
      name:this.form.value.name,
      //icon:this.base64result,
      icon:this.form.value.iconSrc,
      created_by:'Admin',
    };
    if(id==null)
    {
      this.AmenitiesService.create(data).subscribe(
        resp => {
          if(resp.status==1)
          {
              //this.closebutton.nativeElement.click();
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:'success'});
              this.modalReference.close();
              this.ResetAttributes();
              this.rerender();
          }
          else{
              this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
          }
        }
      );
    }
    else{
      this.AmenitiesService.update(id,data).subscribe(
        resp => {
          if(resp.status==1)
          {
              //this.closebutton.nativeElement.click();
              this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
              this.ResetAttributes();
              this.modalReference.close();
              this.rerender();
          }
          else{
              this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
          }
        }
      );
    }
  }
  
  editAmenities(event : Event, id : any)
  {
    this.ModalHeading = "Edit Amenities";
    this.ModalBtn = "Update";
    this.AmenitiesRecord=this.Amenities[id];

    

    this.imgURL =this.sanitizer.bypassSecurityTrustResourceUrl(this.AmenitiesRecord.icon);
    this.form = this.fb.group({
      id:[this.AmenitiesRecord.id],
      name: [this.AmenitiesRecord.name, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      icon: [],
      iconSrc:[this.AmenitiesRecord.icon]
    });
    
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'lg' });
  }
  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
     this.AmenitiesService.delete(delitem).subscribe(
      resp => {
        if(resp.status==1)
            {
                this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                this.confirmDialogReference.close();
                this.rerender();
            }
            else{
               
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
            }
      }); 
  }
  changeStatus()
  { 
    const data ={
      reason:this.form1.value.reason,
      id:this.form1.value.id
    };
    this.AmenitiesService.chngsts(data.id, data).subscribe(
      resp => {
        if(resp.status==1)
        {
            //this.closebutton2.nativeElement.click();
            //info, success, wait, error, warning.
            this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
            this.statusDialogReference.close();
            this.rerender();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
      }
    );
  }
  cs(id : any){
    //this.AmenitiesRecord=this.Amenities[id] ;
    
    const data ={
      reason:this.form1.value.reason,
      id:this.form1.value.id
    };
    this.AmenitiesService.chngsts(id, data).subscribe(
      resp => {
        if(resp.status==1)
        {
            this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
            this.rerender();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
      }
    );
  }

  deleteAmenities(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
  }

  public picked(event:any, fileSrc:any) {

    //////image validation////////
    this.imageError = null;
            const max_size = 102400;
            const allowed_types = ['image/svg+xml'];
            const max_height = 100;
            const max_width = 200;
    let fileList: FileList = event.target.files;
    
    if (event.target.files[0].size > max_size) {
      this.imageError =
          'Maximum size allowed is ' + max_size/1024  + 'Kb';
          this.form.value.imagePath = '';
          this.imgURL='';
      return false;
  }

  if (!_.includes(allowed_types, event.target.files[0].type)) {
      this.imageError = '\r\nOnly Images are allowed (SVG)';
      this.form.value.imagePath = '';
      this.form.controls.icon.setValue('');
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
                this.form.value.imagePath = '';
                this.imgURL='';
            return false;
        } 
      };
  };
  
    if (fileList.length > 0) {
      const file: File = fileList[0];
      
        this.form.value.File = file;

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
    this.form.value.icon=this.base64result;
    this.form.value.iconSrc=this.base64result;

    this.form.controls.iconSrc.setValue(this.base64result);
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
      this.imgURL=this.sanitizer.bypassSecurityTrustResourceUrl(this.imgURL);
    }
  }
}
