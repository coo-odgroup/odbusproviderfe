import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants} from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class ApiuserreportService {
  
  private apiURL = Constants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  completeReport(data): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/ApiUsercompletereport',JSON.stringify(data), this.httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  completepaginationReport(url,data): Observable<any> {
    return this.httpClient.post<any>(url,JSON.stringify(data), this.httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  cancelticketReport(data): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/ApiUsercancelticketreport',JSON.stringify(data), this.httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  cancelticketpaginationReport(url,data): Observable<any> {
    return this.httpClient.post<any>(url,JSON.stringify(data), this.httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  errorHandler(error) {
      let errorMessage = '';
      if(error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      return throwError(errorMessage);
 }
}
