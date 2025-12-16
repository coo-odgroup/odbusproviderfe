
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants } from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class ScheduleRefundService {
  private apiURL = Constants.BASE_URL;

  constructor(private http: HttpClient) { }

  getRefundList(body: any): Observable<any> {
    return this.http.post<any>(this.apiURL + '/scheduleRefund', body);
  }

  getRefundSelected(body: any): Observable<any> {
    return this.http.post<any>(this.apiURL + '/scheduleRefundSelected', body);
  }
}
