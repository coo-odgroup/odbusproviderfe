import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-completereport',
  templateUrl: './completereport.component.html',
  styleUrls: ['./completereport.component.scss']
})
export class CompletereportComponent implements OnInit {
  completedata: any;
  totalfare: any;

  constructor(private http: HttpClient , private rs:ReportsService) { }

  ngOnInit(): void {
    this.getall();
  }


  getall() {
    this.rs.completeReport().subscribe(
      res => {
        this.completedata= res.data;
        // console.log(this.completedata.booking_detail.owner_fare);
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
