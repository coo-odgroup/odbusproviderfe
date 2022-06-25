import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CompleteReport} from '../../model/completereport';
import { LocationService } from '../../services/location.service';
import { BusService} from '../../services/bus.service';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Constants} from '../../constant/constant' ;
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-busseatfarereport',
  templateUrl: './busseatfarereport.component.html',
  styleUrls: ['./busseatfarereport.component.scss']
})
export class BusseatfarereportComponent implements OnInit {

  public searchFrom: FormGroup;

  completeReport: CompleteReport[];
  completeReportRecord: CompleteReport;

  completedata: any;
  totalfare = 0  ;
  busoperators: any;
  url: any;
  locations: any;
  buses: any;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient , 
    private rs:ReportsService, 
    private busOperatorService: BusOperatorService, 
    private fb: FormBuilder,
    private locationService:LocationService,
    private busService:BusService,
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter
    ) { 
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getToday();
    }
    // title = 'angular-app';
    // fileName= 'Complete-Report.xlsx';

  ngOnInit(): void {
    this.spinner.show();

    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      rangeFromDate:[null],
      rangeToDate:[null],
      payment_id : [null],
      date_type:['journey'],
      pnr:[null],
      rows_number:10,
      source_id:[null],
      destination_id:[null]
    })  
   

    this.search();
    this.loadServices();

  }

  // exportexcel(): void
  // {
    
  //   /* pass here the table id */
  //   let element = document.getElementById('export-section');
  //   const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
  //   /* generate workbook and add the worksheet */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
  //   /* save to file */  
  //   XLSX.writeFile(wb, this.fileName);
 
  // }

  page(label:any){
    return label;
   }
  search(pageurl="")
  {
    this.spinner.hide();
     this.completeReportRecord = this.searchFrom.value ; 
     
    const data = {
      bus_operator_id: this.completeReportRecord.bus_operator_id,
      payment_id:this.completeReportRecord.payment_id,
      date_type :this.completeReportRecord.date_type,
      pnr :this.completeReportRecord.pnr,
      rows_number:this.completeReportRecord.rows_number,
      source_id:this.completeReportRecord.source_id,
      destination_id:this.completeReportRecord.destination_id,
      rangeFromDate:this.completeReportRecord.rangeFromDate,
      rangeToDate :this.completeReportRecord.rangeToDate
            
    };
    
    if(pageurl!="")
    {
      this.rs.seatFarepaginationReport(pageurl,data).subscribe(
        res => {
          this.completedata= res.data;
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.rs.seatFareReport(data).subscribe(
        res => {
          this.completedata = res.data;
          console.log(this.completedata);
          this.spinner.hide();
        }
      );
    }
  }

  refresh()
  {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      rangeFromDate:[null],
      rangeToDate:[null],
      payment_id : [null],
      pnr:[null],
      date_type:['journey'],
      rows_number: 10,
      // rows_number: Constants.RecordLimit,
      source_id:[null],
      destination_id:[null]

    })
    this.search();
  }



  loadServices() {

    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });

      }
    );
  }





}
