import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class NotificationLogsService {
  constructor(private http: HttpClient) {}

  /**
   * Get Notification Log Report
   */
  getNotificationLogs(data: any, page: number = 1) {
    return this.http.post(
      Constants.BASE_URL + '/notification/log-report?page=' + page,
      data,
    );
  }
  getNotificationCampaigns() {
    return this.http.get(Constants.BASE_URL + '/notification/campaign-list');
  }
}
