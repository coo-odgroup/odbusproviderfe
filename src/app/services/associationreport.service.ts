import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants} from '../constant/constant';


@Injectable({
  providedIn: 'root'
})
export class AssociationreportService {

  private apiURL = Constants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  completeReport(data): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/assocBookingReport',JSON.stringify(data), this.httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }


  completepaginationReport(url,data): Observable<any> {
    return this.httpClient.post<any>(url,JSON.stringify(data), this.httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }


  cancelReport(data): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/assocCancelReport',JSON.stringify(data), this.httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }


  cancelpaginationReport(url,data): Observable<any> {
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
