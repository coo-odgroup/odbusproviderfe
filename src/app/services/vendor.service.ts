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

  getVendorIps(vendorId: number) {
    return this.http.post(Constants.BASE_URL + '/vendors/ips/list', {
      vendor_id: vendorId,
    });
  }

  saveVendorIps(
    vendorId: number,
    productionIps: any[],
    sandboxIps: any[],
    createdBy: number | null,
    updatedBy: number | null,
  ) {
    return this.http.post(Constants.BASE_URL + '/vendors/ips/save', {
      vendor_id: vendorId,
      production_ips: productionIps,
      sandbox_ips: sandboxIps,
      created_by: createdBy,
      updated_by: updatedBy,
    });
  }

  changeVendorIpStatus(id: number, isActive: number, updatedBy: number | null) {
    return this.http.post(Constants.BASE_URL + '/vendors/ips/status', {
      id: id,
      is_active: isActive,
      updated_by: updatedBy,
    });
  }

  getVendorScopes(vendorId: number) {
    return this.http.post(Constants.BASE_URL + '/vendors/scope/list', {
      vendor_id: vendorId,
    });
  }

  saveVendorScopes(
    vendorId: number,
    sandboxScopes: any[],
    productionScopes: any[],
    createdBy: number | null,
    updatedBy: number | null,
  ) {
    return this.http.post(Constants.BASE_URL + '/vendors/scope/save', {
      vendor_id: vendorId,
      sandbox_scopes: sandboxScopes,
      production_scopes: productionScopes,
      created_by: createdBy,
      updated_by: updatedBy,
    });
  }

  changeVendorScopeStatus(
    vendorId: number,
    environment: string,
    scopeId: number,
    status: number,
    updatedBy: number | null,
  ) {
    return this.http.post(Constants.BASE_URL + '/vendors/scope/status', {
      vendor_id: vendorId,
      environment: environment,
      scope_id: scopeId,
      status: status,
      updated_by: updatedBy,
    });
  }
  getVendorRateLimits(vendorId: number) {
    return this.http.post(Constants.BASE_URL + '/vendors/rate-limits/list', {
      vendor_id: vendorId,
    });
  }

  saveVendorRateLimits(
    vendorId: number,
    sandbox: any[],
    production: any[],
    createdBy: number | null,
    updatedBy: number | null,
  ) {
    return this.http.post(Constants.BASE_URL + '/vendors/rate-limits/save', {
      vendor_id: vendorId,
      sandbox: sandbox,
      production: production,
      created_by: createdBy,
      updated_by: updatedBy,
    });
  }
  getVendorViewDetails(vendorId: number) {
    return this.http.post(Constants.BASE_URL + '/vendors/view-details', {
      vendor_id: vendorId,
    });
  }
}
