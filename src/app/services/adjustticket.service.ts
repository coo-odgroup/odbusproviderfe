import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants} from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class AdjustticketService {

  private consumerURL = Constants.CONSUMER_API_URL;
  private apiURL = Constants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getPnrDetails(post){
    return this.httpClient.post<any>(this.apiURL + '/getpnrdetails', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getBoardingDropping(post): Observable<any>{
    return this.httpClient.post<any>(this.consumerURL + 'BoardingDroppingPoints',JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getBusList(post){
    console.log(this.consumerURL + 'Listing?source='+post['source']+'&destination='+post['destination']+'&entry_date='+post['journey_dt']);
    return this.httpClient.get<any>(this.consumerURL + 'Listing?source='+post['source']+'&destination='+post['destination']+'&entry_date='+post['journey_dt'], this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getSeatLayout(post): Observable<any>{
      return this.httpClient.post<any>(this.consumerURL + 'viewSeats',JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getSeatFare(post): Observable<any>{
      return this.httpClient.post<any>(this.consumerURL + 'PriceOnSeatsSelection', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  getAllData(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/adjustticketdata', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  adjustTicket(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/adjustticket', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAllaginationData(url,post): Observable<any> {
    return this.httpClient.post<any>(url, JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  cancelTicket(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/adjustticket', JSON.stringify(post), this.httpOptions)
    .pipe(
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
