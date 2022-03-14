import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Constants} from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private apiURL = Constants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }
  
  // getPermission(): Observable<any> {
  //   return this.httpClient.get(this.apiURL + '/Permission').pipe(
  //     catchError(this.errorHandler)
  //   )
  // }

  getAllPermission(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/PermissionData', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  //Added by chakra on 11 March 2022 03:14 PM
  readAll(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/Permission' ).pipe(
      catchError(this.errorHandler)
    )
  }
  
  getAllpaginationData(url,post): Observable<any> {
    return this.httpClient.post<any>(url, JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  create(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/createpermission', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  update(id, post): Observable<any> {
    return this.httpClient.put<any>(this.apiURL + '/Permission/' + id, JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  delete(id){
    return this.httpClient.delete<any>(this.apiURL + '/Permission/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  chngsts(id){
    return this.httpClient.put<any>(this.apiURL + '/changeStatusPermission/' + id, this.httpOptions)
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
