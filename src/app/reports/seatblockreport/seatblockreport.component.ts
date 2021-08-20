import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-seatblockreport',
  templateUrl: './seatblockreport.component.html',
  styleUrls: ['./seatblockreport.component.scss']
})
export class SeatblockreportComponent implements OnInit {
  
  seatblock: any;

  constructor(private http: HttpClient , private rs:ReportsService) { }

  ngOnInit(): void {

    this.getall();
  }


  getall() {
    this.rs.seatblockReport().subscribe(
      res => {
        this.seatblock= res.data;
        // console.log(this.seatblock);
      }
    );
  }

}
