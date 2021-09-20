import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-cleartransactionreport',
  templateUrl: './cleartransactionreport.component.html',
  styleUrls: ['./cleartransactionreport.component.scss']
})
export class CleartransactionreportComponent implements OnInit {
  transactiondata: any;
  constructor(private http: HttpClient , private rs:ReportsService) { }

  ngOnInit(): void {
  
    this.getall();
  }


  getall() {
    this.rs.cleartransactionReport().subscribe(
      res => {
        this.transactiondata = res.data;
        console.log(this.transactiondata);
      }
    );
  }

}
