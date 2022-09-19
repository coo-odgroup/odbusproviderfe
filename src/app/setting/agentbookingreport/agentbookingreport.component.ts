import { Component, OnInit } from '@angular/core';
// import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { AgentallreportService } from './../../services/agentallreport.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CompleteReport} from '../../model/completereport';
import { LocationService } from '../../services/location.service';
import { BusService} from '../../services/bus.service';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Constants} from '../../constant/constant' ;
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-agentbookingreport',
  templateUrl: './agentbookingreport.component.html',
  styleUrls: ['./agentbookingreport.component.scss']
})
export class AgentbookingreportComponent implements OnInit {

  
  public searchFrom: FormGroup;

  completeReport: CompleteReport[];
  completeReportRecord: CompleteReport;

  completedata: any;
  totalfare = 0  ;
  busoperators: any;
  url: any;
  locations: any;
  buses: any;
  allagent: any;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient , 
    private rs:AgentallreportService, 
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
    title = 'angular-app';
    fileName= 'Agent-Booking-Report.csv';
  ngOnInit(): void {
    this.spinner.show();

    this.searchFrom = this.fb.group({
      rangeFromDate:[null],
      rangeToDate:[null],
      date_type:['journey'],
      pnr:[null],
      user_id:[null],
      rows_number: Constants.RecordLimit,
    })  
   

    this.search();
    this.loadServices();

  }

  exportexcel(): void
  {
    
    /* pass here the table id */
    let element = document.getElementById('export-section');
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
    this.spinner.show();
    this.completeReportRecord = this.searchFrom.value ; 
    //console.log(this.completeReportRecord);

    const data = {
      date_type :this.completeReportRecord.date_type,
      pnr :this.completeReportRecord.pnr,
      user_id :this.completeReportRecord.user_id,
      rows_number:this.completeReportRecord.rows_number,
      rangeFromDate:this.completeReportRecord.rangeFromDate,
      rangeToDate :this.completeReportRecord.rangeToDate
            
    };

    
    // console.log(data);
    if(pageurl!="")
    {
      this.rs.completepaginationReport(pageurl,data).subscribe(
        res => {
          this.completedata= res.data;
          //console.log( this.completedata);
          this.spinner.hide();
        }
      );
      // console.log(this.rs);
    }
    else
    {
      this.rs.completeReport(data).subscribe(
        res => {
          this.completedata= res.data;
          //console.log( this.completedata);
          this.spinner.hide();
        }
      );
    }


    
  }

  
  DisplayAllSeat(seatArr:any){
    let AllArr=[];
    seatArr.forEach(e => {
      AllArr.push(e.bus_seats.seats.seatText);      
    });

    return AllArr.join(',');

  }

///////////////Function to Copy data to Clipboard/////////////////
  copyMessage($event:any ){
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

  refresh()
  {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      rangeFromDate:[null],
      rangeToDate:[null],
      date_type:['journey'],
      user_id:[null],
      pnr:[null],
      rows_number: Constants.RecordLimit,
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
    this.locationService.readAll().subscribe(
      records=>{
        this.locations=records.data;
      }
    );

    this.busOperatorService.getAllAgent().subscribe(
      res => {
        // console.log(res.data);
        this.allagent = res.data;
        this.allagent.map((i: any) => { i.agentData = i.name + '   -(  ' + i.location  + '  )'; return i; });
        //console.log(this.allagent);
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
