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
      rows_number: 50,
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
      rows_number: 50,
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
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });

      }
    );
 
  }

}
