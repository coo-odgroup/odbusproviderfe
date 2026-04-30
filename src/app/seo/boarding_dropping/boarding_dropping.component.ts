import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { Constants } from '../../constant/constant';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-boarding_dropping',
  templateUrl: './boarding_dropping.component.html',
  styleUrls: ['./boarding_dropping.component.scss']
})
export class BoardingDroppingComponent implements OnInit {

  public searchFrom!: FormGroup;
  public updateFrom!: FormGroup;


  apiUrl = Constants.BASE_URL;
  role = sessionStorage.getItem('ROLE_ID');

  cityContent: any;
  routesData: any;
  Data: any;
  selectedRouteId: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private fb: FormBuilder,
    public formatter: NgbDateParserFormatter,
    private notificationService: NotificationService,
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
      breadcrumb_schema: [null],
      faq_schema: [null],
    })

    // this.search();
    this.getRoute();

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

    this.http.post(this.apiUrl + '/route-wise-brd_drp', formData).subscribe((res: any) => {
      // console.log(res.data);
      this.Data = res;
      this.updateFrom.patchValue({
        breadcrumb_schema: JSON.stringify(res.breadcrumb_schema, null, 2),
        faq_schema: JSON.stringify(res.faq_schema, null, 2),
      });

      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      console.error(err);
    });
  }


  saveAll() {

    const USERID = localStorage.getItem('USERID');
    const routeId = this.searchFrom.value.route_id;
    const now = new Date().toISOString();
    const payload: any[] = [];

    this.Data.boarding.points
      .filter((b: any) => b.checked)
      .forEach((b: any) => {
        payload.push({
          route_id: routeId,
          type: 1,
          brd_drp_id: b.id,
          active_status: 1,
          created_by: USERID,
          updated_by: USERID,
          created_at: now,
          updated_at: now
        });
      });

    this.Data.dropping.points
      .filter((d: any) => d.checked)
      .forEach((d: any) => {
        payload.push({
          route_id: routeId,
          type: 2,
          brd_drp_id: d.id,
          active_status: 1,
          created_by: USERID,
          updated_by: USERID,
          created_at: now,
          updated_at: now
        });
      });

    this.http.post(this.apiUrl + '/add-brd_drp', { payload: payload, schema: this.updateFrom.value }).subscribe((res: any) => {
      this.notificationService.addToast({ title: 'Success', msg: res.message, type: 'success' });
    })

  }


  refresh() {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      route_id: [null],
    })
    this.spinner.hide();
  }
}
