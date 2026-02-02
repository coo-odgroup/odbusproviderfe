import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompleteReport } from '../../model/completereport';
import { LocationService } from '../../services/location.service';
import { BusService } from '../../services/bus.service';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from '../../constant/constant';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-archivecompletereport',
  templateUrl: './archivecompletereport.component.html',
  styleUrls: ['./archivecompletereport.component.scss']
})
export class ArchiveCompletereportComponent implements OnInit {

  public searchFrom: FormGroup;

  completeReport: CompleteReport[];
  completeReportRecord: CompleteReport;

  completedata: any;
  totalfare = 0;
  busoperators: any;
  url: any;
  locations: any;
  buses: any;
  CONSUMER_PUBLIC_URL = Constants.CONSUMER_PUBLIC_URL;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  completExportdata: any;
  totaldata: any = [];

  apiProvider = [
    { name: 'DOLPHIN' },
    { name: 'MANTIS' }
  ];
  role = localStorage.getItem('ROLE_ID');

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private rs: ReportsService,
    private busOperatorService: BusOperatorService,
    private fb: FormBuilder,
    private locationService: LocationService,
    private busService: BusService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getToday();

  }
  title = 'angular-app';
  fileName = 'Complete-Report.csv';
  years: number[] = [];
  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const startYear = 2022;

    for (let y = currentYear - 2; y >= startYear; y--) {
      this.years.push(y);
    }

    this.spinner.show();


    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      rangeFromDate: [null],
      rangeToDate: [null],
      payment_id: [null],
      date_type: ['journey'],
      pnr: [null],
      rows_number: 100,
      source_id: [null],
      destination_id: [null],
      hasGst: [null],
      apiUser: [null],
      device_type: [null],
      year: [null]

    })


    this.searchFrom.get('year')?.valueChanges.subscribe((year) => {
      if (!year) return;

      this.searchFrom.patchValue({
        rangeFromDate: `${year}-01-01`,
        rangeToDate: `${year}-12-31`
      }, { emitEvent: false }); // 🚫 avoid loop
    });

    this.searchFrom.valueChanges.subscribe((value) => {
      const from = value.rangeFromDate;
      const to = value.rangeToDate;

      if (from && to) {
        const fromYear = new Date(from).getFullYear();
        const toYear = new Date(to).getFullYear();

        if (fromYear === toYear) {
          this.searchFrom.patchValue(
            { year: fromYear },
            { emitEvent: false }
          );
        } else {
          this.searchFrom.patchValue(
            { year: null },
            { emitEvent: false }
          );
        }
      }
    });


    this.search();
    this.loadServices();

  }

  exportexcel(): void {
    this.spinner.show();
    // this.completeReportRecord = this.searchFrom.value ; 
    this.completExportdata = '';

    const data = {
      bus_operator_id: this.searchFrom.value.bus_operator_id,
      payment_id: this.searchFrom.value.payment_id,
      date_type: this.searchFrom.value.date_type,
      pnr: this.searchFrom.value.pnr,
      rows_number: 'all',
      source_id: this.searchFrom.value.source_id,
      destination_id: this.searchFrom.value.destination_id,
      rangeFromDate: this.searchFrom.value.rangeFromDate,
      rangeToDate: this.searchFrom.value.rangeToDate,
      hasGst: this.searchFrom.value.hasGst,
      apiUser: this.searchFrom.value.apiUser,
      device_type: this.searchFrom.value.device_type,
    };

    this.rs.completeReport(data).subscribe(
      res => {
        this.completExportdata = res.data;
        let length = this.completExportdata.data.data.length;
        // console.log(length);
        if (length != 0) {
          setTimeout(() => {
            this.exportdata();
          }, 3 * 1000);
        }
      }
    );
  }

  exportdata(): void {
    let element = document.getElementById('export-section');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

    this.spinner.hide();
  }

  page(label: any) {
    return label;
  }
  search(pageurl = "") {
    this.spinner.show();
    this.completeReportRecord = this.searchFrom.value;

    const data = {
      bus_operator_id: this.completeReportRecord.bus_operator_id,
      payment_id: this.completeReportRecord.payment_id,
      date_type: this.completeReportRecord.date_type,
      pnr: this.completeReportRecord.pnr,
      rows_number: this.completeReportRecord.rows_number,
      source_id: this.completeReportRecord.source_id,
      destination_id: this.completeReportRecord.destination_id,
      rangeFromDate: this.completeReportRecord.rangeFromDate,
      rangeToDate: this.completeReportRecord.rangeToDate,
      hasGst: this.completeReportRecord.hasGst,
      apiUser: this.searchFrom.value.apiUser,
      device_type: this.searchFrom.value.device_type,
      year: this.searchFrom.value.year,
      USER_BUS_OPERATOR_ID: localStorage.getItem("BUS_OPERATOR_ID")
    };

    // console.log(data);


    if (pageurl != "") {
      this.rs.completepaginationReport(pageurl, data).subscribe(
        res => {
          this.completedata = res.data;
          this.totaldata = res;
          console.log(this.totaldata)
          this.spinner.hide();
        }
      );
    }
    else {
      this.rs.archivecompleteReport(data).subscribe(
        res => {
          this.completedata = res.data;
          this.totaldata = res;
          console.log(this.totaldata)
          // console.log(this.completedata.data[0].bus_id)
          this.spinner.hide();
        }
      );
    }

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
      rangeFromDate: [null],
      rangeToDate: [null],
      payment_id: [null],
      pnr: [null],
      date_type: ['journey'],
      rows_number: 100,
      // rows_number: Constants.RecordLimit,
      source_id: [null],
      destination_id: [null],
      hasGst: [null],
      apiUser: [null],
      device_type: [null],

    })
    this.search();
  }



  loadServices() {
    const BusOperator = {
      USER_BUS_OPERATOR_ID: localStorage.getItem("BUS_OPERATOR_ID")
    };
    if (BusOperator.USER_BUS_OPERATOR_ID != "" && localStorage.getItem('ROLE_ID') != '1') {
      this.busOperatorService.readOne(BusOperator.USER_BUS_OPERATOR_ID).subscribe(
        record => {
          this.busoperators = record.data;
          this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name + '  )'; return i; });
        }
      );
    }
    else {
      this.busOperatorService.readAll().subscribe(
        record => {
          this.busoperators = record.data;
          this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name + '  )'; return i; });
        }
      );
    }


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



}
