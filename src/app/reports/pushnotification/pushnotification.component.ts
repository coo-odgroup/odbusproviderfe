import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Pushnotification } from '../../model/pushnotification';
import { BusOperatorService } from './../../services/bus-operator.service';
import { PushnotificationService } from '../../services/pushnotification.service';
import { Constants } from '../../constant/constant';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-pushnotification',
  templateUrl: './pushnotification.component.html',
  styleUrls: ['./pushnotification.component.scss']
})
export class PushnotificationComponent implements OnInit {

  public form: FormGroup;

  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  pagination: any;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading: any;
  public ModalBtn: any;

  push: Pushnotification[];
  pushRecord: Pushnotification;

  user:any; 

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder, private busOperatorService: BusOperatorService,
    private pns: PushnotificationService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Location";
    this.ModalBtn = "Save";
  }





  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      subject: [null, Validators.compose([Validators.required])],
      notification: [null, Validators.compose([Validators.required])],
      user: [null, Validators.compose([Validators.required])],
    
    });
    this.formConfirm = this.fb.group({
      id: [null]
    });
    this.searchForm = this.fb.group({
      bus_operator_id: [null],
      name: [null],
      rows_number: Constants.RecordLimit,
    });

    this.search();
    this.load_user();

  }


  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'lg' });
  }
  ResetAttributes() {
    this.pushRecord = {} as Pushnotification;
    this.form = this.fb.group({
      id: [null],
      subject: [null, Validators.compose([Validators.required])],
      notification: [null, Validators.compose([Validators.required])],
      user: [null, Validators.compose([Validators.required])],

    });
    this.ModalHeading = "Add Notification";
    this.ModalBtn = "Save";
  }

   page(label: any) {
    return label;
  }


  search(pageurl = "") {
    const data = {
      name: this.searchForm.value.name,
      bus_operator_id: this.searchForm.value.bus_operator_id,
      rows_number: this.searchForm.value.rows_number,
    };
    if (pageurl != "") {
      this.pns.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.push = res.data.data.data;
          this.pagination = res.data.data;
         
        }
      );
    }
    else {
      this.pns.getAllData(data).subscribe(
        res => {
          this.push = res.data.data.data;
          this.pagination = res.data.data;
         
        }
      );
    }
  }


  refresh() {
    this.searchForm = this.fb.group({
      name: [null],
      bus_operator_id: [null],
      rows_number: Constants.RecordLimit,
    });
    this.search();

  }

  title = 'angular-app';
  fileName = 'Push-Notification.xlsx';

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


  load_user()
  {
    this.pns.allUser().subscribe(
      res => {
        this.user = res.data;       
      }
    );
  }


  addData() {
    const data = {
      subject: this.form.value.page_url,
      notification:this.form.value.bus_operator_id,
      user: this.form.value.url_description
    };
    let id = this.pushRecord?.id;
    if (id != null) {
      this.pns.update(id, data).subscribe(
        resp => {
          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.refresh();

          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          }
        }
      );
    }
    else {
      this.pns.create(data).subscribe(
        resp => {

          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.refresh();


          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          }
        }
      );

    }

  }


  editData(id) {
    this.pushRecord = this.push[id];
    
    this.form.controls.id.setValue(this.pushRecord.id);
    this.form.controls.bus_operator_id.setValue(this.pushRecord.subject);
    this.form.controls.page_url.setValue(this.pushRecord.notification);
    this.form.controls.url_description.setValue(this.pushRecord.user);
    this.ModalHeading = "Edit Notification";
    this.ModalBtn = "Update";


  }

  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.pushRecord = this.push[id];
  }

  deleteRecord() {
    let delitem = this.pushRecord.id;
    this.pns.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.confirmDialogReference.close();
          this.ResetAttributes();
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
        }
      });
  }


  changeStatus(event: Event, stsitem: any) {
    this.pns.chngsts(stsitem).subscribe(
      resp => {

        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
        }
      }
    );
  }

  
  


}
