import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusOperatorService } from './../../services/bus-operator.service';
import {ExtraSeatOpenReportReport } from '../../model/extraseatopenreport';
import {Constants} from '../../constant/constant' ;


@Component({
  selector: 'app-extraseatopenreport',
  templateUrl: './extraseatopenreport.component.html',
  styleUrls: ['./extraseatopenreport.component.scss']
})
export class ExtraseatopenreportComponent implements OnInit {
  extraseatopen: any;

  public searchFrom: FormGroup;

  extraSeatOpenReport: ExtraSeatOpenReportReport[];
  extraSeatOpenReportRecord: ExtraSeatOpenReportReport;
  busoperators: any;
  extraSeatOpen: any;

  constructor(
        private http: HttpClient , 
        private rs:ReportsService,
        private fb: FormBuilder,
        private busOperatorService: BusOperatorService 
        ) { }

  ngOnInit(): void {

    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      rows_number: Constants.RecordLimit,
    })

    // this.getall();
    this.loadServices();
    this.search();
  }


  // getall() {
  //   this.rs.extraseatopenReport().subscribe(
  //     res => {
  //       this.extraseatopen= res.data;
  //       // console.log(this.extraseatopen);
  //     }
  //   );
  // }

  search(pageurl="")
  {
     this.extraSeatOpenReportRecord = this.searchFrom.value ; 
     
    const data = {
      bus_operator_id: this.extraSeatOpenReportRecord.bus_operator_id,
      rows_number: this.extraSeatOpenReportRecord.rows_number            
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.rs.extraseatopenpaginationReport(pageurl,data).subscribe(
        res => {
          this.extraSeatOpen= res.data;
          // console.log( this.extraSeatOpen);
        }
      );
    }
    else
    {
      this.rs.extraseatopenReport(data).subscribe(
        res => {
          this.extraSeatOpen= res.data;
          // console.log( this.extraSeatOpen);
        }
      );
    }


    
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
  }


}
