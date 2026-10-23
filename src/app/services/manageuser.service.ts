import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constant/constant';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface OperatorOption {
  id: number;
  organisation_name: string;
}

export interface RoleOption {
  id: number;
  name: string;
}

export interface StateOption {
  id: number;
  state_name: string;
}

export interface StatesApiResponse {
  status: string | number;
  message: string;
  data: {
    count: number;
    total: number;
    test?: string;
    data: {
      current_page: number;
      data: StateOption[];
      last_page: number;
      total: number;
    };
  };
}

export interface ManageUserApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ManageuserService {
  constructor(private http: HttpClient) {}

  getBusOperators(): Observable<ManageUserApiResponse<OperatorOption[]>> {
    return this.http.post<ManageUserApiResponse<OperatorOption[]>>(
      Constants.BASE_URL + '/bus-operators',
      {},
    );
  }

  getRoles(): Observable<ManageUserApiResponse<RoleOption[]>> {
    return this.http.post<ManageUserApiResponse<RoleOption[]>>(
      Constants.BASE_URL + '/roles',
      {},
    );
  }

  getStates(): Observable<StateOption[]> {
    return this.http
      .post<StatesApiResponse>(Constants.BASE_URL + '/states', {})
      .pipe(
        switchMap((response) => {
          if (Number(response.status) !== 1) {
            return of([]);
          }

          const pagination = response.data?.data;
          const firstPageStates = pagination?.data || [];
          const lastPage = Number(pagination?.last_page || 1);

          if (lastPage <= 1) {
            return of(firstPageStates);
          }

          const requests: Observable<StatesApiResponse>[] = [];

          for (let page = 2; page <= lastPage; page++) {
            requests.push(
              this.http.post<StatesApiResponse>(
                `${Constants.BASE_URL}/states?page=${page}`,
                {},
              ),
            );
          }

          return forkJoin(requests).pipe(
            map((responses) => {
              const remainingStates = responses.reduce(
                (allStates: StateOption[], item) => {
                  const pageStates = item.data?.data?.data || [];
                  return allStates.concat(pageStates);
                },
                [],
              );
              return [...firstPageStates, ...remainingStates];
            }),
          );
        }),
      );
  }

  getUsers(): Observable<any> {
    return this.http.post<any>(Constants.BASE_URL + '/users/list', {});
  }

  createUser(payload: {
    bus_operator_id: number | null;
    name: string;
    email: string;
    client_id: string | null;
    phone: string;
    role_id: number;
    user_type: string;
  }) {
    return this.http.post<{
      status: number;
      message: string;
      data?: any;
    }>(Constants.BASE_URL + '/users', payload);
  }

  toggleUserStatus(payload: { id: number; status: number }): Observable<{
    status: number;
    message: string;
    data?: {
      id: number;
      status: number;
    };
  }> {
    return this.http.post<{
      status: number;
      message: string;
      data?: {
        id: number;
        status: number;
      };
    }>(Constants.BASE_URL + '/users/toggle-status', payload);
  }

  saveUserAddress(payload: {
  id: number;
  address: string;
  street: string;
  city: string;
  pincode: string;
  state_id: number | null;
}): Observable<{ status: number; message: string }> {
  return this.http.post<{ status: number; message: string }>(
    Constants.BASE_URL + '/users/address',
    payload
  );
}
}
