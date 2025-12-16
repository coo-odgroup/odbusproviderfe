import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants } from '../constant/constant';

@Injectable({
    providedIn: 'root'
})
export class ApilogreportService {
    private apiURL = Constants.BASE_URL;
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    constructor(private httpClient: HttpClient) { }

    readAll(): Observable<any> {
        return this.httpClient.get(this.apiURL + '/apiLogReport').pipe(
            catchError(this.errorHandler)
        )
    }

    delete(id: any) {
        return this.httpClient.delete<any>(this.apiURL + '/apiLogReport/' + id, this.httpOptions)
            .pipe(
                catchError(this.errorHandler)
            )
    }

    ApiLogreport(data: any): Observable<any> {
        return this.httpClient.post<any>(this.apiURL + '/apiLogReport', JSON.stringify(data), this.httpOptions).pipe(
            catchError(this.errorHandler)
        )
    }

    ApiLogpaginationReport(url: any, data: any): Observable<any> {
        return this.httpClient.post<any>(url, JSON.stringify(data), this.httpOptions).pipe(
            catchError(this.errorHandler)
        )
    }

    errorHandler(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }
}
