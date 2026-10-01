import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Constants } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class NotificationLogsService {
  private readonly BASE_URL = Constants.BASE_URL + '/notification-log';

  constructor(private http: HttpClient) {}

  /**
   * ============================================================
   * DASHBOARD
   * POST /notification-log/dashboard
   * ============================================================
   */
  getNotificationDashboard(data: any = {}, page: number = 1) {
    const body = {
      campaign_id: data.campaign_id || '',
      notification_type: data.notification_type || '',
      date_from: data.date_from || '',
      date_to: data.date_to || '',
      rows_number: data.rows_number || Constants.RecordLimit || 10,
      page: page,
    };

    return this.http.post(this.BASE_URL + '/dashboard', body);
  }

  getCampaignDetails(campaignId: number, data: any = {}, page: number = 1) {
    const body = {
      campaign_id: campaignId,

      search: data.search || '',

      status: data.status || '',

      notification_type: data.notification_type || '',

      date_from: data.date_from || '',

      date_to: data.date_to || '',

      rows_number: data.rows_number || Constants.RecordLimit || 25,

      page: page,
    };

    console.log(
      'CAMPAIGN DETAIL API:',
      this.BASE_URL + '/campaign/' + campaignId,
    );

    console.log('CAMPAIGN DETAIL BODY:', body);

    return this.http.post(this.BASE_URL + '/campaign/' + campaignId, body);
  }

  getNotificationCampaigns() {
    return this.http.post(this.BASE_URL + '/campaigns', {});
  }

  /**
   * ============================================================
   * EXPORT
   * POST /notification-log/campaign/{campaignId}/export
   * ============================================================
   */
  exportCampaignDetails(campaignId: number, data: any = {}) {
    const body = {
      search: data.search || '',
      status: data.status || '',
      notification_type: data.notification_type || '',
      date_from: data.date_from || '',
      date_to: data.date_to || '',
    };

    return this.http.post(
      this.BASE_URL + '/campaign/' + campaignId + '/export',
      body,
      {
        responseType: 'blob',
      },
    );
  }
}
