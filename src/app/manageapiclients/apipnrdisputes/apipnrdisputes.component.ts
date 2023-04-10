import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CompleteReport} from '../../model/completereport';
import { Apipnrdispute } from '../../model/apipnrdispute';
import { LocationService } from '../../services/location.service';
import { BusService} from '../../services/bus.service';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Constants} from '../../constant/constant' ;
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-apipnrdisputes',
    templateUrl: './apipnrdisputes.component.html',
    styleUrls: ['./apipnrdisputes.component.scss']
})

export class ApipnrdisputesComponent implements OnInit {

  public searchFrom: FormGroup;

  completeReport: CompleteReport[];
  completeReportRecord: CompleteReport;

  completedata: any;
  totalfare = 0;
  busoperators: any;
  url: any;
  locations: any;
  buses: any;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  allagent: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient , private notificationService: NotificationService,
    private rs:ReportsService, 
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
  fileName= 'API-PNR-Issue.csv';

  ngOnInit(): void {
    this.spinner.show();

    this.searchFrom = this.fb.group({
      user_id: [null],
      rows_number:10,
     
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
     
    const data = {
      user_id: this.completeReportRecord.user_id,   
      rows_number:this.completeReportRecord.rows_number,
                 
    };
       
    // console.log(data);
    
    if(pageurl!="")
    {
      this.rs.allapiclientissuedataReport(pageurl,data).subscribe(
        res => {
          this.completedata= res.data;
          // console.log( this.completedata);
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.rs.allapiclientissuedata(data).subscribe(
        res => {
          this.completedata= res.data;
          // console.log( this.completedata);
          this.spinner.hide();
        }
      );
    }    
  }

  update_status(event,id){
    // console.log(event);
    // console.log(id);

    if(event== ''){
      return
    }
    else{
      const data= {
        id:id,
        status:event,
        created_by:localStorage.getItem('USERNAME')
      };

      this.rs.apiclientissuestatue(data).subscribe(
        res =>{
          if (res.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: res.message, type: 'success' });
            // this.modalReference.close();
            this.refresh();
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: res.message, type: 'error' });
            this.spinner.hide();
          }
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
    this.spinner.show();
    this.searchFrom = this.fb.group({
      user_id: [null],   
      rows_number: 10,
    
    })
    this.search();
  }

  loadServices() 
  {
    this.busOperatorService.getApiClient().subscribe(
      res => {
        this.allagent = res.data;       
      }
    );
  }

  // findSource(event:any)
  // {
  //     let source_id=this.searchFrom.controls.source_id.value;
  //     let destination_id=this.searchFrom.controls.destination_id.value;

  //     if(source_id!="" && destination_id!="")
  //     {
  //       this.busService.findSource(source_id,destination_id).subscribe(
  //         res=>{
  //           this.buses=res.data;
  //         }
  //       );
  //     }
  //     else
  //     {
  //       this.busService.all().subscribe(
  //         res=>{
  //           this.buses=res.data;
  //         }
  //       );
  //     }
  // }


}
