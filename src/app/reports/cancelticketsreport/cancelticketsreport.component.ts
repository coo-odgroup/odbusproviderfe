import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-cancelticketsreport',
  templateUrl: './cancelticketsreport.component.html',
  styleUrls: ['./cancelticketsreport.component.scss']
})
export class CancelticketsreportComponent implements OnInit {

  cancelticketdata: any;

  constructor(private http: HttpClient , private rs:ReportsService) { }

  ngOnInit(): void {
  
    this.getall();
  }


  getall() {
    this.rs.cancelticketReport().subscribe(
      res => {
        this.cancelticketdata= res.data; 
      }
    );
  }


}
