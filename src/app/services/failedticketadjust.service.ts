import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants} from '../constant/constant';


@Injectable({
  providedIn: 'root'
})
export class FailedticketadjustService {
  private apiURL = Constants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  failedticketadjust(data): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/failedticketadjust',JSON.stringify(data), this.httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }


  failedticketadjustReport(data): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/failedticketadjustdata',JSON.stringify(data), this.httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  failedticketadjustpaginationReport(url,data): Observable<any> {
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
