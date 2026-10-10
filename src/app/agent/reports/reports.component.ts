import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../constant/constant';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  private apiURL = Constants.BASE_URL;

  slug = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.slug = params['slug'];
    });

    this.getAgentReports();
  }

  newtoday: any = [];
  newthismonth: any = [];

  getAgentReports(): void {
    const data = {};

    this.http.post<any>(this.apiURL + '/agentreports', data).subscribe(
      (response) => {
        if (response.status === '1') {
          this.newtoday = response.data.newtoday;
          this.newthismonth = response.data.newthismonth;
        }

        console.log('Agent reports API response:', response);
      },
      (error) => {
        console.error('Agent reports API error:', error);
      },
    );
  }

  onReportChange(event: any): void {
    const value = event.target.value;

    if (value) {
      this.router.navigate(['/agent/reports', value]);
    }
  }
}
