import { Component, OnInit,ViewChild } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { DisplayinfoService } from 'src/app/services/displayinfo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DisplayInfo} from '../../model/displayinfo';
import { Subject } from 'rxjs';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-displayinfo',
  templateUrl: './displayinfo.component.html',
  styleUrls: ['./displayinfo.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class DisplayInfoComponent implements OnInit {  

  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;



  //@ViewChild('closebutton') closebutton;
  @ViewChild("addnew") addnew;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  displayinfos: DisplayInfo[];
  displayinfoRecord: DisplayInfo;
  public isSubmit: boolean;

  public ModalHeading:any;
  public ModalBtn:any;
  pagination: any;
  busoperators: any;
  all: any;
  constructor( private spinner: NgxSpinnerService,
    private displayInfoService: DisplayinfoService,private http: HttpClient,private notificationService: NotificationService,private fb: FormBuilder,private modalService: NgbModal,config: NgbModalConfig) {
    this.isSubmit = false;
    this.displayinfoRecord= {} as DisplayInfo;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Display Info";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'lg' });
  }
  
 
   ngOnInit() { 
    this.spinner.show();
    this.form = this.fb.group({
      id:[null],
      name: [null, Validators.compose([Validators.required])]
    });  
    this.formConfirm=this.fb.group({
      id:[null]
    });

   this.search();
    
  }
  
  
  page(label:any){
    return label;
   }

  search(pageurl="")
  {
    this.spinner.show();
      
   
      this.displayInfoService.getAllData().subscribe(
        res => {
          this.displayinfos= res.data;
          this.pagination= res.data;
          this.all =res.data;
          this.spinner.hide();
          // console.log( res.data);
        }
      );
  }


  refresh()
   {
    this.searchForm = this.fb.group({  
      name: [null], 
      bus_type: [null],  
      rows_number: Constants.RecordLimit,
    });
     this.search();
     this.spinner.hide();
   }


  
  ResetAttributes()
  {
    this.displayinfoRecord = {
      name:''
    } as DisplayInfo;
    this.form = this.fb.group({
      id:[null],
      name: ['', Validators.compose([Validators.required])]
    });
    this.ModalHeading = "Add Display Info";
    this.ModalBtn = "Save";
  }
  
  adddisplayinfo(){  

    this.spinner.show();
    let id:any=this.displayinfoRecord.id;  
    const data = {
      name:this.form.value.name
    };
    console.log(data);
    if(id==null)
    {
      this.displayInfoService.create(data).subscribe(
        resp => {
          if(resp.status==1)
       {
          this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
          this.modalReference.close();
          this.ResetAttributes();
          this.search();
          
       }
       else
       {
          this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
          this.spinner.hide();
       }
      });    
    }
    else{     
     
      this.displayInfoService.update(id,data).subscribe(
        resp => {
          if(resp.status==1)
            {
                this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                //this.closebutton.nativeElement.click();
                this.modalReference.close();
                this.ResetAttributes();
                this.search();
            }
            else
            {
                this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
                this.spinner.hide();
            }
      });         
    }
  }
  editdisplayinfo(event : Event, id : any)
  {
    this.displayinfoRecord=this.displayinfos[id] ;
    console.log(this.displayinfoRecord);
    this.form = this.fb.group({
      id:[this.displayinfoRecord.id],
      name: [this.displayinfoRecord.name, Validators.compose([Validators.required])]
    });
    this.ModalHeading = "Edit Display Info";
    this.ModalBtn = "Update";
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }

  deleteRecord()
  {

    let delitem=this.formConfirm.value.id;
     this.displayInfoService.delete(delitem).subscribe(
      resp => {
        if(resp.status==1)
            {
                this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                this.confirmDialogReference.close();

                this.search();
            }
            else{
               
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
              this.spinner.hide();
            }
      }); 
  }
  deletedisplayinfo(content, delitem:any)
  {

    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
  }

  
  title = 'angular-app';
  fileName= 'Display-Info.csv';

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
