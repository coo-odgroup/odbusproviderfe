import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleRefundService {

  private apiUrl = 'http://localhost:7001/ODBUS/odbusproviderbe/api/scheduleRefund';

  constructor(private http: HttpClient) {}

  getRefundList(body: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, body);
  }
}
