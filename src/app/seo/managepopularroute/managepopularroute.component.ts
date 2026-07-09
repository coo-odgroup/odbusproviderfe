import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { Constants } from '../../constant/constant';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-managepopularroute',
  templateUrl: './managepopularroute.component.html',
  styleUrls: ['./managepopularroute.component.scss']
})
export class ManagePopularRouteComponent implements OnInit {

  public searchFrom!: FormGroup;
  public updateFrom!: FormGroup;


  apiUrl = Constants.BASE_URL;
  role = sessionStorage.getItem('ROLE_ID');

  cityContent: any;
  routesData: any;
  Data: any;
  selectedRouteId: any;
  showModal = false;
  templateData: any;

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
      route_type: [''],
      order_by: [''],
    })

    this.updateFrom = this.fb.group({
      seo_content: [null],
      meta_title: [null],
      meta_description: [null],
    })

    this.search();
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

    console.log(formData)

    this.http.post(this.apiUrl + '/all-Route', formData).subscribe((res: any) => {
      this.Data = res;

      // this.updateFrom.patchValue({
      //   seo_content: res.seo_content || '',
      //   meta_title: res.meta_title || '',
      //   meta_description: res.meta_description || '',
      // });

      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      console.error(err);
    });
  }



  selectedData(id: any) {
    const formData = {
      route_id: id
    };
    console.log(formData)
    this.http.post(this.apiUrl + '/templateDetails', formData).subscribe((res: any) => {
      console.log(res);
      this.templateData = res;
    })
  }


  saveAll() {

    const USERID = localStorage.getItem('USERID');
    const routeId = this.searchFrom.value.route_id;
    // const payload: any[] = [];

    const payload = {
      'route_id': routeId,
      'seo_content': this.updateFrom.value.seo_content,
      'meta_title': this.updateFrom.value.meta_title,
      'meta_description': this.updateFrom.value.meta_description,
      'updated_by': USERID
    }


    // console.log(payload);


    this.http.post(this.apiUrl + '/add-seo-content', payload).subscribe((res: any) => {
      console.log(res);
      this.notificationService.addToast({ title: 'Success', msg: res.message, type: 'success' });
    })

  }


  changedRows: any[] = [];

  markAsChanged(data: any) {
    const index = this.changedRows.findIndex(item => item.id === data.id);

    if (index === -1) {
      this.changedRows.push({ ...data });
    } else {
      this.changedRows[index] = { ...data };
    }

  }

  updateRouteDetails() {
    this.spinner.show();

    if (this.changedRows.length === 0) {
      console.log('No changes found.');
      return;
    }

    const payload = this.changedRows.map((item: any) => ({
      id: item.id,
      is_popular_routes: item.is_popular_routes ? 1 : 0,
      is_top_routes: item.is_top_routes ? 1 : 0,
      sequence: item.sequence
    }));

    this.http.post(this.apiUrl + '/popularRouteUpdate', {
      routes: payload
    }).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.refresh();
          this.notificationService.addToast({title: 'Success', msg: res.message, type: 'success' });
          this.spinner.hide();
          this.changedRows = [];
        }

        // Clear changed rows after successful update
        this.changedRows = [];
      },
      error: (err) => {
        this.spinner.hide();
        console.log(err);
      }
    });
  }

  refresh() {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      route_id: [null],
      route_type: [''],
      order_by: [''],
    })
    this.search();
  }
}
