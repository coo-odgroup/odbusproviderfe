import { Component, OnInit,ViewChild } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Safety } from '../../model/safety';
import { DataTablesResponse} from '../../model/datatable';
import { NotificationService } from '../../services/notification.service';
import { SafetyService } from '../../services/safety.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-safety',
  templateUrl: './safety.component.html',
  styleUrls: ['./safety.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class SafetyComponent implements OnInit {

  @ViewChild("addnew") addnew;
  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;


  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
 
  
  position = 'bottom-right'; 
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionsSafety: any = {};
  dtSafetyOptions: any = {};
  dtSafetysOptionsData: any = {};
  Safetys: Safety[];
  SafetyRecord: Safety;
 
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
  pagination: any;


  constructor(
          private safetyService: SafetyService,
          private http: HttpClient,
          private notificationService: NotificationService, 
          private fb: FormBuilder,config: NgbModalConfig, 
          private modalService: NgbModal,
          private sanitizer: DomSanitizer
    )
   {
    this.isSubmit = false;
    this.SafetyRecord= {} as Safety;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Safety Line";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  
  ngOnInit() {
    this.form = this.fb.group({
      id:[null],
      icon:[null],
      name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
    });
    this.formConfirm=this.fb.group({
      id:[null],
    });

    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });

    this.search(); 
  }

 
  page(label:any){
    return label;
   }

  search(pageurl="")
  {
      
    const data = { 
      name: this.searchForm.value.name,
      rows_number:this.searchForm.value.rows_number, 
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.safetyService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.Safetys= res.data.data.data;
          this.pagination= res.data.data;
          // console.log( this.Safetys);
        }
      );
    }
    else
    {
      this.safetyService.getAllData(data).subscribe(
        res => {
          this.Safetys= res.data.data.data;
          this.pagination= res.data.data;
          // console.log( res.data);
        }
      );
    }
  }


  refresh()
   {
     this.searchForm.reset();
     this.search();
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
    this.form.value.icon=this.base64result;
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

  ResetAttriutes()
  {
    
    this.SafetyRecord = {} as Safety;
    this.form = this.fb.group({
      id:[null],
      name: ['',Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])],
      icon: ['',Validators.compose([Validators.required])],
      iconSrc:[null]
    });
    this.ModalHeading = "Add Safety Line";
    this.ModalBtn = "Save";
    this.imgURL="";
    this.imageSrc="";
    this.SafetyRecord.icon="";
    
  }
  
  addsafety()
  {
    let id=this.SafetyRecord.id;
    //let data;
    // if(this.form.value.icon==null)
    // {
    //   data ={
    //     name:this.form.value.name,
    //     icon:this.SafetyRecord.icon,
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
      this.safetyService.create(data).subscribe(
        resp => {
          if(resp.status==1)
          {
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.ResetAttriutes();
             this.search(); 
          }
          else
          {
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
          }
        }
      );    
    }
    else{     
     
      this.safetyService.update(id,data).subscribe(
        resp => {
          if(resp.status==1)
            {                
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.ResetAttriutes();
             this.search(); 
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
  editsafety(event : Event, id : any)
  {
    this.SafetyRecord=this.Safetys[id] ;
    // console.log(this.SafetyRecord);
    // this.imgURL =this.sanitizer.bypassSecurityTrustResourceUrl("data:image/svg+xml;charset=utf-8;base64,"+this.SafetyRecord.icon);
    this.imgURL = this.SafetyRecord.icon;
    
    //console.log(this.imgURL);
    this.form = this.fb.group({
      name: [this.SafetyRecord.name, Validators.compose([Validators.required,Validators.minLength(2)])],
      icon: [],
      iconSrc:[this.SafetyRecord.icon]
    });
    // this.imgURL ="data:image/png;base64,"+this.SafetyRecord.icon;
    

    this.ModalHeading = "Edit Safety Line";
    this.ModalBtn = "Update";
    
    //console.log(this.seatingTypes);
  }

  // Safetys: Safety[];
  // SafetyRecord: Safety;
  openConfirmDialog(content, id: any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.SafetyRecord = this.Safetys[id];
  }
  deleteRecord()
  {
    // let delitem=this.formConfirm.value.id;
    let delitem = this.SafetyRecord.id;
     this.safetyService.delete(delitem).subscribe(
      resp => {
        if(resp.status==1)
            {
                this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                this.confirmDialogReference.close();

               this.search(); 
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

  getBannerImagepath(slider_img :any){
    let objectURL = 'data:image/*;base64,'+slider_img;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
   }

  changeStatus(event : Event, stsitem:any)
  {
    this.safetyService.chngsts(stsitem).subscribe(
      resp => {
        if(resp.status==1)
        {
            this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
           this.search(); 
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
      }
    );
  }


  title = 'angular-app';
  fileName= 'Safety.xlsx';

  exportexcel(): void
  {
    
    /* pass here the table id */
    let element = document.getElementById('print-section');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
  }


}
