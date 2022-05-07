import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FailedtransactionReport } from '../../model/failedtransactionreport';
import { LocationService } from '../../services/location.service';
import { BusService } from '../../services/bus.service';
import { NotificationService } from '../../services/notification.service';
import { GenerateFailledTransactionService } from '../../services/generate-failled-transaction.service';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from '../../constant/constant';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-failedtransactionreport',
  templateUrl: './failedtransactionreport.component.html',
  styleUrls: ['./failedtransactionreport.component.scss']
})
export class FailedtransactionreportComponent implements OnInit {
  public searchFrom: FormGroup;
  modalReference: NgbModalRef;
  failedtransactionReport: FailedtransactionReport[];
  failedtransactionReportRecord: FailedtransactionReport;

  completedata: any;
  totalfare = 0;
  busoperators: any;
  url: any;
  locations: any;
  buses: any;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  comData: any;
  bus_seats: any;
  seatIDs: any = [];
  seatStatu: any;


  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private rs: ReportsService,
    private busOperatorService: BusOperatorService,
    private fb: FormBuilder,
    private locationService: LocationService,
    private busService: BusService, private notificationService: NotificationService,
    private gfts: GenerateFailledTransactionService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal, config: NgbModalConfig
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getToday();
    config.backdrop = 'static';
    config.keyboard = false;
  }

  title = 'angular-app';
  fileName = 'Failled-Transaction-Report.xlsx';

  ngOnInit(): void {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      payment_id: [null], pnr: [null],
      date_type: ['booking'],
      rows_number: 50,
      source_id: [null],
      destination_id: [null],
      rangeFromDate: [null],
      rangeToDate: [null]

    })


    this.search();
    this.loadServices();
  }

  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'md' });
  }

  page(label: any) {
    return label;
  }
  search(pageurl = "") {
    this.spinner.show();
    this.failedtransactionReportRecord = this.searchFrom.value;

    const data = {
      bus_operator_id: this.failedtransactionReportRecord.bus_operator_id,
      payment_id: this.failedtransactionReportRecord.payment_id,
      pnr: this.failedtransactionReportRecord.pnr,
      date_type: this.failedtransactionReportRecord.date_type,
      rows_number: this.failedtransactionReportRecord.rows_number,
      source_id: this.failedtransactionReportRecord.source_id,
      destination_id: this.failedtransactionReportRecord.destination_id,
      rangeFromDate: this.failedtransactionReportRecord.rangeFromDate,
      rangeToDate: this.failedtransactionReportRecord.rangeToDate
    };

    if (pageurl != "") {
      this.rs.failledtransactionpaginationReport(pageurl, data).subscribe(
        res => {
          this.completedata = res.data;
          this.spinner.hide();
        }
      );
    }
    else {
      this.rs.failledtransactionReport(data).subscribe(
        res => {
          this.completedata = res.data;
          this.spinner.hide();
        }
      );
    }



  }




  exportexcel(): void {

    /* pass here the table id */
    let element = document.getElementById('export-section');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }


  ///////////////Function to Copy data to Clipboard/////////////////
  copyMessage($event: any) {
    // console.log($event);
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


  refresh() {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      payment_id: [null], pnr: [null],
      date_type: ['booking'],
      rows_number: 50,
      source_id: [null],
      destination_id: [null],
      rangeFromDate: [null],
      rangeToDate: [null]

    })
    this.search();
  }


  loadServices() {

    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name + '  )'; return i; });

      }
    );
    this.locationService.readAll().subscribe(
      records => {
        this.locations = records.data;
      }
    );
  }

  findSource(event: any) {
    let source_id = this.searchFrom.controls.source_id.value;
    let destination_id = this.searchFrom.controls.destination_id.value;


    if (source_id != "" && destination_id != "") {
      this.busService.findSource(source_id, destination_id).subscribe(
        res => {
          this.buses = res.data;
        }
      );
    }
    else {
      this.busService.all().subscribe(
        res => {
          this.buses = res.data;
        }
      );
    }
  }

  generateTicket(id) {

    this.comData = [];
    this.seatIDs = [];
    this.seatStatu = null;
    this.comData = this.completedata.data.data[id];

    for (let items of this.comData.booking_detail) {

      this.seatIDs.push(items.bus_seats.seats.id);
    }

    const data =
    {
      'entry_date': this.comData.journey_dt,
      'busId': this.comData.bus_id,
      'sourceId': this.comData.source_id,
      'destinationId': this.comData.destination_id,
      'seatIds': this.seatIDs
    }
    this.gfts.CheckSeat(data).subscribe(
      res => {
        this.seatStatu = res.data;
        if (res.data == 'SEAT AVAIL') {
          // console.log(this.comData);
          const bookingData =
          {
            'booking_id': this.comData.id,
            "created_by": localStorage.getItem('USERNAME')
          }
          this.gfts.generateTicket(bookingData).subscribe(
            resp => {
              if (resp.status == 1) {
                this.notificationService.addToast({ title: Constants.SuccessTitle, msg: "Ticket has been generated", type: Constants.SuccessType });
                this.search();
              }
              else {
                this.notificationService.addToast({ title: Constants.ErrorTitle, msg: resp.data, type: Constants.ErrorType });
              }
            }
          );
        }
        else {
          this.notificationService.addToast({ title: Constants.ErrorTitle, msg: res.data, type: Constants.ErrorType });
        }
      }
    );
  }
}
