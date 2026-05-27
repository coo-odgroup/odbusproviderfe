import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { Constants } from '../../constant/constant';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-managedistance',
  templateUrl: './managedistance.component.html',
  styleUrls: ['./managedistance.component.scss']
})
export class ManageDistanceComponent implements OnInit {

  public searchFrom!: FormGroup;
  public updateFrom!: FormGroup;


  apiUrl = Constants.BASE_URL;
  role = sessionStorage.getItem('ROLE_ID');

  cityContent: any;
  routesData: any;
  locationsData: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private rs: ReportsService,
    private busOperatorService: BusOperatorService,
    private fb: FormBuilder,
    private locationService: LocationService,
    public formatter: NgbDateParserFormatter,
    private notificationService: NotificationService
  ) {

  }
  title = 'angular-app';
  fileName = 'Complete-Report.csv';
  ngOnInit(): void {
    this.spinner.hide();


    this.searchFrom = this.fb.group({
      route_id: [null],
    })

    this.updateFrom = this.fb.group({
      id: [null],
      content: [null],
    })

    // this.search();
    this.getRoute();
    // this.loadServices();

  }

  getRoute() {
    this.http.post(this.apiUrl + '/getroutes', '').subscribe((res: any) => {
      this.routesData = res.data;
      // console.log(this.routesData)
    });
  }


  search() {
    this.spinner.show();

    const formData = this.searchFrom.value;

    this.http.post(this.apiUrl + '/getlocation', formData).subscribe((res: any) => {
      // console.log(res.data);
      this.locationsData = res.data;

      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      console.error(err);
    });
  }


  saveAll() {
    const USERID = localStorage.getItem('USERID');
    const payload = this.locationsData
      .flat()
      .map((item: any) => ({
        id: item.id,
        distance: item.distance,
        user_id: USERID
      }));

    // console.log(payload);

    this.http.post(this.apiUrl + '/updateDistance', payload).subscribe((res: any) => {
      console.log(res)
      this.notificationService.addToast({ title: 'Success', msg: res.message, type: 'success' });
    });
  }


  refresh() {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      route_id: [null],
    })
    this.spinner.hide();
  }


  // downloadCSV() {

  //   let csvData: any[] = [];

  //   this.locationsData.forEach((pair: any) => {

  //     // FIRST LOCATION
  //     if (pair[0]) {
  //       csvData.push({
  //         Source: pair[0].source,
  //         Destination: pair[0].destination,
  //         Distance: pair[0].distance
  //       });
  //     }

  //   });

  //   // CSV HEADER
  //   const headers = ['Source', 'Destination', 'Distance'];
  //   // CSV ROWS
  //   const rows = csvData.map(item =>
  //     [item.Source, item.Destination, item.Distance].join(',')
  //   );
  //   const csvContent = [headers.join(','), ...rows].join('\n');
  //   // DOWNLOAD FILE
  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //   const link = document.createElement('a');
  //   const url = URL.createObjectURL(blob);
  //   link.setAttribute('href', url);
  //   link.setAttribute('download', 'distance-data.csv');
  //   link.style.visibility = 'hidden';
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }

  downloadCSV() {

    let csvData: any[] = [];

    this.locationsData.forEach((pair: any) => {

      // FIRST LOCATION
      if (pair[0]) {

        csvData.push({
          Source: pair[0].source,
          Destination: pair[0].destination,
          Distance: pair[0].distance
        });

      }

    });

    // CSV HEADER
    const headers = ['Source', 'Destination', 'Distance'];

    // CSV ROWS
    const rows = csvData.map(item =>
      [item.Source, item.Destination, item.Distance].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');

    // DOWNLOAD FILE
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);

    // DYNAMIC FILE NAME
    let fileName = 'distance-data.csv';

    if (this.locationsData?.length > 0 && this.locationsData[0][0]) {

      const source = this.locationsData[0][0].source
        ?.replace(/\s+/g, '_')
        ?.toLowerCase();

      const destination = this.locationsData[0][0].destination
        ?.replace(/\s+/g, '_')
        ?.toLowerCase();

      fileName = `${source}_${destination}.csv`;
    }

    link.setAttribute('download', fileName);

    link.style.visibility = 'hidden';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }


  uploadCSV(event: any) {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {

      const csvText = e.target.result;

      const lines = csvText.split('\n');

      // REMOVE HEADER
      lines.shift();

      lines.forEach((line: any) => {

        const row = line.split(',');

        if (row.length >= 3) {

          const source = row[0]?.trim();
          const destination = row[1]?.trim();
          const distance = row[2]?.trim();

          this.locationsData.forEach((pair: any) => {

            // FIRST ROUTE MATCH
            if (
              pair[0] &&
              pair[0].source?.trim() === source &&
              pair[0].destination?.trim() === destination
            ) {

              pair[0].distance = distance;

              // AUTO UPDATE REVERSE
              if (pair[1]) {
                pair[1].distance = distance;
              }

            }

            // SECOND ROUTE MATCH
            if (
              pair[1] &&
              pair[1].source?.trim() === source &&
              pair[1].destination?.trim() === destination
            ) {

              pair[1].distance = distance;

              // AUTO UPDATE REVERSE
              if (pair[0]) {
                pair[0].distance = distance;
              }

            }

          });

        }

      });

    };

    reader.readAsText(file);

  }
}
