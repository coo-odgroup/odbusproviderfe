import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants} from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class OprassignbusService {
  
  private apiURL = Constants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(data): Observable<any> {
    //console.log(this.apiURL + '/OprAssignBus');
    return this.httpClient.post<any>(this.apiURL + '/oprAssignBus', JSON.stringify(data), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  delete(data): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/deleteOprAssignBus', JSON.stringify(data), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  getAllData(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL+ '/getOprAssignBus', JSON.stringify(post), this.httpOptions)
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

  getbuslist(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL+ '/getOprBuslist', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getOperatorbuslist(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL+ '/getOperatorbuslist', JSON.stringify(post), this.httpOptions)
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
