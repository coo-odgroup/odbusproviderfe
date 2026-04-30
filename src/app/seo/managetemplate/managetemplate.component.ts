import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { Constants } from '../../constant/constant';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-managetemplate',
  templateUrl: './managetemplate.component.html',
  styleUrls: ['./managetemplate.component.scss']
})
export class ManageTemplateComponent implements OnInit {

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
      seo_content: [null],
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

    this.http.post(this.apiUrl + '/seo-content', formData).subscribe((res: any) => {
      console.log(res);
      this.Data = res;

      this.updateFrom.patchValue({
        seo_content: res.seo_content || ''
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
    // const payload: any[] = [];

    const payload ={
      'route_id': routeId,
      'seo_content': this.updateFrom.value.seo_content,
      'updated_by': USERID
    }


    this.http.post(this.apiUrl + '/add-seo-content', payload).subscribe((res: any) => {
      console.log(res);
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
