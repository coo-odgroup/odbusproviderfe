import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; 
import { Contactreport } from '../../model/contactreport';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {ContactreportService } from '../../services/contactreport.service';

@Component({
  selector: 'app-contactreport',
  templateUrl: './contactreport.component.html',
  styleUrls: ['./contactreport.component.scss']
})
export class ContactreportComponent implements OnInit {

  
  public formConfirm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

   public isSubmit: boolean;
  public ModalHeading:any;
  public ModalBtn:any;

  contactcontent: Contactreport[];
  contactcontentRecord: Contactreport;

  constructor(
    private http: HttpClient, 
    private notificationService: NotificationService, 
    private fb: FormBuilder,
    private cs: ContactreportService,
    private modalService: NgbModal,
    config: NgbModalConfig
    )
    { 
      config.backdrop = 'static';
      config.keyboard = false;
      this.ModalHeading = "View Details";
      // this.ModalBtn = "Save"; 
    }


    
    

  ngOnInit(): void {
    this.formConfirm=this.fb.group({
      id:[null]
    });
    this.getAll();
  }


  OpenModal(content) 
  {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }



  ResetAttributes()
  {     
    this.ModalHeading = "View Details";
    // this.ModalBtn = "Save";
  }

  getAll()
  {
    this.cs.readAll().subscribe(
      res=>{
        this.contactcontent = res.data;
        // console.log(res.data);
      }
    );
  }
  viewDetails(index)
  {
    // console.log(index);

    this.contactcontentRecord = this.contactcontent[index];

  }



  openConfirmDialog(content, index: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.contactcontentRecord = this.contactcontent[index];
  }
 

  deleteRecord(){
    let delitem = this.contactcontentRecord.id;
    console.log(delitem);
    this.cs.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.confirmDialogReference.close();
          this.getAll();         
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
        }
      });
  }


}
