import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusOperatorService } from './../../services/bus-operator.service';
import { LocationService } from '../../services/location.service';
import { BusService} from '../../services/bus.service';
import {CancelTicketsReport } from '../../model/cancelticketsreports'





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

  constructor(
     private http: HttpClient ,
     private fb: FormBuilder,
     private locationService:LocationService,
     private busService:BusService, 
     private rs:ReportsService,
     private busOperatorService: BusOperatorService
     ) { }

  ngOnInit(): void {

    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      date_range: [null],
      payment_id : [null],
      date_type:['booking'],
      rows_number: 10,
      source_id:[null],
      destination_id:[null]

    })  
  
    // this.getall();
    this.search(); 
    this.loadServices();
  }


  // getall() {
  //   this.rs.cancelticketReport().subscribe(
  //     res => {
  //       this.cancelticketdata= res.data; 
  //     }
  //   );
  // }
  
  page(label:any){
    return label;
   }
  search(pageurl="")
  {
     this.cancelTicketsReportRecord = this.searchFrom.value ; 
     
    const data = {
      bus_operator_id: this.cancelTicketsReportRecord.bus_operator_id,
      date_range: this.cancelTicketsReportRecord.date_range,
      payment_id:this.cancelTicketsReportRecord.payment_id,
      date_type :this.cancelTicketsReportRecord.date_type,
      rows_number:this.cancelTicketsReportRecord.rows_number,
      source_id:this.cancelTicketsReportRecord.source_id,
      destination_id:this.cancelTicketsReportRecord.destination_id
            
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
          console.log( this.cancelticketdata);
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


}
