import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-failedtransactionreport',
  templateUrl: './failedtransactionreport.component.html',
  styleUrls: ['./failedtransactionreport.component.scss']
})
export class FailedtransactionreportComponent implements OnInit {
  completedata: any;
  totalfare = 0  ;

  constructor(private http: HttpClient , private rs:ReportsService) { }

  ngOnInit(): void {
  
    this.getall();
  }


  getall() {
    this.rs.failledtransactionReport().subscribe(
      res => {
        this.completedata= res.data;
      }
    );
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

}
