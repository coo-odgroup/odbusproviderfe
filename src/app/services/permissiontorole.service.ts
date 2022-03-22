import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants } from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class PermissiontoroleService {

  private apiURL = Constants.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  create(data): Observable<any> {
    return this.httpClient
      .post<any>(
        this.apiURL + '/addPermissionToRole',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  delete(id){
    return this.httpClient.delete<any>(this.apiURL + '/deletePermissionToRole/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  

  getAllData(post): Observable<any> 
  {
     return this.httpClient
        .post<any>(
          this.apiURL + '/getPermissionToRole',
          JSON.stringify(post),
          this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  getAllaginationData(url, post): Observable<any> 
  {
      return this.httpClient
      .post<any>(url, JSON.stringify(post), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
