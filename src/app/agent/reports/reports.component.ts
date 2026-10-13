import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../constant/constant';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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

  selectedItem: any = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
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
      perPage: this.perPage,
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

  fileName = `report_${Date.now()}_${Math.floor(Math.random() * 10000)}.csv`;

  exportexcel(): void {
    let element = document.getElementById('print-section'); // table id
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  viewDetails(viewModal: any, id: any): void {
    this.spinner.show();
    const data = { id: id };
    this.http.post<any>(this.apiURL + '/viewuser', data).subscribe(
      (response) => {
        if (response.status === '1') {
          this.selectedItem = response.data;
          this.spinner.hide();
        }
      },
      (error) => {
        console.error('View User API error:', error);
        this.spinner.hide();
      },
    );

    // this.modalService.open(viewModal, {
    //   centered: true,
    //   size: 'lg',
    //   backdrop: 'static',
    //   keyboard: true,
    // });

    this.modalService.open(viewModal, {
      size: 'lg',
      centered: true,
      scrollable: false,
      backdrop: 'static',
    });
  }
}
