import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-seatopenreport',
  templateUrl: './seatopenreport.component.html',
  styleUrls: ['./seatopenreport.component.scss']
})
export class SeatopenreportComponent implements OnInit {

  seatopen: any ;
   
    constructor( private http: HttpClient, private rs: ReportsService) { }

  ngOnInit(): void {

    this.getall();

  }


  getall() {
    this.rs.seatopenReport().subscribe(
      res => {
        this.seatopen= res.data;
        // console.log(this.seatopen);
      }
    );
  }

}
