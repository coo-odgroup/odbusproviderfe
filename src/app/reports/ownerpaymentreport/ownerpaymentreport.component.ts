import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-ownerpaymentreport',
  templateUrl: './ownerpaymentreport.component.html',
  styleUrls: ['./ownerpaymentreport.component.scss']
})
export class OwnerpaymentreportComponent implements OnInit {
  completedata: any;
  constructor(private http: HttpClient , private rs:ReportsService) { }

  ngOnInit(): void {
  
    this.getall();
  }


  getall() {
    this.rs.ownerpaymentReport().subscribe(
      res => {
        this.completedata= res.data;
        console.log(this.completedata);
      }
    );
  }

}
