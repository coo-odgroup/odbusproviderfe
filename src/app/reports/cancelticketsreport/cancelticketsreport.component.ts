import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusOperatorService } from './../../services/bus-operator.service';
import { LocationService } from '../../services/location.service';
import { BusService} from '../../services/bus.service';
import {CancelTicketsReport } from '../../model/cancelticketsreports';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Constants} from '../../constant/constant' ;
import * as XLSX from 'xlsx';





@Component({
  selector: 'app-cancelticketsreport',
  templateUrl: './cancelticketsreport.component.html',
  styleUrls: ['./cancelticketsreport.component.scss']
})
export class CancelticketsreportComponent implements OnInit {

  public searchFrom: FormGroup;

  cancelTicketsReport: CancelTicketsReport[];
  cancelTicketsReportRecord: CancelTicketsReport;

  cancelticketdata: any;
  busoperators: any;
  locations: any;
  buses: any;
  // completedata: any;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;


  constructor(
     private http: HttpClient ,
     private fb: FormBuilder,
     private locationService:LocationService,
     private busService:BusService, 
     private rs:ReportsService,
     private busOperatorService: BusOperatorService ,
     private calendar: NgbCalendar, 
     public formatter: NgbDateParserFormatter 
    ) {
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getToday();
     }

     title = 'angular-app';
     fileName= 'Cancel-Ticket-Report.xlsx';

  ngOnInit(): void {

    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      payment_id : [null],
      date_type:['booking'],
      rows_number: Constants.RecordLimit,
      source_id:[null],
      destination_id:[null],
      rangeFromDate:[null],
      rangeToDate :[null]

    })  
    this.search(); 
    this.loadServices();
  }
  
  page(label:any){
    return label;
   }
  search(pageurl="")
  {
     this.cancelTicketsReportRecord = this.searchFrom.value ; 
     
    const data = {
      bus_operator_id: this.cancelTicketsReportRecord.bus_operator_id,
      payment_id:this.cancelTicketsReportRecord.payment_id,
      date_type :this.cancelTicketsReportRecord.date_type,
      rows_number:this.cancelTicketsReportRecord.rows_number,
      source_id:this.cancelTicketsReportRecord.source_id,
      destination_id:this.cancelTicketsReportRecord.destination_id,
      rangeFromDate:this.cancelTicketsReportRecord.rangeFromDate,
      rangeToDate :this.cancelTicketsReportRecord.rangeToDate
            
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.rs.cancelticketpaginationReport(pageurl,data).subscribe(
        res => {
          this.cancelticketdata= res.data;
          // console.log( this.cancelticketdata);
        }
      );
    }
    else
    {
      this.rs.cancelticketReport(data).subscribe(
        res => {
          this.cancelticketdata= res.data;
          // console.log( this.cancelticketdata);
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
    this.searchFrom.reset();
    this.search();
  }


  
  loadServices() {

    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
      }
    );
    this.locationService.readAll().subscribe(
      records=>{
        this.locations=records.data;
      }
    );
  }

  findSource(event:any)
  {
    let source_id=this.searchFrom.controls.source_id.value;
    let destination_id=this.searchFrom.controls.destination_id.value;
  
  
    if(source_id!="" && destination_id!="")
    {
      this.busService.findSource(source_id,destination_id).subscribe(
        res=>{
          this.buses=res.data;
        }
      );
    }
    else
    {
      this.busService.all().subscribe(
        res=>{
          this.buses=res.data;
        }
      );
    }
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
