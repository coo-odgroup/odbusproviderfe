import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants} from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiURL = Constants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  seatopenReport(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/seatopenreport').pipe(
      catchError(this.errorHandler)
    )
  }


  seatblockReport(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/seatblockreport').pipe(
      catchError(this.errorHandler)
    )
  }

  extraseatopenReport(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/extraseatopenreport').pipe(
      catchError(this.errorHandler)
    )
  }

  completeReport(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/completereport').pipe(
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
