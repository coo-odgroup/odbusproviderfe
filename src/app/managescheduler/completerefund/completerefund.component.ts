import { BusOperatorService } from './../../services/bus-operator.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Admincancelticket } from '../../model/admincancelticket';
import { NotificationService } from '../../services/notification.service';
import { AdmincancelticketService } from '../../services/admincancelticket.service';
import { BusService } from '../../services/bus.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../constant/constant';
import {
  NgbModalConfig,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../services/location.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';

// New
import { ScheduleRefundService } from '../../services/schedule-refund.service';
import { Cancelrefund } from '../../model/cancelrefund';

@Component({
  selector: 'app-completerefund',
  templateUrl: './completerefund.component.html',
  styleUrls: ['./completerefund.component.scss'],
})
export class CompleterefundComponent implements OnInit {
  // @ViewChild("addnew") addnew;
  @ViewChild('addnew') addnew!: ElementRef;
  public cancelTicketForm!: FormGroup;
  public formConfirm!: FormGroup;

  modalReference!: NgbModalRef;
  confirmDialogReference!: NgbModalRef;

  public searchForm!: FormGroup;
  pagination: any;

  cancelTickets!: Admincancelticket[];
  cancelRefund!: Cancelrefund[];
  cancelTicketRecord: Admincancelticket;

  buses: any;
  busoperators: any;
  locations: any;
  public isSubmit: boolean;
  public mesgdata: any;
  public ModalHeading: any;
  public ModalBtn: any;
  public searchBy: any;
  all: any;
  pnrDetails!: any[];
  msg: any;
  user: any;

  selectAll: boolean = false;

  constructor(
    private srs: ScheduleRefundService,
    private acts: AdmincancelticketService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private busService: BusService,
    private busOperatorService: BusOperatorService,
    private locationService: LocationService,
    private spinner: NgxSpinnerService,
  ) {
    this.isSubmit = false;
    this.cancelTicketRecord = {} as Admincancelticket;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = 'Cancel Ticket';
    this.ModalBtn = 'Cancel Ticket';
  }

  OpenModal(content: any) {
    this.modalReference = this.modalService.open(content, {
      scrollable: true,
      size: 'xl',
    });
  }
  ngOnInit(): void {
    // this.spinner.show();
    this.cancelTicketForm = this.fb.group({
      pnr_no: [null],
      percentage_deduct: [null],
      full_refund: [false],
      refundAmount: [null],
      reason: [null],
    });
    this.formConfirm = this.fb.group({
      id: [null],
    });
    this.searchForm = this.fb.group({
      journey_dt: null,
      updated_at: null,
      pnr: null,
      rows_number: Constants.RecordLimit,
    });

    this.search();
    this.pnrDetails = [];
  }

  page(label: any) {
    return label;
  }

  search(pageurl = '') {
    this.spinner.show();
    const param = {
      journey_dt: this.searchForm.value.journey_dt,
      updated_at: this.searchForm.value.updated_at,
      pnr: this.searchForm.value.pnr,
      rows_number: this.searchForm.value.rows_number,
    };
    if (pageurl != '') {
      this.acts.getAllaginationData(pageurl, param).subscribe((res) => {
        this.cancelRefund = res.data.data.data;
        this.pagination = res.data.data;
        this.all = res.data;
        this.spinner.hide();
      });
    } else {
      this.srs.getRefundList(param).subscribe((res) => {
        this.cancelRefund = res.data.data.data;
        this.pagination = res.data.data;
        this.all = res.data;
        // console.log(res);
        this.spinner.hide();
      });
    }
  }

  search_pnr() {
    this.spinner.show();
    this.user = '';
    this.cancelTicketForm.controls.refundAmount.setValue('');
    this.cancelTicketForm.controls.percentage_deduct.setValue('');
    this.cancelTicketForm.controls.full_refund.setValue('');
    this.cancelTicketForm.controls.reason.setValue('');

    let pnr = this.cancelTicketForm.value.pnr_no;
    if (pnr != null) {
      this.acts.getPnrDetails(pnr).subscribe((res) => {
        this.pnrDetails = res.data;
        this.spinner.hide();
        console.log(this.pnrDetails);

        if (this.pnrDetails.length == 0) {
          this.msg = 'No Pnr Found';
        }
      });
    }
  }

  calculate() {
    this.cancelTicketForm.controls.refundAmount.setValue('');
    let percentage = this.cancelTicketForm.value.percentage_deduct;
    // console.log(percentage);
    let totalFare = this.pnrDetails[0].payable_amount;
    // console.log(((totalFare/100)*(100-percentage)).toFixed(2));
    this.cancelTicketForm.controls['refundAmount'].setValue(
      ((totalFare / 100) * (100 - percentage)).toFixed(2),
    );

    // ((totalFare/100)*percentage).toFixed(2) //percentage calculation in angular
  }
  previewCancelTicket() {
    // console.log(this.cancelTicketForm.value);
  }

  cancelTicket() {
    if (this.pnrDetails[0].user_id > 0) {
      this.user = this.pnrDetails[0].user_id;
    }
    // console.log(this.cancelTicketForm.value);
    const data = {
      id: this.pnrDetails[0].id,
      user_id: this.user,
      email: this.pnrDetails[0].users.email,
      pnr: this.cancelTicketForm.value.pnr_no,
      percentage_deduct: this.cancelTicketForm.value.percentage_deduct,
      full_refund: this.cancelTicketForm.value.full_refund,
      refund_amount: this.cancelTicketForm.value.refundAmount,
      reason: this.cancelTicketForm.value.reason,
      cancelled_by: sessionStorage.getItem('USERNAME'),
      created_by: sessionStorage.getItem('USERNAME'),
      status: 2,
    };

    console.log(data);
    // return;

    this.acts.cancelTicket(data).subscribe((res) => {
      if (res.status == 1) {
        this.notificationService.addToast({
          title: 'Success',
          msg: res.message,
          type: 'success',
        });
        this.modalReference.close();
        this.refresh();
      } else {
        this.notificationService.addToast({
          title: 'Error',
          msg: res.message,
          type: 'error',
        });
        this.spinner.hide();
      }
    });
  }

  refresh() {
    this.spinner.show();
    this.searchForm = this.fb.group({
      journey_dt: null,
      updated_at: null,
      pnr: null,
      rows_number: Constants.RecordLimit,
    });
    this.search();
  }

  title = 'angular-app';
  fileName = 'Cancel-ticket.csv';

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
  ResetAttributes() {
    this.user = '';
    this.msg = '';
    this.pnrDetails = [];
    // this.festivalFareRecord = {} as Festivalfare;
    this.cancelTicketForm = this.fb.group({
      pnr_no: [null],
      percentage_deduct: [null],
      refundAmount: [null],
      reason: [null],
      full_refund: [false],
    });
    this.ModalHeading = 'Cancel Ticket By Admin End';
    this.ModalBtn = 'Cancel Ticket';
  }

  toggleSelectAll() {
    this.cancelRefund.forEach((item: any) => {
      item.selected = this.selectAll;
    });
  }

  updateSelectAll() {
    this.selectAll = this.cancelRefund.every((item: any) => item.selected);
  }

  // Get selected rows when needed
  getSelectedRows() {
    const selected = this.cancelRefund.filter((item: any) => item.selected);
    return selected;
  }

  copyMessage($event: any) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = $event;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  scheduleRecords() {
    const selectedBookingIds = this.cancelRefund
      .filter((item) => item.selected)
      .map((item) => item.id);

    console.log(selectedBookingIds);

    if (selectedBookingIds.length === 0) {
      alert('Please select at least one record!');
      return;
    }

    const param = {
      booking_ids: selectedBookingIds,
    };

    this.spinner.show();

    this.srs.getRefundSelected(param).subscribe((res) => {
      console.log(res);
      if (res.status == 1) {
        this.search();
        this.notificationService.addToast({
          title: 'Success',
          msg: res.message,
          type: 'success',
        });
      } else {
        this.notificationService.addToast({
          title: 'Error',
          msg: res.message,
          type: 'error',
        });
      }
      this.spinner.hide();
    });
  }
}
