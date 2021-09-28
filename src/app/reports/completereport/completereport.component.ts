import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CompleteReport} from '../../model/completereport';
import { LocationService } from '../../services/location.service';
import { BusService} from '../../services/bus.service';





@Component({
  selector: 'app-completereport',
  templateUrl: './completereport.component.html',
  styleUrls: ['./completereport.component.scss']
})
export class CompletereportComponent implements OnInit {

  public searchFrom: FormGroup;

  completeReport: CompleteReport[];
  completeReportRecord: CompleteReport;

  completedata: any;
  totalfare = 0  ;
  busoperators: any;
  url: any;
  locations: any;
  buses: any;

  constructor(
    private http: HttpClient , 
    private rs:ReportsService, 
    private busOperatorService: BusOperatorService, 
    private fb: FormBuilder,
    private locationService:LocationService,
    private busService:BusService
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
   

    this.search();
    this.loadServices();

  }



  page(label:any){
    return label;
   }
  search(pageurl="")
  {
     this.completeReportRecord = this.searchFrom.value ; 
     
    const data = {
      bus_operator_id: this.completeReportRecord.bus_operator_id,
      date_range: this.completeReportRecord.date_range,
      payment_id:this.completeReportRecord.payment_id,
      date_type :this.completeReportRecord.date_type,
      rows_number:this.completeReportRecord.rows_number,
      source_id:this.completeReportRecord.source_id,
      destination_id:this.completeReportRecord.destination_id
            
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.rs.completepaginationReport(pageurl,data).subscribe(
        res => {
          this.completedata= res.data;
          // console.log( this.completedata);
        }
      );
    }
    else
    {
      this.rs.completeReport(data).subscribe(
        res => {
          this.completedata= res.data;
          // console.log( this.completedata);
        }
      );
    }


    
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
