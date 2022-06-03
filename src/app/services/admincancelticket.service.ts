import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants} from '../constant/constant';

@Injectable({
  providedIn: 'root'
})

export class AdmincancelticketService {
  private apiURL = Constants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getSmsDetails(post){
    return this.httpClient.post<any>(this.apiURL + '/getDetailsSms', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    ) 
  }

  getBookingID(post){
      return this.httpClient.post<any>(this.apiURL + '/getBookingID', JSON.stringify(post), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  save_customSMS(post){
      return this.httpClient.post<any>(this.apiURL + '/save_customSMS', JSON.stringify(post), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }  

  //Get Cancel Message to customer
  GetCancelSmsToCustomer(post){
      return this.httpClient.post<any>(this.apiURL + '/GetCancelSmsToCustomer', JSON.stringify(post), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  //Get Cancel Message to CMO
  GetCancelSmsToCMO(post){
      return this.httpClient.post<any>(this.apiURL + '/GetCancelSmsToCMO', JSON.stringify(post), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  save_CancelcustomSMSCustomer(post){
    return this.httpClient.post<any>(this.apiURL + '/save_CancelcustomSMSToCustomer', JSON.stringify(post), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  save_CancelcustomSMSToCMO(post){
    return this.httpClient.post<any>(this.apiURL + '/save_CancelcustomSMSToCMO', JSON.stringify(post), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getPnrDetails(post){
      return this.httpClient.post<any>(this.apiURL + '/getPnrDetailsForSms', JSON.stringify(post), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  } 

  getAllData(post): Observable<any> {
      return this.httpClient.post<any>(this.apiURL + '/cancelticketdata', JSON.stringify(post), this.httpOptions)
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
      return this.httpClient.post<any>(this.apiURL + '/cancelticket', JSON.stringify(post), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getEmailID(post){
      return this.httpClient.post<any>(this.apiURL + '/getEmailID', JSON.stringify(post), this.httpOptions)
      .pipe(
          catchError(this.errorHandler)
      )
  }

  sendEmailToBooking(post){
    return this.httpClient.post<any>(this.apiURL + '/sendEmailToBooking', JSON.stringify(post), this.httpOptions)
    .pipe(
        catchError(this.errorHandler)
    )
  } 

  sendEmailToCustomer(post){
    return this.httpClient.post<any>(this.apiURL + '/sendEmailToCustomer', JSON.stringify(post), this.httpOptions)
    .pipe(
        catchError(this.errorHandler)
    )
  } 

  sendCancelEmailToSupport(post){
    return this.httpClient.post<any>(this.apiURL + '/sendCancelEmailToSupport', JSON.stringify(post), this.httpOptions)
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
