import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../services/notification.service';
import { NotificationLogsService } from '../../services/notification-logs.service';
import { Constants } from '../../constant/constant';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-notification-log-report',
  templateUrl: './notification-log-report.component.html',
  styleUrls: ['./notification-log-report.component.scss'],
})
export class NotificationLogReportComponent implements OnInit {
  public searchForm: FormGroup;
  public notificationLogs: any[] = [];
  public campaigns: any[] = [];
  public pagination: any;
  public all: any;
  public selectedLog: any = null;

  public totalCount = 0;
  public successCount = 0;
  public failedCount = 0;
  public pendingCount = 0;

  fileName = 'Notification-Log-Report.xlsx';

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private notificationService: NotificationService,
    private notificationLogsService: NotificationLogsService,
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      campaign_id: [''],
      notification_type: [''],
      status: [''],
      date_from: [''],
      date_to: [''],
      rows_number: [Constants.RecordLimit],
    });

    this.loadCampaigns();

    this.search();
  }

  /**
   * Search Notification Logs
   */
  search(page: number = 1): void {
    this.spinner.show();

    const data = {
      campaign_id: this.searchForm.value.campaign_id,
      notification_type: this.searchForm.value.notification_type,
      status: this.searchForm.value.status,
      date_from: this.searchForm.value.date_from,
      date_to: this.searchForm.value.date_to,
      rows_number: this.searchForm.value.rows_number,
    };

    console.log('Notification Log Search:', data);

    this.notificationLogsService.getNotificationLogs(data, page).subscribe(
      (response: any) => {
        console.log('Notification Log Response:', response);

        if (response.status === true) {
          this.notificationLogs = response.data || [];

          this.pagination = response.pagination || null;

          this.calculateSummary();
        } else {
          this.notificationLogs = [];

          this.calculateSummary();

          (error) => {
            console.error('Notification Log API Error:', error);
            console.error('Status:', error.status);
            console.error('Error body:', error.error);

            this.notificationLogs = [];
            this.calculateSummary();

            this.notificationService.notify(
              error.error?.message || 'Unable to load notification logs.',
              'Error',
            );

            this.spinner.hide();
          };
        }

        this.spinner.hide();
      },
      (error) => {
        console.error('Notification Log API Error:', error);

        this.notificationLogs = [];

        this.calculateSummary();

        this.notificationService.notify(
          'Unable to load notification logs.',
          'Error',
        );

        this.spinner.hide();
      },
    );
  }

  /**
   * Reset filters
   */
  refresh(): void {
    this.searchForm.reset({
      campaign_id: '',
      status: '',
      date_from: '',
      date_to: '',
      rows_number: Constants.RecordLimit,
    });

    this.search();
  }

  /**
   * Calculate summary cards
   */
  calculateSummary(): void {
    this.totalCount = this.notificationLogs.length;

    this.successCount = this.notificationLogs.filter(
      (item) => item.status === 'SUCCESS',
    ).length;

    this.failedCount = this.notificationLogs.filter(
      (item) => item.status === 'FAILED',
    ).length;

    this.pendingCount = this.notificationLogs.filter(
      (item) => item.status === 'PENDING',
    ).length;
  }

  /**
   * View notification log details
   */
  viewLog(log: any): void {
    this.selectedLog = log;

    console.log('Selected Notification Log:', log);
  }

  /**
   * Close details
   */
  closeDetails(): void {
    this.selectedLog = null;
  }

  /**
   * Export Excel
   */
  exportexcel(): void {
    const element = document.getElementById('notification-log-table');

    if (!element) {
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Notification Logs');

    XLSX.writeFile(wb, this.fileName);
  }

  /**
   * Status badge class
   */
  getStatusClass(log: any): string {
    const status = (log.status || '').toUpperCase();

    /*
     * Invalid FCM token
     */
    if (
      status === 'FAILED' &&
      ((log.error_code || '').toUpperCase().includes('TOKEN') ||
        (log.error_code || '').toUpperCase().includes('UNREGISTERED') ||
        (log.error_message || '').toUpperCase().includes('TOKEN') ||
        (log.error_message || '').toUpperCase().includes('UNREGISTERED'))
    ) {
      return 'status-invalid-token';
    }

    switch (status) {
      case 'SUCCESS':
        return 'status-success';

      case 'FAILED':
        return 'status-failed';

      case 'PENDING':
        return 'status-pending';

      default:
        return 'status-default';
    }
  }

  getStatusText(log: any): string {
    const status = (log.status || '').toUpperCase();

    if (
      status === 'FAILED' &&
      ((log.error_code || '').toUpperCase().includes('TOKEN') ||
        (log.error_code || '').toUpperCase().includes('UNREGISTERED') ||
        (log.error_message || '').toUpperCase().includes('TOKEN') ||
        (log.error_message || '').toUpperCase().includes('UNREGISTERED'))
    ) {
      return 'INVALID TOKEN';
    }

    return status || '--';
  }

  getPageNumbers(): number[] {
    if (!this.pagination) {
      return [];
    }

    const currentPage = this.pagination.current_page;
    const lastPage = this.pagination.last_page;

    const pages: number[] = [];

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(lastPage, currentPage + 2);

    // Always show up to 5 pages
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(lastPage, 5);
      }

      if (endPage === lastPage) {
        startPage = Math.max(1, lastPage - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  loadCampaigns(): void {
    this.notificationLogsService.getNotificationCampaigns().subscribe(
      (response: any) => {
        console.log('Notification Campaigns:', response);

        if (response.status === true) {
          this.campaigns = response.data || [];
        } else {
          this.campaigns = [];

          this.notificationService.notify(
            response.message || 'Unable to load campaigns.',
            'Error',
          );
        }
      },

      (error) => {
        console.error('Notification Campaign API Error:', error);

        this.campaigns = [];

        this.notificationService.notify(
          'Unable to load notification campaigns.',
          'Error',
        );
      },
    );
  }
}
