import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusOperatorService } from './../../services/bus-operator.service';

import {ExtraSeatOpenReportReport } from '../../model/extraseatopenreport';
import { BusService} from '../../services/bus.service';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Constants} from '../../constant/constant' ;
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-extraseatopenreport',
  templateUrl: './extraseatopenreport.component.html',
  styleUrls: ['./extraseatopenreport.component.scss']
})
export class ExtraseatopenreportComponent implements OnInit {
  seatopen: any ;
  public searchFrom: FormGroup;

  seatOpenReport: ExtraSeatOpenReportReport[];
  seatOpenReportRecord: ExtraSeatOpenReportReport;
  seatopendata: any;
  busoperators: any;
  buses: any;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  
   
    constructor( 
      private http: HttpClient, 
      private rs: ReportsService,
      private fb: FormBuilder,
      private busOperatorService: BusOperatorService,
      private busService:BusService, 
      private calendar: NgbCalendar, 
      public formatter: NgbDateParserFormatter
      ) { 
        this.fromDate = calendar.getToday();
        this.toDate = calendar.getToday();
      }
      title = 'angular-app';
      fileName= 'Seat-Open-Report.xlsx';
  ngOnInit(): void {

    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      bus_id: [null],  
      rows_number: Constants.RecordLimit,
      rangeFromDate:[null],
      rangeToDate:[null]
    })  
  
    // this.getall();
    this.search(); 
    this.loadServices(); 

  }
  

  page(label:any){
    return label;
   }
   search(pageurl="")
  {
    this.seatOpenReportRecord = this.searchFrom.value ; 
     
    const data = {
      bus_operator_id: this.seatOpenReportRecord.bus_operator_id,
      bus_id: this.seatOpenReportRecord.bus_id,
      rows_number:this.seatOpenReportRecord.rows_number,  
      USER_BUS_OPERATOR_ID:localStorage.getItem('USER_BUS_OPERATOR_ID')
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.rs.extraseatopenpaginationReport(pageurl,data).subscribe(
        res => {
          this.seatopendata= res.data;
          // console.log( this.seatopendata);
        }
      );
    }
    else
    {
      this.rs.extraseatopenReport(data).subscribe(
        res => {
          this.seatopendata= res.data;
          console.log( this.seatopendata);
        }
      );
    }


  }


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


  refresh()
  {
    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      bus_id: [null],  
      rows_number: Constants.RecordLimit,
      rangeFromDate:[null],
      rangeToDate:[null]
    })  
    
    this.loadServices();
    this.search();
  }
 

  
  loadServices() {

    this.busService.all().subscribe(
      res => {
        this.buses = res.data;
      }
    );
    
    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;

      }
    );

  }

  findOperator(event: any) {
    let operatorId = event.id;
    if (operatorId) {
      this.busService.getByOperaor(operatorId).subscribe(
        res => {
          this.buses = res.data;
        }
      );
    }

  }


}
