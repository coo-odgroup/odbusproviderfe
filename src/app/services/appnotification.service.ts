import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Constants } from '../constant/constant';
import { catchError } from 'rxjs/operators';

export interface ApiResponse {
  status: number;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AppNotificationService {
 private apiURL = Constants.BASE_URL;


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  updateStatus(id: number, status: number): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(
        `${this.apiURL}/status/${id}`,
        { status },
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  getAllData(data: any): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(`${this.apiURL}/list`, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  getAllPaginationData(pageUrl: string, data: any): Observable<ApiResponse> {
    let APIurl = pageUrl ? pageUrl : `${this.apiURL}/list`;

    return this.http
      .post<ApiResponse>(APIurl, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  getNotificationTypes(): Observable<any> {
  return this.http.get<any>(`${this.apiURL}/notification-types`);
}

getTemplateKeys(typeId: number): Observable<any> {
  return this.http.get<any>(`${this.apiURL}/template-keys/${typeId}`);
}


  create(data: any): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(`${this.apiURL}/create`, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  update(id: number, data: any): Observable<ApiResponse> {
    return this.http
      .put<ApiResponse>(`${this.apiURL}/update/${id}`, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http
      .delete<ApiResponse>(`${this.apiURL}/delete/${id}`, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: any) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage =
        error.error?.message ||
        `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => errorMessage);
  }
}
