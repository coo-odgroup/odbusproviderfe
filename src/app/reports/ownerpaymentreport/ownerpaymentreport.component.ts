import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OwnerpaymentReport } from '../../model/ownerpaymentreport';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Constants} from '../../constant/constant' ;
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";



@Component({
  selector: 'app-ownerpaymentreport',
  templateUrl: './ownerpaymentreport.component.html',
  styleUrls: ['./ownerpaymentreport.component.scss']
})
export class OwnerpaymentreportComponent implements OnInit {
  public searchFrom: FormGroup;
  
  completedata: any;
  ownerpaymentReport: OwnerpaymentReport[];
  ownerpaymentReportRecord: OwnerpaymentReport;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;


  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient , 
    private rs:ReportsService ,  
    private fb: FormBuilder, 
    private busOperatorService: BusOperatorService, 
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter 
    ) 
    {
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getToday();
    }
  busoperators: any;
  ngOnInit(): void {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      date_range: [null],
      rows_number: Constants.RecordLimit,
      rangeFromDate:[null],
      rangeToDate :[null]

    })  
   
  
    this.search();
    this.loadServices();
  }
     title = 'angular-app';
     fileName= 'Owner-Payment-Report.xlsx';

  page(label:any){
    return label;
   }


  search(pageurl="")
  {
    this.spinner.show();
     this.ownerpaymentReportRecord = this.searchFrom.value ; 
     
    const data = {
      bus_operator_id: this.ownerpaymentReportRecord.bus_operator_id,
      date_range: this.ownerpaymentReportRecord.date_range,
      rows_number:this.ownerpaymentReportRecord.rows_number, 
      rangeFromDate:this.ownerpaymentReportRecord.rangeFromDate,
      rangeToDate :this.ownerpaymentReportRecord.rangeToDate      
    };
      
    // console.log(data);


    if(pageurl!="")
    {
      this.rs.ownerpaymentpaginationReport(pageurl,data).subscribe(
        res => {
          this.completedata= res.data;
          // console.log( this.completedata);
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.rs.ownerpaymentReport(data).subscribe(
        res => {
          this.completedata= res.data;
          // console.log( this.completedata);
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
      date_range: [null],
      rows_number: Constants.RecordLimit,
      rangeFromDate:[null],
      rangeToDate :[null]

    })  
    this.search();
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

  loadServices() {

    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
      }
    );
 
  }


  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
  
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
  
    return [year, month, day].join('-');
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.searchFrom.controls.rangeFromDate.setValue(date);
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.searchFrom.controls.rangeToDate.setValue(date);
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.searchFrom.controls.rangeFromDate.setValue(date);
    }
  }
  
  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }
  
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }
  
  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

}
