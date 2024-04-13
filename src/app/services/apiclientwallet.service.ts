import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants} from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class ApiclientwalletService {

  private apiURL = Constants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  getAllData(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL+ '/apiClientWalletData', JSON.stringify(post), this.httpOptions)
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

  getAllagentData(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL+ '/apiClientWalletAllData', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAllAgentPaginationData(url,post): Observable<any> {
    return this.httpClient.post<any>(url, JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAllagentbalance(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL+ '/apiClientWalletBalance', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAllAgentPaginationBalance(url,post): Observable<any> {
    return this.httpClient.post<any>(url, JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAllagentTransaction(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL+ '/apiClientAllTransaction', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // getAllagentTransaction(post): Observable<any> {
  //   return this.httpClient.post<any>(this.apiURL+ '/apiClientTotalTransactions', JSON.stringify(post), this.httpOptions)
  //   .pipe(
  //     catchError(this.errorHandler)
  //   )
  // }

  getAllAgentPaginationTransaction(url,post): Observable<any> {
    return this.httpClient.post<any>(url, JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }



  clientTransByAdmin(data): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/clientTransByAdmin', JSON.stringify(data), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  clientTransUpdateByAdmin(data): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/clientTransUpdateByAdmin', JSON.stringify(data), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  create(data): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/agentWallet', JSON.stringify(data), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

 
  chngsts(id, post): Observable<any> {
    return this.httpClient.put<any>(this.apiURL + '/changeapiClientWalletStatus/' + id, JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  declineWlletReq(id, post): Observable<any>{
    return this.httpClient.put<any>(this.apiURL + '/declineWlletReqStatus/' + id, JSON.stringify(post), this.httpOptions)
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
