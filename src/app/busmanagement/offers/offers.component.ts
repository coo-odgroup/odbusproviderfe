import { Component, OnInit,ViewChild } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Offers } from '../../model/offers';
import { DataTablesResponse} from '../../model/datatable';
import { NotificationService } from '../../services/notification.service';
import { OffersService } from '../../services/offers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import * as _ from 'lodash';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class OffersComponent implements OnInit {

  @ViewChild("addnew") addnew;
  public form: FormGroup;
  public formConfirm: FormGroup;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
 
  
  position = 'bottom-right'; 
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionsOffers: any = {};
  dtOffersOptions: any = {};
  dtOffersOptionsData: any = {};
  Offers: Offers[];
  OfferRecord: Offers;
 
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;


  constructor(private offersService: OffersService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private sanitizer: DomSanitizer)
   {
    this.isSubmit = false;
    this.OfferRecord= {} as Offers;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Offers";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  
  ngOnInit() {
    this.form = this.fb.group({
      offer_category_id:[null],
      offer_image:[null],
      offer_text: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
    });
    this.formConfirm=this.fb.group({
      id:[null],
    });
    this.loadSeatData();
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
      this.imageError = 'Only Images are allowed ( SVG)';
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
    this.form.value.offer_image=this.base64result;
    this.form.value.iconSrc=this.base64result;
    this.form.controls.iconSrc.setValue(this.base64result);
    
  }
  public imagePath;
  public message: string;
  imgURL: any;
  base64result:any;
  imageSrc:any;
  imageError:any;
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
  loadSeatData()
  {
    
    this.dtOptionsOffers = {
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
        { 
          extend: 'csv', className: 'btn btn-sm btn-success',init: function(api, node, config) {
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
      searchPlaceholder: "Find Offers",
      processing: "<img src='assets/images/loading.gif' width='30'>"
    },
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            Constants.BASE_URL+'/offersDT',
            dataTablesParameters, {}
          ).subscribe(resp => {
           // console.log(resp.data.aaData);
            this.Offers = resp.data.aaData;
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: resp.data.aaData
            });
          });
      },
      columns: [ { data: 'id' },{ data: 'offer_text' },{ title:"Created By",data: 'created_by' },{ data: 'created_at' },{ data: 'updated_at' },{ 
        data: 'status',
        render:function(data)
        {
          return (data=="1")?"Active":"Pending"
        }  

      },{ title:'Action',data: null,orderable:false,className: "noExport"  }]            
    }; 
  }
  ResetAttriutes()
  {
    
    this.OfferRecord = {} as Offers;
    this.form = this.fb.group({
      offer_category_id:[null],
      offer_text: [null],
      offer_image: ['',Validators.compose([Validators.required])],
      iconSrc:[null]
    });
    this.ModalHeading = "Add Offers";
    this.ModalBtn = "Save";
    this.imgURL="";
    this.imageSrc="";
    this.OfferRecord.offer_image="";
    
  }
  
  addOffers()
  {
    let id=this.OfferRecord.id;
    //let data;
    // if(this.form.value.icon==null)
    // {
    //   data ={
    //     name:this.form.value.name,
    //     icon:this.OfferRecord.icon,
    //     created_by:"Admin"
    //   };
    // }
    // else{
    //   data ={
    //     name:this.form.value.name,
    //     icon:this.form.value.icon,
    //     created_by:"Admin"
    //   };
    // }
    const data ={
      name:this.form.value.name,
      icon:this.form.value.iconSrc,
      created_by:'Admin',
    };

    if(id==null)
    {
      this.offersService.create(data).subscribe(
        resp => {
          if(resp.status==1)
          {
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.ResetAttriutes();
              this.rerender();
          }
          else
          {
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
          }
        }
      );    
    }
    else{     
     
      this.offersService.update(id,data).subscribe(
        resp => {
          if(resp.status==1)
            {                
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.ResetAttriutes();
              this.rerender();
            }
            else
            {                
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
            }
      });         
    }    
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
  editOffers(event : Event, id : any)
  {
    this.OfferRecord=this.Offers[id] ;
    // console.log(this.OfferRecord);
    this.imgURL =this.sanitizer.bypassSecurityTrustResourceUrl("data:image/svg+xml;charset=utf-8;base64,"+this.OfferRecord.offer_image);
    
    //console.log(this.imgURL);
    this.form = this.fb.group({
      name: [this.OfferRecord.offer_text, Validators.compose([Validators.required,Validators.minLength(2)])],
      icon: [],
      iconSrc:[this.OfferRecord.offer_image]
    });
    // this.imgURL ="data:image/png;base64,"+this.OfferRecord.icon;
    

    this.ModalHeading = "Edit Offers Line";
    this.ModalBtn = "Update";
    
    //console.log(this.seatingTypes);
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
     this.offersService.delete(delitem).subscribe(
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
  deleteSeatingType(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
    
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.offersService.chngsts(stsitem).subscribe(
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

}
