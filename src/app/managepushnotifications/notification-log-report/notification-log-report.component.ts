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
  /* ============================================================
   * FILTER FORM
   * ============================================================ */

  public searchForm!: FormGroup;

  /* ============================================================
   * CAMPAIGN LIST
   * ============================================================ */

  public campaignsList: any[] = [];

  public campaigns: any[] = [];

  public selectedCampaign: any = null;

  /* ============================================================
   * GLOBAL SUMMARY
   *
   * These values MUST come from backend aggregation.
   * Do not calculate them from the current page.
   * ============================================================ */

  public globalSummary = {
    total: 0,
    successful: 0,
    failed: 0,
    invalid_token: 0,
    pending: 0,
    queued: 0,
    processing: 0,

    success_rate: 0,

    average_response_time: 0,
    minimum_response_time: 0,
    maximum_response_time: 0,
  };

  /* ============================================================
   * OLD/COMPATIBILITY SUMMARY VARIABLES
   *
   * Kept because the existing HTML may still use them.
   * ============================================================ */

  public totalCount = 0;
  public successCount = 0;
  public failedCount = 0;
  public invalidTokenCount = 0;
  public pendingCount = 0;
  public queuedCount = 0;
  public processingCount = 0;

  public successPercentage = 0;
  public failedPercentage = 0;
  public invalidTokenPercentage = 0;
  public pendingPercentage = 0;
  public queuedPercentage = 0;

  /* ============================================================
   * CAMPAIGN DETAIL SUMMARY
   * ============================================================ */

  public campaignSummary = {
    total: 0,
    successful: 0,
    failed: 0,
    invalid_token: 0,
    pending: 0,
    queued: 0,
    processing: 0,
  };

  /* ============================================================
   * SELECTED CAMPAIGN SUMMARY
   *
   * Kept for compatibility with existing HTML.
   * ============================================================ */

  public selectedCampaignTotal = 0;
  public selectedCampaignSuccess = 0;
  public selectedCampaignFailed = 0;
  public selectedCampaignInvalidToken = 0;
  public selectedCampaignPending = 0;
  public selectedCampaignQueued = 0;
  public selectedCampaignProcessing = 0;

  public selectedCampaignSuccessPercentage = 0;
  public selectedCampaignFailedPercentage = 0;
  public selectedCampaignInvalidTokenPercentage = 0;

  /* ============================================================
   * CAMPAIGN DETAIL METRICS
   * ============================================================ */

  public averageResponseTime = 0;
  public fastestResponseTime = 0;
  public slowestResponseTime = 0;

  public totalUsers = 0;
  public uniqueUsers = 0;

  /* ============================================================
   * CAMPAIGN DETAILS
   * ============================================================ */

  public notificationLogs: any[] = [];

  public campaignDetails: any[] = [];

  public campaignPagination: any = null;

  public pagination: any = null;

  /* ============================================================
   * MODAL
   * ============================================================ */

  public showCampaignModal = false;

  public loadingCampaignDetails = false;

  public loadingDashboard = false;

  /* ============================================================
   * DETAIL FILTER
   * ============================================================ */

  public detailSearch = '';

  public detailStatus = '';

  /* ============================================================
   * UI
   * ============================================================ */

  public activeTab = 'overview';

  /* ============================================================
   * EXPORT
   * ============================================================ */

  public fileName = 'Notification-Campaign-Report.xlsx';

  /* ============================================================
   * CONSTRUCTOR
   * ============================================================ */

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private notificationService: NotificationService,
    private notificationLogsService: NotificationLogsService,
  ) {}

  /* ============================================================
   * INIT
   * ============================================================ */

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      campaign_id: [''],
      notification_type: [''],
      status: [''],
      date_from: [''],
      date_to: [''],
      rows_number: [Constants.RecordLimit || 10],
    });

    this.loadCampaigns();

    this.loadDashboard(1);
  }

  /* ============================================================
   * LOAD CAMPAIGN DROPDOWN
   * ============================================================ */

  loadCampaigns(): void {
    this.notificationLogsService.getNotificationCampaigns().subscribe(
      (response: any) => {
        console.log('Campaign List Response:', response);

        if (response && response.status === true) {
          this.campaignsList = response.data || [];
        } else {
          this.campaignsList = [];
        }
      },
      (error) => {
        console.error('Campaign List Error:', error);

        this.campaignsList = [];
      },
    );
  }

  /* ============================================================
   * MAIN DASHBOARD
   * ============================================================ */

  loadDashboard(page: number = 1): void {
    this.loadingDashboard = true;

    this.spinner.show();

    const value = this.searchForm.value;

    const data = {
      campaign_id: value.campaign_id || '',
      notification_type: value.notification_type || '',
      status: value.status || '',
      date_from: value.date_from || '',
      date_to: value.date_to || '',
      rows_number: value.rows_number || Constants.RecordLimit || 10,
    };

    console.log('Dashboard Request:', data);
    console.log('Dashboard Page:', page);

    this.notificationLogsService.getNotificationDashboard(data, page).subscribe(
      (response: any) => {
        console.log('Notification Dashboard Response:', response);

        if (response && response.status === true) {
          /*
           * IMPORTANT
           *
           * New backend structure:
           *
           * response.summary
           * response.data
           * response.pagination
           */

          this.setGlobalSummary(response.summary || {});

          this.campaigns = response.data || [];

          this.pagination = response.pagination || null;
        } else {
          this.resetDashboard();

          this.notificationService.notify(
            response?.message || 'Unable to load notification dashboard.',
            'Error',
          );
        }

        this.loadingDashboard = false;

        this.spinner.hide();
      },
      (error) => {
        console.error('Notification Dashboard API Error:', error);

        this.resetDashboard();

        this.loadingDashboard = false;

        this.notificationService.notify(
          error?.error?.message || 'Unable to load notification dashboard.',
          'Error',
        );

        this.spinner.hide();
      },
    );
  }

  /* ============================================================
   * GET FILTERS
   * ============================================================ */

  getFilters(): any {
    const value = this.searchForm.value;

    return {
      campaign_id: value.campaign_id || '',
      notification_type: value.notification_type || '',
      status: value.status || '',
      date_from: value.date_from || '',
      date_to: value.date_to || '',
      rows_number: value.rows_number || Constants.RecordLimit || 10,
    };
  }

  /* ============================================================
   * SET GLOBAL SUMMARY
   * ============================================================ */

  setGlobalSummary(summary: any): void {
    this.globalSummary = {
      total: Number(summary.total || 0),

      successful: Number(summary.successful ?? summary.success ?? 0),

      failed: Number(summary.failed || 0),

      invalid_token: Number(summary.invalid_token || summary.invalidToken || 0),

      pending: Number(summary.pending || 0),

      queued: Number(summary.queued || 0),

      processing: Number(summary.processing || 0),

      success_rate: Number(summary.success_rate || 0),

      average_response_time: Number(
        summary.average_response_time ||
          summary.average_response_time_ms ||
          summary.avg_response_time ||
          0,
      ),

      minimum_response_time: Number(
        summary.minimum_response_time ||
          summary.minimum_response_time_ms ||
          summary.fastest_response_time_ms ||
          0,
      ),

      maximum_response_time: Number(
        summary.maximum_response_time ||
          summary.maximum_response_time_ms ||
          summary.slowest_response_time_ms ||
          0,
      ),
    };

    /*
     * Compatibility variables for existing HTML.
     */

    this.totalCount = this.globalSummary.total;

    this.successCount = this.globalSummary.successful;

    this.failedCount = this.globalSummary.failed;

    this.invalidTokenCount = this.globalSummary.invalid_token;

    this.pendingCount = this.globalSummary.pending;

    this.queuedCount = this.globalSummary.queued;

    this.processingCount = this.globalSummary.processing;

    this.successPercentage = this.calculatePercentage(
      this.successCount,
      this.totalCount,
    );

    this.failedPercentage = this.calculatePercentage(
      this.failedCount,
      this.totalCount,
    );

    this.invalidTokenPercentage = this.calculatePercentage(
      this.invalidTokenCount,
      this.totalCount,
    );

    this.pendingPercentage = this.calculatePercentage(
      this.pendingCount,
      this.totalCount,
    );

    this.queuedPercentage = this.calculatePercentage(
      this.queuedCount,
      this.totalCount,
    );
  }

  /* ============================================================
   * RESET DASHBOARD
   * ============================================================ */

  resetDashboard(): void {
    this.globalSummary = {
      total: 0,
      successful: 0,
      failed: 0,
      invalid_token: 0,
      pending: 0,
      queued: 0,
      processing: 0,

      success_rate: 0,

      average_response_time: 0,
      minimum_response_time: 0,
      maximum_response_time: 0,
    };

    this.totalCount = 0;
    this.successCount = 0;
    this.failedCount = 0;
    this.invalidTokenCount = 0;
    this.pendingCount = 0;
    this.queuedCount = 0;
    this.processingCount = 0;

    this.successPercentage = 0;
    this.failedPercentage = 0;
    this.invalidTokenPercentage = 0;
    this.pendingPercentage = 0;
    this.queuedPercentage = 0;

    this.campaigns = [];

    this.pagination = null;
  }

  viewCampaign(campaign: any): void {
    console.log('========================================');

    console.log('VIEW CAMPAIGN CLICKED');

    console.log('CAMPAIGN:', campaign);

    console.log('========================================');

    if (!campaign) {
      console.error('Campaign is empty');
      return;
    }

    /*
     * Get campaign ID
     */
    const campaignId = Number(
      campaign.campaign_id ??
        campaign.id ??
        campaign.notification_campaign_id ??
        0,
    );

    console.log('CAMPAIGN ID:', campaignId);

    if (!campaignId) {
      this.notificationService.notify('Campaign ID not found.', 'Error');

      return;
    }

    /*
     * IMPORTANT:
     * Keep the campaign that user clicked.
     *
     * This means the modal header can show
     * campaign information immediately.
     */
    this.selectedCampaign = {
      ...campaign,
      campaign_id: campaignId,
    };

    /*
     * Open modal
     */
    this.showCampaignModal = true;

    /*
     * Reset previous campaign data
     */
    this.loadingCampaignDetails = true;

    this.notificationLogs = [];

    this.campaignDetails = [];

    this.campaignPagination = null;

    this.detailSearch = '';

    this.detailStatus = '';

    /*
     * Reset summary/metrics
     */
    this.resetCampaignDetails();

    /*
     * Load campaign details
     */
    this.loadCampaignDetails(campaignId, 1);
  }

  loadCampaignDetails(campaignId: number, page: number = 1): void {
    console.log('========================================');

    console.log('LOADING CAMPAIGN DETAILS');

    console.log('CAMPAIGN ID:', campaignId);

    console.log('PAGE:', page);

    console.log('========================================');

    if (!campaignId) {
      console.error('Invalid campaign ID:', campaignId);

      this.loadingCampaignDetails = false;

      return;
    }

    /*
     * Keep loader ON while API request is running.
     */
    this.loadingCampaignDetails = true;

    /*
     * Request body
     */
    const data = {
      search: this.detailSearch || '',

      status: this.detailStatus || '',

      notification_type: this.searchForm?.value?.notification_type || '',

      date_from: this.searchForm?.value?.date_from || '',

      date_to: this.searchForm?.value?.date_to || '',

      rows_number:
        this.searchForm?.value?.rows_number || Constants.RecordLimit || 25,
    };

    console.log('DETAIL REQUEST DATA:', data);

    /*
     * API
     */
    this.notificationLogsService
      .getCampaignDetails(campaignId, data, page)
      .subscribe({
        next: (response: any) => {
          console.log('========================================');

          console.log('CAMPAIGN DETAIL RESPONSE');

          console.log(response);

          console.log('========================================');

          /*
           * IMPORTANT:
           * Stop loader regardless of response format.
           */
          this.loadingCampaignDetails = false;

          /*
           * ------------------------------------------
           * DETERMINE ACTUAL RESPONSE DATA
           * ------------------------------------------
           */

          let result: any = response;

          /*
           * Some APIs return:
           *
           * {
           *   status: 1,
           *   data: {...}
           * }
           *
           * Others:
           *
           * {
           *   success: true,
           *   data: {...}
           * }
           *
           * Others:
           *
           * {
           *   data: [...]
           * }
           */

          const responseData =
            response?.data ??
            response?.result ??
            response?.response ??
            response;

          /*
           * ------------------------------------------
           * CAMPAIGN INFORMATION
           * ------------------------------------------
           */

          const campaignInfo =
            response?.campaign ||
            response?.campaign_details ||
            response?.campaignDetail ||
            responseData?.campaign ||
            responseData?.campaign_details ||
            null;

          if (campaignInfo) {
            this.selectedCampaign = {
              ...this.selectedCampaign,

              ...campaignInfo,

              campaign_id: Number(
                campaignInfo.campaign_id ?? campaignInfo.id ?? campaignId,
              ),
            };
          }

          /*
           * Always preserve clicked campaign ID.
           */

          this.selectedCampaign = {
            ...this.selectedCampaign,

            campaign_id: Number(
              this.selectedCampaign?.campaign_id || campaignId,
            ),
          };

          /*
           * ------------------------------------------
           * FIND NOTIFICATION LOGS
           * ------------------------------------------
           */

          let logs: any[] = [];

          /*
           * response.data is array
           */
          if (Array.isArray(response?.data)) {
            logs = response.data;
          } else if (Array.isArray(response?.data?.data)) {
            /*
             * response.data.data
             */
            logs = response.data.data;
          } else if (Array.isArray(response?.logs)) {
            /*
             * response.logs
             */
            logs = response.logs;
          } else if (Array.isArray(response?.notification_logs)) {
            /*
             * response.notification_logs
             */
            logs = response.notification_logs;
          } else if (Array.isArray(responseData?.logs)) {
            /*
             * responseData.logs
             */
            logs = responseData.logs;
          } else if (Array.isArray(responseData?.notification_logs)) {
            /*
             * responseData.notification_logs
             */
            logs = responseData.notification_logs;
          } else if (Array.isArray(responseData?.data)) {
            /*
             * responseData.data
             */
            logs = responseData.data;
          }

          /*
           * SAVE LOGS
           */

          this.notificationLogs = logs;

          this.campaignDetails = logs;

          console.log('NOTIFICATION LOGS:', this.notificationLogs);

          /*
           * ------------------------------------------
           * PAGINATION
           * ------------------------------------------
           */

          const pagination =
            response?.pagination ||
            response?.meta ||
            responseData?.pagination ||
            responseData?.meta ||
            response?.data?.pagination ||
            null;

          this.campaignPagination = pagination;

          console.log('CAMPAIGN PAGINATION:', this.campaignPagination);

          /*
           * ------------------------------------------
           * CAMPAIGN SUMMARY
           * ------------------------------------------
           */

          const summary =
            response?.summary ||
            response?.campaign_summary ||
            response?.statistics ||
            responseData?.summary ||
            responseData?.campaign_summary ||
            responseData?.statistics ||
            null;

          if (summary) {
            console.log('CAMPAIGN SUMMARY:', summary);

            this.setCampaignDetailSummary(summary);
          } else {
            /*
             * If backend doesn't return summary,
             * calculate it from the logs.
             */
            this.calculateCampaignDetailSummary();
          }

          /*
           * ------------------------------------------
           * RESPONSE METRICS
           * ------------------------------------------
           */

          const metrics =
            response?.metrics ||
            response?.response_metrics ||
            responseData?.metrics ||
            responseData?.response_metrics ||
            summary ||
            null;

          if (metrics) {
            this.averageResponseTime = Number(
              metrics.average_response_time ??
                metrics.avg_response_time ??
                metrics.average_response_time_ms ??
                0,
            );

            this.fastestResponseTime = Number(
              metrics.fastest_response_time ??
                metrics.fastest_response_time_ms ??
                metrics.minimum_response_time ??
                metrics.minimum_response_time_ms ??
                0,
            );

            this.slowestResponseTime = Number(
              metrics.slowest_response_time ??
                metrics.slowest_response_time_ms ??
                metrics.maximum_response_time ??
                metrics.maximum_response_time_ms ??
                0,
            );

            this.totalUsers = Number(metrics.total_users ?? metrics.users ?? 0);

            this.uniqueUsers = Number(
              metrics.unique_users ?? metrics.uniqueUsers ?? 0,
            );
          }

          /*
           * ------------------------------------------
           * CALCULATE PERCENTAGES
           * ------------------------------------------
           */

          this.calculateCampaignPercentages();

          /*
           * ------------------------------------------
           * FINAL DEBUG
           * ------------------------------------------
           */

          console.log('========================================');

          console.log('FINAL MODAL DATA');

          console.log('========================================');

          console.log('Campaign:', this.selectedCampaign);

          console.log('Summary:', this.campaignSummary);

          console.log('Logs:', this.notificationLogs);

          console.log('Pagination:', this.campaignPagination);

          console.log('Average Response:', this.averageResponseTime);

          console.log('Fastest:', this.fastestResponseTime);

          console.log('Slowest:', this.slowestResponseTime);

          console.log('Total Users:', this.totalUsers);
        },

        error: (error: any) => {
          /*
           * ALWAYS stop loading
           */
          this.loadingCampaignDetails = false;

          console.error('========================================');

          console.error('CAMPAIGN DETAIL API ERROR');

          console.error(error);

          console.error('========================================');

          this.notificationLogs = [];

          this.campaignDetails = [];

          this.campaignPagination = null;

          this.resetCampaignDetails();

          this.notificationService.notify(
            error?.error?.message ||
              error?.message ||
              'Unable to load campaign details.',

            'Error',
          );
        },
      });
  }

  setCampaignDetailSummary(summary: any): void {
    if (!summary) {
      this.resetCampaignDetails();

      return;
    }

    this.campaignSummary = {
      total: Number(summary.total ?? summary.total_count ?? 0),

      successful: Number(
        summary.successful ?? summary.success ?? summary.success_count ?? 0,
      ),

      failed: Number(
        summary.failed ?? summary.failure ?? summary.failed_count ?? 0,
      ),

      invalid_token: Number(
        summary.invalid_token ??
          summary.invalidToken ??
          summary.invalid_token_count ??
          0,
      ),

      queued: Number(summary.queued ?? summary.queued_count ?? 0),

      pending: Number(summary.pending ?? summary.pending_count ?? 0),

      processing: Number(summary.processing ?? summary.processing_count ?? 0),
    };

    /*
     * Response time
     */
    this.averageResponseTime = Number(
      summary.average_response_time ??
        summary.avg_response_time ??
        summary.average_response_time_ms ??
        this.averageResponseTime ??
        0,
    );

    this.fastestResponseTime = Number(
      summary.fastest_response_time ??
        summary.fastest_response_time_ms ??
        summary.minimum_response_time ??
        summary.minimum_response_time_ms ??
        this.fastestResponseTime ??
        0,
    );

    this.slowestResponseTime = Number(
      summary.slowest_response_time ??
        summary.slowest_response_time_ms ??
        summary.maximum_response_time ??
        summary.maximum_response_time_ms ??
        this.slowestResponseTime ??
        0,
    );

    /*
     * Users
     */
    this.totalUsers = Number(
      summary.total_users ?? summary.users ?? this.totalUsers ?? 0,
    );

    this.uniqueUsers = Number(
      summary.unique_users ?? summary.uniqueUsers ?? this.uniqueUsers ?? 0,
    );

    /*
     * Percentages
     */
    this.calculateCampaignPercentages();
  }

  calculateCampaignDetailSummary(): void {
    const logs = this.notificationLogs || [];

    this.selectedCampaignTotal = logs.length;

    this.selectedCampaignSuccess = logs.filter(
      (item: any) => this.getRawStatus(item) === 'SUCCESS',
    ).length;

    this.selectedCampaignFailed = logs.filter(
      (item: any) => this.getRawStatus(item) === 'FAILED',
    ).length;

    this.selectedCampaignInvalidToken = logs.filter((item: any) =>
      this.isInvalidToken(item),
    ).length;

    this.selectedCampaignPending = logs.filter(
      (item: any) => this.getRawStatus(item) === 'PENDING',
    ).length;

    this.selectedCampaignQueued = logs.filter(
      (item: any) => this.getRawStatus(item) === 'QUEUED',
    ).length;

    this.selectedCampaignProcessing = logs.filter(
      (item: any) => this.getRawStatus(item) === 'PROCESSING',
    ).length;

    this.averageResponseTime = 0;

    this.fastestResponseTime = 0;

    this.slowestResponseTime = 0;

    const responseTimes = logs
      .map((item: any) => Number(item.response_time_ms || 0))
      .filter((value: number) => value > 0);

    if (responseTimes.length > 0) {
      const total = responseTimes.reduce(
        (sum: number, value: number) => sum + value,
        0,
      );

      this.averageResponseTime = Math.round(total / responseTimes.length);

      this.fastestResponseTime = Math.min(...responseTimes);

      this.slowestResponseTime = Math.max(...responseTimes);
    }

    this.totalUsers = logs.length;

    this.uniqueUsers = new Set(
      logs
        .map((item: any) => item.user_id)
        .filter((id: any) => id !== null && id !== undefined),
    ).size;

    this.campaignSummary = {
      total: this.selectedCampaignTotal,

      successful: this.selectedCampaignSuccess,

      failed: this.selectedCampaignFailed,

      invalid_token: this.selectedCampaignInvalidToken,

      pending: this.selectedCampaignPending,

      queued: this.selectedCampaignQueued,

      processing: this.selectedCampaignProcessing,
    };

    this.calculateCampaignPercentages();
  }

  /* ============================================================
   * CAMPAIGN PERCENTAGES
   * ============================================================ */

  calculateCampaignPercentages(): void {
    const total = this.selectedCampaignTotal || 0;

    if (!total) {
      this.selectedCampaignSuccessPercentage = 0;

      this.selectedCampaignFailedPercentage = 0;

      this.selectedCampaignInvalidTokenPercentage = 0;

      return;
    }

    this.selectedCampaignSuccessPercentage = this.calculatePercentage(
      this.selectedCampaignSuccess,
      total,
    );

    this.selectedCampaignFailedPercentage = this.calculatePercentage(
      this.selectedCampaignFailed,
      total,
    );

    this.selectedCampaignInvalidTokenPercentage = this.calculatePercentage(
      this.selectedCampaignInvalidToken,
      total,
    );
  }

  /* ============================================================
   * CLOSE CAMPAIGN
   * ============================================================ */

  closeCampaign(): void {
    this.showCampaignModal = false;

    this.loadingCampaignDetails = false;

    this.selectedCampaign = null;

    this.notificationLogs = [];

    this.campaignDetails = [];

    this.pagination = null;

    this.campaignPagination = null;

    this.detailSearch = '';

    this.detailStatus = '';

    this.resetCampaignDetails();
  }

  resetCampaignDetails(): void {
    this.campaignSummary = {
      total: 0,

      successful: 0,

      failed: 0,

      invalid_token: 0,

      queued: 0,

      pending: 0,

      processing: 0,
    };

    this.averageResponseTime = 0;

    this.fastestResponseTime = 0;

    this.slowestResponseTime = 0;

    this.totalUsers = 0;

    this.uniqueUsers = 0;

    this.selectedCampaignSuccessPercentage = 0;

    this.selectedCampaignFailedPercentage = 0;

    this.selectedCampaignInvalidTokenPercentage = 0;
  }

  /* ============================================================
   * DETAIL SEARCH
   * ============================================================ */

  searchCampaignDetails(): void {
    if (!this.selectedCampaign) {
      return;
    }

    this.loadCampaignDetails(Number(this.selectedCampaign.campaign_id), 1);
  }

  /* ============================================================
   * DETAIL STATUS FILTER
   * ============================================================ */

  filterCampaignStatus(status: string): void {
    this.detailStatus = status || '';

    this.searchCampaignDetails();
  }

  /* ============================================================
   * DETAIL PAGE
   * ============================================================ */

  changeCampaignPage(page: number): void {
    if (!this.selectedCampaign) {
      return;
    }

    const pagination = this.campaignPagination || this.pagination;

    if (pagination && (page < 1 || page > Number(pagination.last_page || 1))) {
      return;
    }

    this.loadCampaignDetails(Number(this.selectedCampaign.campaign_id), page);
  }

  /* ============================================================
   * MAIN SEARCH
   * ============================================================ */

  search(): void {
    this.loadDashboard(1);
  }

  /* ============================================================
   * RESET FILTERS
   * ============================================================ */

  refresh(): void {
    this.searchForm.reset({
      campaign_id: '',

      notification_type: '',

      status: '',

      date_from: '',

      date_to: '',

      rows_number: Constants.RecordLimit || 10,
    });

    this.detailSearch = '';

    this.detailStatus = '';

    this.loadDashboard(1);
  }

  /* ============================================================
   * MAIN DASHBOARD PAGINATION
   * ============================================================ */

  changePage(page: number): void {
    if (!this.pagination) {
      return;
    }

    const currentPage = Number(this.pagination.current_page || 1);

    const lastPage = Number(this.pagination.last_page || 1);

    if (page < 1 || page > lastPage || page === currentPage) {
      return;
    }

    this.loadDashboard(page);
  }

  /* ============================================================
   * RAW STATUS
   * ============================================================ */

  getRawStatus(log: any): string {
    if (!log || !log.status) {
      return '';
    }

    return String(log.status).toUpperCase();
  }

  /* ============================================================
   * INVALID TOKEN
   * ============================================================ */

  isInvalidToken(log: any): boolean {
    const status = this.getRawStatus(log);

    if (status === 'INVALID_TOKEN') {
      return true;
    }

    const errorCode = String(log?.error_code || '').toUpperCase();

    const errorMessage = String(log?.error_message || '').toUpperCase();

    return (
      status === 'FAILED' &&
      (errorCode.includes('TOKEN') ||
        errorCode.includes('UNREGISTERED') ||
        errorMessage.includes('TOKEN') ||
        errorMessage.includes('UNREGISTERED'))
    );
  }

  /* ============================================================
   * STATUS TEXT
   * ============================================================ */

  getStatusText(log: any): string {
    if (this.isInvalidToken(log)) {
      return 'INVALID TOKEN';
    }

    const status = this.getRawStatus(log);

    if (!status) {
      return '--';
    }

    return status;
  }

  /* ============================================================
   * STATUS CSS
   * ============================================================ */

  getStatusClass(log: any): string {
    if (this.isInvalidToken(log)) {
      return 'status-invalid-token';
    }

    const status = this.getRawStatus(log);

    switch (status) {
      case 'SUCCESS':
        return 'status-success';

      case 'FAILED':
        return 'status-failed';

      case 'PENDING':
        return 'status-pending';

      case 'QUEUED':
        return 'status-queued';

      case 'PROCESSING':
        return 'status-processing';

      case 'INVALID_TOKEN':
        return 'status-invalid-token';

      default:
        return 'status-default';
    }
  }

  /* ============================================================
   * CAMPAIGN STATUS
   * ============================================================ */

  getCampaignStatus(campaign: any): string {
    if (!campaign) {
      return '--';
    }

    const total = Number(campaign.total || 0);

    const successful = Number(campaign.successful ?? campaign.success ?? 0);

    const failed = Number(campaign.failed || 0);

    const invalidToken = Number(
      campaign.invalid_token || campaign.invalidToken || 0,
    );

    const queued = Number(campaign.queued || 0);

    const pending = Number(campaign.pending || 0);

    const processing = Number(campaign.processing || 0);

    if (queued > 0 && successful === 0 && failed === 0 && invalidToken === 0) {
      return 'QUEUED';
    }

    if (pending > 0 && successful === 0 && failed === 0 && invalidToken === 0) {
      return 'PENDING';
    }

    if (processing > 0 && successful === 0 && failed === 0) {
      return 'PROCESSING';
    }

    if (successful === total && total > 0) {
      return 'COMPLETED';
    }

    if (failed > 0 || invalidToken > 0) {
      if (successful > 0) {
        return 'PARTIAL';
      }

      if (failed + invalidToken >= total && total > 0) {
        return 'FAILED';
      }
    }

    return 'PROCESSING';
  }

  /* ============================================================
   * CAMPAIGN STATUS CSS
   * ============================================================ */

  getCampaignStatusClass(campaign: any): string {
    const status = this.getCampaignStatus(campaign);

    switch (status) {
      case 'COMPLETED':
        return 'campaign-completed';

      case 'PARTIAL':
        return 'campaign-partial';

      case 'FAILED':
        return 'campaign-failed';

      case 'QUEUED':
        return 'campaign-queued';

      case 'PENDING':
        return 'campaign-pending';

      case 'PROCESSING':
        return 'campaign-processing';

      default:
        return 'campaign-default';
    }
  }

  /* ============================================================
   * PERCENTAGE
   * ============================================================ */

  calculatePercentage(value: number, total: number): number {
    if (!total || total <= 0) {
      return 0;
    }

    return Math.round((Number(value || 0) / total) * 10000) / 100;
  }

  /* ============================================================
   * RESPONSE TIME
   * ============================================================ */

  formatResponseTime(milliseconds: number): string {
    const ms = Number(milliseconds || 0);

    if (!ms) {
      return '--';
    }

    if (ms < 1000) {
      return ms + ' ms';
    }

    if (ms < 60000) {
      return (ms / 1000).toFixed(2) + ' sec';
    }

    return (ms / 60000).toFixed(2) + ' min';
  }

  /* ============================================================
   * DATE
   * ============================================================ */

  formatDate(value: any): string {
    if (!value) {
      return '--';
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  }

  /* ============================================================
   * FCM TOKEN MASK
   * ============================================================ */

  maskToken(token: string): string {
    if (!token) {
      return '--';
    }

    const value = String(token);

    if (value.length <= 15) {
      return value;
    }

    return value.substring(0, 8) + '...' + value.substring(value.length - 8);
  }

  /* ============================================================
   * MOBILE MASK
   * ============================================================ */

  maskMobile(mobile: string): string {
    if (!mobile) {
      return '--';
    }

    const value = String(mobile);

    if (value.length < 5) {
      return value;
    }

    return value.substring(0, 2) + '******' + value.substring(value.length - 2);
  }

  /* ============================================================
   * CAMPAIGN PAGE NUMBERS
   * ============================================================ */

  getCampaignPageNumbers(): number[] {
    const pagination = this.campaignPagination || this.pagination;

    if (!pagination) {
      return [];
    }

    const currentPage = Number(pagination.current_page || 1);

    const lastPage = Number(pagination.last_page || 1);

    const pages: number[] = [];

    let startPage = Math.max(1, currentPage - 2);

    let endPage = Math.min(lastPage, currentPage + 2);

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

  /* ============================================================
   * EXPORT CAMPAIGN SUMMARY
   * ============================================================ */

  exportCampaigns(): void {
    if (!this.campaigns || !this.campaigns.length) {
      this.notificationService.notify(
        'No campaign data available for export.',
        'Warning',
      );

      return;
    }

    const exportData = this.campaigns.map((campaign: any) => ({
      'Campaign ID': campaign.campaign_id,

      Campaign: this.getCampaignName(campaign),

      'Notification Type': campaign.notification_type || '--',

      Total: Number(campaign.total || 0),

      Successful: Number(campaign.successful ?? campaign.success ?? 0),

      Failed: Number(campaign.failed || 0),

      'Invalid Token': Number(
        campaign.invalid_token || campaign.invalidToken || 0,
      ),

      Pending: Number(campaign.pending || 0),

      Queued: Number(campaign.queued || 0),

      Processing: Number(campaign.processing || 0),

      'Success %':
        this.calculatePercentage(
          Number(campaign.successful ?? campaign.success ?? 0),
          Number(campaign.total || 0),
        ) + '%',

      'Failed %':
        this.calculatePercentage(
          Number(campaign.failed || 0),
          Number(campaign.total || 0),
        ) + '%',

      Status: this.getCampaignStatus(campaign),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Campaign Summary');

    XLSX.writeFile(wb, this.fileName);
  }

  /* ============================================================
   * EXPORT CAMPAIGN DETAILS
   *
   * Local XLSX export from currently loaded details.
   * ============================================================ */

  exportCampaignDetailsLocal(): void {
    if (!this.notificationLogs || !this.notificationLogs.length) {
      this.notificationService.notify(
        'No notification details available for export.',
        'Warning',
      );

      return;
    }

    const exportData = this.notificationLogs.map((log: any) => ({
      'Log ID': log.id || '',

      'Campaign ID': log.campaign_id || '',

      'Queue ID': log.queue_id || '',

      'User ID': log.user_id || '',

      'User Name': log.user_name || log.name || '',

      Mobile: log.mobile_no || log.mobile || '',

      Email: log.email || '',

      Status: this.getStatusText(log),

      'Error Code': log.error_code || '',

      'Error Message': log.error_message || '',

      'FCM Message ID': log.fcm_message_id || '',

      'Response Time': this.formatResponseTime(log.response_time_ms),

      'Sent At': this.formatDate(log.sent_at),

      'Processed At': this.formatDate(log.processed_at),

      'Created At': this.formatDate(log.created_at),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Notification Details');

    XLSX.writeFile(
      wb,
      'Campaign-' +
        (this.selectedCampaign && this.selectedCampaign.campaign_id
          ? this.selectedCampaign.campaign_id
          : 'Details') +
        '.xlsx',
    );
  }

  /* ============================================================
   * SERVER EXPORT
   *
   * Use this if your backend export endpoint is available.
   * ============================================================ */

  exportCampaignDetails(): void {
    if (!this.selectedCampaign) {
      this.notificationService.notify(
        'Please select a campaign first.',
        'Warning',
      );

      return;
    }

    const campaignId = Number(this.selectedCampaign.campaign_id);

    const value = this.searchForm.value;

    const data = {
      search: this.detailSearch || '',

      status: this.detailStatus || '',

      notification_type: value.notification_type || '',

      date_from: value.date_from || '',

      date_to: value.date_to || '',
    };

    this.notificationLogsService
      .exportCampaignDetails(campaignId, data)
      .subscribe(
        (blob: Blob) => {
          if (!blob) {
            return;
          }

          const url = window.URL.createObjectURL(blob);

          const link = document.createElement('a');

          link.href = url;

          link.download = 'Campaign-' + campaignId + '.xlsx';

          link.click();

          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Campaign Export Error:', error);

          this.notificationService.notify(
            error?.error?.message || 'Unable to export campaign details.',
            'Error',
          );
        },
      );
  }

  /* ============================================================
   * VIEW LOG
   * ============================================================ */

  viewLog(log: any): void {
    console.log('Notification Log:', log);
  }

  /* ============================================================
   * TAB
   * ============================================================ */

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  /* ============================================================
   * TRACK CAMPAIGN
   * ============================================================ */

  trackByCampaign(index: number, campaign: any): any {
    return campaign && campaign.campaign_id ? campaign.campaign_id : index;
  }

  /* ============================================================
   * TRACK LOG
   * ============================================================ */

  trackByLog(index: number, log: any): any {
    return log && log.id ? log.id : index;
  }

  /* ============================================================
   * CAMPAIGN NAME
   * ============================================================ */

  getCampaignName(campaign: any): string {
    if (!campaign) {
      return 'Campaign Details';
    }

    return (
      campaign.campaign_name ||
      campaign.name ||
      campaign.title ||
      campaign.notification_title ||
      campaign.message ||
      `Campaign #${campaign.campaign_id || campaign.id || '--'}`
    );
  }

  /* ============================================================
   * CAMPAIGN TOTAL
   * ============================================================ */

  getCampaignTotal(campaign: any): number {
    return Number(campaign && campaign.total ? campaign.total : 0);
  }

  /* ============================================================
   * CAMPAIGN SUCCESS
   * ============================================================ */

  getCampaignSuccess(campaign: any): number {
    if (!campaign) {
      return 0;
    }

    return Number(campaign.successful ?? campaign.success ?? 0);
  }

  /* ============================================================
   * CAMPAIGN FAILED
   * ============================================================ */

  getCampaignFailed(campaign: any): number {
    return Number(campaign && campaign.failed ? campaign.failed : 0);
  }

  /* ============================================================
   * CAMPAIGN INVALID TOKEN
   * ============================================================ */

  getCampaignInvalidToken(campaign: any): number {
    if (!campaign) {
      return 0;
    }

    return Number(campaign.invalid_token ?? campaign.invalidToken ?? 0);
  }

  /* ============================================================
   * CAMPAIGN PENDING
   * ============================================================ */

  getCampaignPending(campaign: any): number {
    return Number(campaign && campaign.pending ? campaign.pending : 0);
  }

  /* ============================================================
   * CAMPAIGN QUEUED
   * ============================================================ */

  getCampaignQueued(campaign: any): number {
    return Number(campaign && campaign.queued ? campaign.queued : 0);
  }

  /* ============================================================
   * CAMPAIGN PROCESSING
   * ============================================================ */

  getCampaignProcessing(campaign: any): number {
    return Number(campaign && campaign.processing ? campaign.processing : 0);
  }

  /* ============================================================
   * SUCCESS RATE
   * ============================================================ */

  getCampaignSuccessPercentage(campaign: any): number {
    return this.calculatePercentage(
      this.getCampaignSuccess(campaign),
      this.getCampaignTotal(campaign),
    );
  }

  /* ============================================================
   * FAILED RATE
   * ============================================================ */

  getCampaignFailedPercentage(campaign: any): number {
    return this.calculatePercentage(
      this.getCampaignFailed(campaign),
      this.getCampaignTotal(campaign),
    );
  }

  /* ============================================================
   * INVALID TOKEN RATE
   * ============================================================ */

  getCampaignInvalidTokenPercentage(campaign: any): number {
    return this.calculatePercentage(
      this.getCampaignInvalidToken(campaign),
      this.getCampaignTotal(campaign),
    );
  }

  exportexcel(): void {
    this.exportCampaigns();
  }

  getCampaignFailurePercentage(campaign: any): number {
    const total = Number(campaign.total || 0);
    const failed = Number(campaign.failed || 0);

    if (!total) {
      return 0;
    }

    return Number(((failed / total) * 100).toFixed(1));
  }

  getPageNumbers(): number[] {
    if (!this.pagination || !this.pagination.last_page) {
      return [];
    }

    const totalPages = Number(this.pagination.last_page);
    const currentPage = Number(this.pagination.current_page || 1);

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }

  getCampaignDetailPageNumbers(): number[] {
    if (!this.campaignPagination || !this.campaignPagination.last_page) {
      return [];
    }

    const totalPages = Number(this.campaignPagination.last_page);

    const currentPage = Number(this.campaignPagination.current_page || 1);

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }
}
