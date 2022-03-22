import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Permission } from '../../model/permission';

import { NotificationService } from '../../services/notification.service';
import { PermissionService } from '../../services/permission.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-managepermission',
  templateUrl: './managepermission.component.html',
  styleUrls: ['./managepermission.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class ManagepermissionComponent implements OnInit {

  @ViewChild("addnew") addnew;
  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;


  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  
  permission: Permission[];
  permissionRecord: Permission;
 
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
  pagination: any;
  all: any;
  constructor( private spinner: NgxSpinnerService,private permissionService: PermissionService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal)
   {
      this.isSubmit = false;
      this.permissionRecord= {} as Permission;
      config.backdrop = 'static';
      config.keyboard = false;
      this.ModalHeading = "Add Role";
      this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  
  ngOnInit() {
    this.spinner.show();
    this.form = this.fb.group({
      id:[null],
      name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
    });
    this.formConfirm=this.fb.group({
      id:[null]
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
    this.spinner.show();  
    const data = { 
        name: this.searchForm.value.name,
        rows_number:this.searchForm.value.rows_number,        
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.permissionService.getAllpaginationData(pageurl,data).subscribe(
        res => {
          this.permission = res.data.data.data;
          this.pagination= res.data.data;
          this.all =res.data;
          this.spinner.hide();
          // console.log( this.seatingTypes);
        }
      );
    }
    else
    {
      this.permissionService.getAllPermission(data).subscribe(
        res => {
          this.permission = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
          //console.log(this.roles);
        }
      );
    }
  }


  refresh()
  {
        this.searchForm = this.fb.group({  
          name: [null],  
          rows_number: Constants.RecordLimit,
        });
        this.search();
        this.spinner.hide();        
  }
  
  ResetAttriutes()
  {    
        this.permissionRecord = {} as Permission;
        this.form = this.fb.group({
          id:[null],
          name: ['',Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])]
          //name: ['',Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50),seatingTypeValidator.cannotContainSpace])]
        });
        this.ModalHeading = "Add ";
        this.ModalBtn = "Save";
    
  }
  formatText(event:Event)
  {
    this.form.value.name = this.form.value.name.trim();
    this.form = this.fb.group({
      id:[this.form.value.id],
      name: [this.form.value.name]
    });
  }


  addPermission()
  {
    this.spinner.show();
    let id:any = this.form.value.id;
    const data = {
      name:this.form.value.name,
      created_by:localStorage.getItem('USERNAME'),
    };

    if(id==null)
    {
        this.permissionService.create(data).subscribe(
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
                this.spinner.hide();
              }
      });    
    }
    else{     
     
      this.permissionService.update(id,data).subscribe(
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
              this.spinner.hide();
            }
      });         
    }    
  }

  editPermission(event : Event, id : any)
  {
    this.permissionRecord=this.permission[id] ;
    this.form = this.fb.group({
      id:[this.permissionRecord.id],
      name: [this.permissionRecord.name, Validators.compose([Validators.required,Validators.minLength(2)])],
    });
    this.ModalHeading = "Edit Permission";
    this.ModalBtn = "Update";
  }


  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }

  deleteRecord()
  {
     let delitem = this.formConfirm.value.id;
     this.permissionService.delete(delitem).subscribe(
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
  deletePermission(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
    
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.spinner.show();
    this.permissionService.chngsts(stsitem).subscribe(
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
  fileName= 'Seating-Type.xlsx';

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
