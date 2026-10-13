import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../constant/constant';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  private apiURL = Constants.BASE_URL;

  fromDate: string = '';
  toDate: string = '';
  searchText: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.route.params.subscribe((params) => {
      this.slug = params['slug'] || 'newtoday';
      this.getAgentReports(1);
    });
  }

  records: any[] = [];
  pagination: any = null;
  all: any = { count: 0, total: 0 };

  slug: string = 'newtoday';
  currentPage: number = 1;
  perPage: number = 10;

  getAgentReports(page: number = 1): void {
    this.spinner.show();
    // const data = {
    //   slug: this.slug,
    //   page: page,
    //   per_page: this.perPage,
    // };

    const data = {
      slug: this.slug,
      fromDate: this.fromDate,
      toDate: this.toDate,
      searchText: this.searchText.trim(),
      page: page,
      perPage: this.perPage
    };

    this.http.post<any>(this.apiURL + '/agentreports', data).subscribe(
      (response) => {
        if (response.status === '1') {
          const result = response.data;

          this.records = result.pagination.data;
          this.pagination = result.pagination;
          this.all = {
            count: result.count,
            total: result.total,
          };

          this.currentPage = result.pagination.current_page;

          this.spinner.hide();
        }

        // console.log('Agent reports API response:', response);
      },
      (error) => {
        console.error('Agent reports API error:', error);
        this.spinner.hide();
      },
    );
  }

  search(url: string, statusLabel?: any): void {
    if (!url) {
      return;
    }

    const parsedUrl = new URL(url, window.location.origin);
    const page = Number(parsedUrl.searchParams.get('page')) || 1;

    this.getAgentReports(page);
  }

  onReportChange(event: any): void {
    const value = event.target.value;

    if (value) {
      this.router.navigate(['/agent/reports', value]);
    }
  }

  resetFilters(): void {
    this.fromDate = '';
    this.toDate = '';
    this.searchText = '';
    this.perPage = 10;

    this.getAgentReports(1);
  }
}
