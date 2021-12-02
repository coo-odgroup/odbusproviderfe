import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusOperatorService } from './../../services/bus-operator.service';
import { LocationService } from '../../services/location.service';
import { BusService} from '../../services/bus.service';
import {CouponUsedUserReport } from '../../model/couponuseduserreport';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Constants} from '../../constant/constant' ;
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-couponuseduserreport',
  templateUrl: './couponuseduserreport.component.html',
  styleUrls: ['./couponuseduserreport.component.scss']
})
export class CouponuseduserreportComponent implements OnInit {

  public searchFrom: FormGroup;

  couponUseUserReport: CouponUsedUserReport[];
  couponUseUserReportRecord: CouponUsedUserReport;

  couponused: any;
  busoperators: any;
  locations: any;
  buses: any;
  // completedata: any;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;


  constructor(
     private spinner: NgxSpinnerService,
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


  ngOnInit(): void {
    
  this.spinner.show();
    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      payment_id : [null],
      date_type:['booking'],
      rows_number: Constants.RecordLimit,
      source_id:[null],
      destination_id:[null],
      rangeFromDate:[null],
      rangeToDate :[null],
      coupon:[null]

    })  
    this.search(); 
    this.loadServices();
  }
  
  page(label:any){
    return label;
   }
  search(pageurl="")
  {
    
     this.spinner.show();
     this.couponUseUserReportRecord = this.searchFrom.value ; 
     
    const data = {
      bus_operator_id: this.couponUseUserReportRecord.bus_operator_id,
      payment_id:this.couponUseUserReportRecord.payment_id,
      date_type :this.couponUseUserReportRecord.date_type,
      rows_number:this.couponUseUserReportRecord.rows_number,
      source_id:this.couponUseUserReportRecord.source_id,
      destination_id:this.couponUseUserReportRecord.destination_id,
      rangeFromDate:this.couponUseUserReportRecord.rangeFromDate,
      rangeToDate :this.couponUseUserReportRecord.rangeToDate,
      coupon:this.couponUseUserReportRecord.coupon
            
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.rs.couponUsedUserpaginationReport(pageurl,data).subscribe(
        res => {
          this.couponused= res.data;
          // console.log( this.couponused);
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.rs.couponUsedUserReport(data).subscribe(
        res => {
          this.couponused= res.data;
          // console.log( this.couponused);
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
      payment_id : [null],
      date_type:['booking'],
      rows_number: Constants.RecordLimit,
      source_id:[null],
      destination_id:[null],
      rangeFromDate:[null],
      rangeToDate :[null],
      coupon:[null]

    })

    this.search();
  }

  title = 'angular-app';
  fileName= 'Coupan-USed-User-Report.xlsx';
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
