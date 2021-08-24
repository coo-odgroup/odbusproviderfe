import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-extraseatopenreport',
  templateUrl: './extraseatopenreport.component.html',
  styleUrls: ['./extraseatopenreport.component.scss']
})
export class ExtraseatopenreportComponent implements OnInit {
  extraseatopen: any;

  constructor(private http: HttpClient , private rs:ReportsService) { }

  ngOnInit(): void {

    this.getall();
  }


  getall() {
    this.rs.extraseatopenReport().subscribe(
      res => {
        this.extraseatopen= res.data;
        // console.log(this.extraseatopen);
      }
    );
  }

}
