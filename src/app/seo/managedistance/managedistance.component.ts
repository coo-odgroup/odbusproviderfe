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
    private notificationService:NotificationService
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
}
