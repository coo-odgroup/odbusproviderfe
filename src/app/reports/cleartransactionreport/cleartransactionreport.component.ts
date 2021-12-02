import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-cleartransactionreport',
  templateUrl: './cleartransactionreport.component.html',
  styleUrls: ['./cleartransactionreport.component.scss']
})
export class CleartransactionreportComponent implements OnInit {
  transactiondata: any;
  constructor(  private spinner: NgxSpinnerService,private http: HttpClient , private rs:ReportsService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getall();
  }


  getall() {
    this.rs.cleartransactionReport().subscribe(
      res => {
        this.transactiondata = res.data;
        // console.log(this.transactiondata);
        this.spinner.hide();
      }
    );
  }

}
