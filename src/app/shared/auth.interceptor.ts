import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpSentEvent, HttpUserEvent, HttpClient } from "@angular/common/http";

import { Router } from "@angular/router";
import { catchError} from 'rxjs/operators';
import { BehaviorSubject, Observable,throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    

    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  
    constructor(private router: Router,
        public auth: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
      
        const APIAccessToken =  localStorage.getItem('AccessToken');   
      
        req = req.clone({
            setHeaders: {
                Authorization: "Bearer " + APIAccessToken
            }
        });

       // console.log(req);

     
        return next.handle(req).pipe(catchError( (err: HttpErrorResponse) => {                
            if (err instanceof HttpErrorResponse) {                  
                if (err.status === 401) {
                        this.tokenSubject.next(null);                        
                        this.auth.getToken().subscribe(res=>{
                            localStorage.setItem('AccessToken', res.data);
                            this.tokenSubject.next(res.data);
                            this.collectFailedRequest(req);
                            this.retryFailedRequests(req,next);
                          }); 
                    
                }
            }                 
             return throwError(err);
        }
        
    ))
      

}

cachedRequests: Array<HttpRequest<any>> = [];

collectFailedRequest(request): void {
   this.cachedRequests.push(request);
   }

retryFailedRequests(request: HttpRequest<any>, next: HttpHandler): void {

    const APIAccessToken =  localStorage.getItem('AccessToken');        


   this.cachedRequests.forEach( request => {
   request = request.clone( {
       setHeaders: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
           Authorization: "Bearer " + APIAccessToken
       }
   } );   
  // window.location.reload();
   return  next.handle(request);    
   } );

}



}