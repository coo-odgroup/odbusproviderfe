import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-buscancellationreport',
  templateUrl: './buscancellationreport.component.html',
  styleUrls: ['./buscancellationreport.component.scss']
})
export class BuscancellationreportComponent implements OnInit {
  buscancellationdata: any;

  constructor(private http: HttpClient , private rs:ReportsService) { }

  ngOnInit(): void {
  
    this.getall();
  }


  getall() {
    this.rs.buscancellationReport().subscribe(
      res => {
        this.buscancellationdata= res.data; 
      }
    );
  }
}
