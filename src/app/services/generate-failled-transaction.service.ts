import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Constants} from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class GenerateFailledTransactionService {
  private endPoint = Constants.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  CheckSeat(post): Observable<any> {
    return this.httpClient.post<any>(Constants.CONSUMER_API_URL+'CheckSeatStatus', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  generateTicket(post): Observable<any> {
    return this.httpClient.post<any>(Constants.CONSUMER_API_URL+'GenerateFailedTicket', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }




  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error;
    }
    return throwError(errorMessage);
 }

}
