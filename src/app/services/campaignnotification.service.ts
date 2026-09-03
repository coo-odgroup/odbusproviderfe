import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class CampaignnotificationService {
  constructor(private http: HttpClient) {}

  create(data: any) {
    return this.http.post<any>(
      Constants.BASE_URL + '/createCampaignNotification',
      data,
    );
  }

  getAllData(data: any) {
    return this.http.post<any>(
      Constants.BASE_URL + '/getAllCampaignNotificationData',
      data,
    );
  }

  getAllPaginationData(url: string, data: any) {
    return this.http.post<any>(url, data);
  }

  update(id: number, data: any) {
    return this.http.post<any>(
      Constants.BASE_URL + '/updateCampaignNotification/' + id,
      data,
    );
  }

  changeStatus(data: any) {
    return this.http.post<any>(
      Constants.BASE_URL + '/changeCampaignNotificationStatus',
      data,
    );
  }

  getNotificationCategories() {
    return this.http.post<any>(
      Constants.BASE_URL + '/notification-categories',
      {},
    );
  }

  getCampaignNotification(id: any) {
    return this.http.post<any>(
      Constants.BASE_URL + '/getCampaignNotification/' + id,
      {},
    );
  }

  getOperators() {
    return this.http.post<any>(Constants.BASE_URL + '/get-operators', {});
  }

  getLocations() {
    return this.http.post<any>(Constants.BASE_URL + '/get-locations', {});
  }

  getActiveCoupons() {
    return this.http.post<any>(Constants.BASE_URL + '/getActiveCoupons', {});
  }

  getUsers() {
    return this.http.get<any>(
      Constants.BASE_URL + '/getCampaignNotificationUsers',
    );
  }

  getSelectedTargetUsers(duration: number) {
    return this.http.post<any>(Constants.BASE_URL + '/getSelectedTargetUsers', {
      duration: duration,
    });
  }
}
