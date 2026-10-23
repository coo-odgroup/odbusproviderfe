import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../constant/constant';

export interface AccessUser {
  id: number;
  name: string;
  client_id: string;
  email?: string;
}

export interface AccessPermission {
  id: number;
  name: string;
  key: string;
  description?: string;
}

export interface AccessRoute {
  id: number;
  source_id: number;
  source_name: string;
  destination_id: number;
  destination_name: string;
  name: string;
}

export interface AccessOperator {
  id: number;
  organisation_name: string;
}

export interface AccessAssignableUser {
  id: number;
  name: string;
  client_id: string;
}

export interface AccessBus {
  id: number;
  name: string;
  bus_number: string;
}

export interface AccessApiResponse<T> {
  status: boolean | number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ManageuseraccessService {
  private readonly baseUrl = Constants.BASE_URL;

  constructor(private http: HttpClient) {}

  // Fetch active bus operators.
  getOperators(): Observable<AccessApiResponse<AccessOperator[]>> {
    return this.http.post<AccessApiResponse<AccessOperator[]>>(
      `${this.baseUrl}/bus-user-access/operators`,
      {},
    );
  }

  // Fetch users filtered by operator and role_id.
  // 3 = Agent, 7 = Conductor, 8 = Manager.
  getAssignableUsers(
    operatorId: number,
    userType: number,
  ): Observable<AccessApiResponse<AccessAssignableUser[]>> {
    return this.http.post<AccessApiResponse<AccessAssignableUser[]>>(
      `${this.baseUrl}/bus-user-access/users`,
      {
        operator_id: operatorId,
        user_type: userType,
      },
    );
  }

  // Fetch buses belonging to the selected operator.
  getOperatorBuses(
    operatorId: number,
  ): Observable<AccessApiResponse<AccessBus[]>> {
    return this.http.post<AccessApiResponse<AccessBus[]>>(
      `${this.baseUrl}/bus-user-access/buses`,
      {
        operator_id: operatorId,
      },
    );
  }

  // Existing user-list endpoint.
  getUsers(): Observable<AccessApiResponse<AccessUser[]>> {
    return this.http.post<AccessApiResponse<AccessUser[]>>(
      `${this.baseUrl}/users/list`,
      {},
    );
  }

  // Existing permission-list endpoint.
  getPermissions(): Observable<AccessApiResponse<AccessPermission[]>> {
    return this.http.get<AccessApiResponse<AccessPermission[]>>(
      `${this.baseUrl}/permissions`,
    );
  }

  // Existing endpoint for permissions assigned to a user.
  getUserPermissions(userId: number): Observable<AccessApiResponse<number[]>> {
    return this.http.get<AccessApiResponse<number[]>>(
      `${this.baseUrl}/user-permissions`,
      {
        params: { user_id: String(userId) },
      },
    );
  }

  // Existing endpoint for saving user permissions.
  saveUserPermissions(payload: {
    user_id: number;
    permission_ids: number[];
  }): Observable<AccessApiResponse<any>> {
    return this.http.post<AccessApiResponse<any>>(
      `${this.baseUrl}/user-permissions`,
      payload,
    );
  }

  getBusRoutes(busId: number): Observable<AccessApiResponse<AccessRoute[]>> {
    return this.http.post<AccessApiResponse<AccessRoute[]>>(
      `${this.baseUrl}/bus-user-access/routes`,
      {
        bus_id: busId,
      },
    );
  }

  saveUserBusAccess(payload: {
    operator_id: number;
    user_type: number;
    user_id: number;
    bus_id: number;
    from_date: string;
    to_date: string;
    route_ids: number[];
    route_statuses: { [routeId: number]: 'Active' | 'Inactive' };
  }): Observable<AccessApiResponse<any>> {
    return this.http.post<AccessApiResponse<any>>(
      `${this.baseUrl}/bus-user-access/save`,
      payload,
    );
  }

  getUserBusAccessList(payload?: {
    search?: string;
    status?: string;
    user_id?: number;
  }): Observable<AccessApiResponse<any[]>> {
    return this.http.post<AccessApiResponse<any[]>>(
      `${this.baseUrl}/bus-user-access/list`,
      payload || {},
    );
  }

  updateUserBusAssignmentStatus(
    id: number,
    status: 0 | 1,
  ): Observable<AccessApiResponse<any>> {
    return this.http.post<AccessApiResponse<any>>(
      `${this.baseUrl}/bus-user-access/status`,
      { id, status },
    );
  }
}
