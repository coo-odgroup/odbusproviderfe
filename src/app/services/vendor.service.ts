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
    const payload = {
      vendor_id: vendorId,
      production: (productionIps || [])
        .filter((ip) => ip.ip_address?.trim())
        .map((ip) => ({
          id: ip.id || null,
          ip_address: ip.ip_address.trim(),
          is_active: ip.is_active ? 1 : 0,
        })),
      sandbox: (sandboxIps || [])
        .filter((ip) => ip.ip_address?.trim())
        .map((ip) => ({
          id: ip.id || null,
          ip_address: ip.ip_address.trim(),
          is_active: ip.is_active ? 1 : 0,
        })),
      created_by: createdBy,
      updated_by: updatedBy,
    };

    return this.http.post(Constants.BASE_URL + '/vendors/ips/save', payload);
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

  getVendorAppAccessRules(vendorId: number) {
    return this.http.post(
      Constants.BASE_URL + '/vendors/app-access-rules/list',
      {
        vendor_id: vendorId,
      },
    );
  }

  updateVendorPassword(vendorId: number, password: string) {
    return this.http.post(
      Constants.BASE_URL + '/vendors/' + vendorId + '/password',
      {
        password: password,
      },
    );
  }

  saveVendorAppAccessRules(
    vendorId: number,
    sandbox: any[],
    production: any[],
    createdBy: number | null,
    updatedBy: number | null,
  ) {
    return this.http.post(
      Constants.BASE_URL + '/vendors/app-access-rules/save',
      {
        vendor_id: vendorId,
        sandbox: sandbox,
        production: production,
        created_by: createdBy,
        updated_by: updatedBy,
      },
    );
  }

  changeVendorAppAccessRuleStatus(
    id: number,
    vendorId: number,
    status: number,
    updatedBy: number | null,
  ) {
    return this.http.post(
      Constants.BASE_URL + '/vendors/app-access-rules/status',
      {
        id: id,
        vendor_id: vendorId,
        status: status,
        updated_by: updatedBy,
      },
    );
  }

  addSandboxBalance(payload: {
    vendor_id: number;
    amount: number;
    remarks: string;
    created_by: number;
  }) {
    return this.http.post(
      Constants.BASE_URL + '/vendors/sandbox-balance',
      payload,
    );
  }

  getBusOperators(): any {
    return this.http.post<{
      status: number;
      message: string;
      data: {
        id: number;
        organisation_name: string;
      }[];
    }>(Constants.BASE_URL + '/bus-operators', {});
  }

  getBusOperatorDetails(operatorId: number) {
    return this.http.post<{
      status: number;
      message: string;
      data: {
        operator_id: number;
        company_name: string;
        contact_name: string;
        contact_email: string;
        contact_phone: string;
        rate_limit_per_minute: number;
        has_gst: number;
        address: string;
      };
    }>(`${Constants.BASE_URL}/bus-operators/${operatorId}/details`, {});
  }
}
