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
  searchForm!: FormGroup;
  form!: FormGroup;
  formConfirm!: FormGroup;

  pagecontent: any[] = [];
  pagination: any = null;
  all: any = null;

  selectedStatusRow: any = null;
  newStatus!: number;

  modalReference!: NgbModalRef;
  confirmDialogReference!: NgbModalRef;

  ModalBtn = 'Save';
  ModalHeading = 'Add Notification';

  selectedRecord: any = null;

  notificationTypes: any[] = [];
  templateKeys: any[] = [];
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private pc: AppNotificationService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadNotificationTypes();
    this.search();
  }

  initializeForms() {
    this.searchForm = this.fb.group({
      name: [''],
    });

    this.form = this.fb.group({
      id: [null],
      type_id: ['', Validators.required],
      template_key_id: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      message: [''],
    });

    this.formConfirm = this.fb.group({
      id: [null],
    });
  }

  loadNotificationTypes() {
    this.pc.getNotificationTypes().subscribe((res) => {
      this.notificationTypes = res.data;
    });
  }

  

  onTypeChange(event: any) {
    if (this.isEditMode) {
      this.blockEditDropdown();
      return;
    }

    const typeId = event.target.value;

    if (!typeId) {
      this.templateKeys = [];
      return;
    }

    this.pc.getTemplateKeys(typeId).subscribe((res) => {
      this.templateKeys = res.data;
    });
  }

  onDropdownAttempt() {
    if (this.isEditMode) {
      this.notify.addToast({
        title: "Not Allowed",
        msg: "You cannot change Type or Template Key while editing.",
        type: "warning"
      });
    }
  }

 blockEditDropdown() {
  if (this.isEditMode) {
    this.notify.addToast({
      title: 'Not Allowed',
      msg: 'You cannot change Notification Type or Template Key while editing.',
      type: 'warning'
    });
  }
}


  openStatusConfirm(content: any, row: any) {
    this.selectedStatusRow = row;
    this.newStatus = row.status === 1 ? 0 : 1;
    this.modalService.open(content, { centered: true });
  }

  confirmStatusChange() {
    this.spinner.show();

    this.pc.updateStatus(this.selectedStatusRow.id, this.newStatus).subscribe(
      (resp) => {
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
      },
      () => this.spinner.hide()
    );
  }



  search(pageurl = '') {
    this.spinner.show();
    const data = { name: this.searchForm.value.name };

    const serviceCall = pageurl
      ? this.pc.getAllPaginationData(pageurl, data)
      : this.pc.getAllData(data);

    serviceCall.subscribe((res) => this.setList(res));
  }

  setList(res: any) {
    this.pagecontent = res.data.data;
    this.pagination = res.data;

    this.all = {
      count: res.data.to,
      total: res.data.total,
    };

    this.spinner.hide();
  }

  refresh() {
    this.searchForm.reset();
    this.search();
  }


  OpenModal(content: any) {
    this.modalReference = this.modalService.open(content, {
      scrollable: true,
      size: 'lg',
    });
  }

  ResetForm() {
    this.form.reset();
    this.templateKeys = [];
    this.ModalBtn = 'Save';
    this.ModalHeading = 'Add Notification';
    this.selectedRecord = null;
    this.isEditMode = false;
  }

  addData() {
    this.spinner.show();

    const data = {
      type_id: this.form.value.type_id,
      template_key_id: this.form.value.template_key_id,
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

  handleResponse(resp: any, msg: any) {
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

  editData(i: any, content: any) {
    this.selectedRecord = this.pagecontent[i];
    this.isEditMode = true;

    this.form.patchValue({
      id: this.selectedRecord.id,
      type_id: this.selectedRecord.type_id,
      template_key_id: this.selectedRecord.template_key_id, 
      title: this.selectedRecord.title,
      description: this.selectedRecord.description,
      message: this.selectedRecord.message,
    });

   
    this.pc.getTemplateKeys(this.selectedRecord.type_id).subscribe((res) => {
      this.templateKeys = res.data;
    });

    this.ModalHeading = 'Edit Notification';
    this.ModalBtn = 'Update';

    this.OpenModal(content);
  }

  openConfirmDialog(content: any, i: any) {
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

  page(label: any) {
    return label;
  }
}
