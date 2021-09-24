import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-completereport',
  templateUrl: './completereport.component.html',
  styleUrls: ['./completereport.component.scss']
})
export class CompletereportComponent implements OnInit {

  public searchFrom: FormGroup;
  completedata: any;
  totalfare = 0  ;
  busoperators: any;

  constructor(private http: HttpClient , private rs:ReportsService, private busOperatorService: BusOperatorService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      date: [null],
      payment_id : [null],
      date_type:[null]
    })  
    this.getall();
    this.loadServices();

  }


  getall() {
    this.rs.completeReport().subscribe(
      res => {
        this.completedata= res.data;
      }
    );
  }

  search()
  {
     console.log(this.searchFrom.value);
     
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



  loadServices() {
    // this.busService.all().subscribe(
    //   res => {
    //     this.buses = res.data;
    //   }
    // );
    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
      }
    );
    // this.locationService.readAll().subscribe(
    //   records => {
    //     this.locations = records.data;
    //   }
    // );
  }

}
