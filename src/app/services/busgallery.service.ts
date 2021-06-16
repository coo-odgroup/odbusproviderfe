import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {Constants} from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class BusgalleryService {

  private apiURL = Constants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  all(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + '/Gallery/',  this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  create(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/Gallery/', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  update(id, post): Observable<any> {
    return this.httpClient.put<any>(this.apiURL + '/Gallery/' + id, JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  delete(id){
    return this.httpClient.delete<any>(this.apiURL + '/Gallery/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  chngsts(id, post): Observable<any> {
    // console.log("hello");
    return this.httpClient.put<any>(this.apiURL + '/changeStatusGallery/' + id,JSON.stringify(post), this.httpOptions)
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
