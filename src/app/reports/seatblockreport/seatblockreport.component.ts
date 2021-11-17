import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusOperatorService } from './../../services/bus-operator.service';
import {SeatBlockReport} from '../../model/seatblockreport';
import { BusService} from '../../services/bus.service';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Constants} from '../../constant/constant' ;
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-seatblockreport',
  templateUrl: './seatblockreport.component.html',
  styleUrls: ['./seatblockreport.component.scss']
})
export class SeatblockreportComponent implements OnInit {
  

  public searchFrom: FormGroup;

  seatBlockReport: SeatBlockReport[];
  seatBlockReportRecord: SeatBlockReport;
  seatblockdata: any;
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
      fileName= 'Seat-Block-Report.xlsx';
 
  ngOnInit(): void {

    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      bus_id: [null],   
      rows_number: Constants.RecordLimit,
      rangeFromDate:[null],
      rangeToDate:[null]     
    })  
  

    this.search(); 
    this.loadServices(); 

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

  

  page(label:any){
    return label;
   }
   search(pageurl="")
  {
    this.seatBlockReportRecord = this.searchFrom.value ; 
     
    const data = {
      bus_operator_id: this.seatBlockReportRecord.bus_operator_id,
      bus_id: this.seatBlockReportRecord.bus_id,
      rows_number:this.seatBlockReportRecord.rows_number,  
      rangeFromDate:this.seatBlockReportRecord.rangeFromDate,
      rangeToDate :this.seatBlockReportRecord.rangeToDate,
      USER_BUS_OPERATOR_ID:localStorage.getItem('USER_BUS_OPERATOR_ID')
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.rs.seatblockpaginationReport(pageurl,data).subscribe(
        res => {
          this.seatblockdata= res.data;
          // console.log( this.seatblockdata);
        }
      );
    }
    else
    {
      this.rs.seatblockReport(data).subscribe(
        res => {
          this.seatblockdata= res.data;
          // console.log( this.seatblockdata);
        }
      );
    }


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

  
  loadServices() {

    this.busService.all().subscribe(
      res => {
        this.buses = res.data;
      }
    );
    
    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
        // console.log(this.busoperators);
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
