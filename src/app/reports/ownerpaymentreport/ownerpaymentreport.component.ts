import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OwnerpaymentReport } from '../../model/ownerpaymentreport';



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

  constructor(private http: HttpClient , private rs:ReportsService ,  private fb: FormBuilder, private busOperatorService: BusOperatorService,) { }
  busoperators: any;
  ngOnInit(): void {

    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      date_range: [null],
      rows_number: 10,

    })  
   
  
    this.search();
    this.loadServices();
  }


  // getall() {
  //   this.rs.ownerpaymentReport().subscribe(
  //     res => {
  //       this.completedata= res.data;
  //       // console.log(this.completedata);
  //     }
  //   );
  // }

  page(label:any){
    return label;
   }


  search(pageurl="")
  {
     this.ownerpaymentReportRecord = this.searchFrom.value ; 
     
    const data = {
      bus_operator_id: this.ownerpaymentReportRecord.bus_operator_id,
      date_range: this.ownerpaymentReportRecord.date_range,
      rows_number:this.ownerpaymentReportRecord.rows_number,       
    };
      
    // console.log(data);


    if(pageurl!="")
    {
      this.rs.ownerpaymentpaginationReport(pageurl,data).subscribe(
        res => {
          this.completedata= res.data;
          // console.log( this.completedata);
        }
      );
    }
    else
    {
      this.rs.ownerpaymentReport(data).subscribe(
        res => {
          this.completedata= res.data;
          // console.log( this.completedata);
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
