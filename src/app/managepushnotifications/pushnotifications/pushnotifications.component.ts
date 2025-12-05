import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppNotificationService } from '../../services/appnotification.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-pushnotifications',
  templateUrl: './pushnotifications.component.html',
  styleUrls: ['./pushnotifications.component.scss'],
})
export class PushnotificationsComponent implements OnInit {
  searchForm: FormGroup;
  form: FormGroup;
  formConfirm: FormGroup;

  pagecontent: any[] = [];
  pagination: any = null;
  all: any = null;

  selectedStatusRow: any = null;
  newStatus: number = null;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  ModalBtn = 'Save';
  ModalHeading = 'Add Notification';

  selectedRecord: any = null;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private pc: AppNotificationService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.search();
  }

  initializeForms() {
    this.searchForm = this.fb.group({
      name: [''],
    });

    this.form = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: ['', Validators.required],
      message: [''],
    });

    this.formConfirm = this.fb.group({
      id: [null],
    });
  }
  openStatusConfirm(content, row) {
    this.selectedStatusRow = row;
    this.newStatus = row.status === 1 ? 0 : 1;
    this.modalService.open(content, { centered: true });
  }
  confirmStatusChange() {
    this.spinner.show();

    this.pc
      .updateStatus(this.selectedStatusRow.id, this.newStatus)
      .subscribe((resp) => {
        if (resp.status == 1) {
          this.selectedStatusRow.status = this.newStatus;

          this.notify.addToast({
            title: 'Success',
            msg: 'Status updated successfully',
            type: 'success',
          });
        } else {
          this.notify.addToast({
            title: 'Error',
            msg: resp.message,
            type: 'error',
          });
        }

        this.spinner.hide();
      });
  }

  search(pageurl = '') {
    this.spinner.show();
    const data = {
      name: this.searchForm.value.name,
    };

    if (pageurl) {
      this.pc.getAllPaginationData(pageurl, data).subscribe((res) => {
        this.setList(res);
      });
    } else {
      this.pc.getAllData(data).subscribe((res) => {
        this.setList(res);
      });
    }
  }

  setList(res) {
    this.pagecontent = res.data.data;
    this.pagination = res.data;

    this.all = {
      count: res.data.to,
      total: res.data.total,
    };

    this.spinner.hide();
  }

  toggleStatus(row) {
    const newStatus = row.status == 1 ? 0 : 1;

    this.spinner.show();

    this.pc.updateStatus(row.id, newStatus).subscribe((resp) => {
      if (resp.status == 1) {
        row.status = newStatus;

        this.notify.addToast({
          title: 'Success',
          msg: 'Status updated successfully',
          type: 'success',
        });
      } else {
        this.notify.addToast({
          title: 'Error',
          msg: resp.message,
          type: 'error',
        });
      }

      this.spinner.hide();
    });
  }

  refresh() {
    this.searchForm.reset();
    this.search();
  }

  OpenModal(content) {
    this.modalReference = this.modalService.open(content, {
      scrollable: true,
      size: 'lg',
    });
  }

  ResetForm() {
    this.form.reset();
    this.ModalBtn = 'Save';
    this.ModalHeading = 'Add Notification';
    this.selectedRecord = null;
  }

  addData() {
    this.spinner.show();

    const data = {
      title: this.form.value.title,
      description: this.form.value.description,
      message: this.form.value.message,
      user_id: localStorage.getItem('USERID'),
    };

    if (this.selectedRecord) {
      this.pc.update(this.selectedRecord.id, data).subscribe((resp) => {
        this.handleResponse(resp, 'Updated');
      });
    } else {
      this.pc.create(data).subscribe((resp) => {
        this.handleResponse(resp, 'Created');
      });
    }
  }

  handleResponse(resp, msg) {
    if (resp.status == 1) {
      this.notify.addToast({
        title: 'Success',
        msg: msg + ' Successfully',
        type: 'success',
      });
      this.modalReference.close();
      this.ResetForm();
      this.refresh();
    } else {
      this.notify.addToast({
        title: 'Error',
        msg: resp.message,
        type: 'error',
      });
      this.spinner.hide();
    }
  }

  editData(i, content) {
    this.selectedRecord = this.pagecontent[i];

    this.form.patchValue({
      id: this.selectedRecord.id,
      title: this.selectedRecord.title,
      description: this.selectedRecord.description,
      message: this.selectedRecord.message,
    });

    this.ModalHeading = 'Edit Notification';
    this.ModalBtn = 'Update';

    this.OpenModal(content);
  }

  openConfirmDialog(content, i) {
    this.selectedRecord = this.pagecontent[i];
    this.formConfirm.controls.id.setValue(this.selectedRecord.id);
    this.confirmDialogReference = this.modalService.open(content, {
      centered: true,
    });
  }

  deleteRecord() {
    this.spinner.show();

    const delId = this.formConfirm.value.id;

    this.pc.delete(delId).subscribe((resp) => {
      if (resp.status == 1) {
        this.notify.addToast({
          title: 'Success',
          msg: resp.message,
          type: 'success',
        });

        this.confirmDialogReference.close();
        this.refresh();
      } else {
        this.notify.addToast({
          title: 'Error',
          msg: resp.message,
          type: 'error',
        });
      }

      this.spinner.hide();
    });
  }

  page(label) {
    return label;
  }
}
