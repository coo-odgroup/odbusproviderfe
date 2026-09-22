import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  constructor(private http: HttpClient) {}

  getVendors(filters: any = {}) {
    return this.http.post(Constants.BASE_URL + '/vendors/list', filters);
  }

  getVendor(id: number) {
    return this.http.post(Constants.BASE_URL + '/vendors/view', {
      id: id,
    });
  }

  addVendor(data: any) {
    return this.http.post(Constants.BASE_URL + '/vendors/add', data);
  }

  updateVendor(id: number, data: any) {
    return this.http.post(Constants.BASE_URL + '/vendors/update', {
      id: id,
      ...data,
    });
  }

  changeVendorStatus(id: number) {
    return this.http.post(Constants.BASE_URL + '/vendors/status', {
      id: id,
    });
  }

  getStates() {
    return this.http.post(Constants.BASE_URL + '/vendors/states', {});
  }

  generateVendorCredential(vendorId: number, environment: string) {
    return this.http.post(
      Constants.BASE_URL + '/vendors/credentials/generate',
      {
        vendor_id: vendorId,
        environment: environment,
      },
    );
  }

  saveVendorCredentials(vendorId: number, credentials: any[]) {
    return this.http.post(Constants.BASE_URL + '/vendors/credentials/save', {
      vendor_id: vendorId,
      credentials: credentials,
    });
  }

  getVendorCredentials(vendorId: number) {
    return this.http.post(Constants.BASE_URL + '/vendors/credentials/list', {
      vendor_id: vendorId,
    });
  }

  changeVendorEnvironmentStatus(
    vendorId: number,
    environment: string,
    status: number,
  ) {
    return this.http.post(Constants.BASE_URL + '/vendors/environment/status', {
      vendor_id: vendorId,
      environment: environment,
      status: status,
    });
  }
}
