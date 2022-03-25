import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
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

  Menu:any = ['Bus Management', 'Booking Management', 'Reports', 'Website CMS Setting', 'Association', 'Operators','Manage Agent','Ticket Information']; 

  menuItems(): Observable<any> 
  {    
      return of(this.Menu);   
  }

  subMenuItems(menu:any): Observable<any> 
  {
      if(menu == 'Bus Management')
      {
          let SubMenu = ['Location', 'Boarding-Dropping', 'Bus', 'Coupon Type', 'Coupon', 'Gallery','Seat Fare','Bus Type','Safety','Seating Type','Amenities','Seat Layout','Cancellation Slab','Bus Operator','Bus Schedule','Offers','Bus Sequence'];  
          return of(SubMenu);  
      }
      else if(menu=='Booking Management')
      {
          let SubMenu = ['Ticket Fare Slab', 'Bus Cancellation', 'Seat Block', 'Extra Seat Block', 'Seat Open', 'Booking Seized','Special Fare','Owner Fare','Festival Fare','Owner Payment'];    
          return of(SubMenu);  
      }
      else if(menu=='Reports')
      {
          let SubMenu = ['Extra Seat Open Report', 'Complete Report', 'Cancel Tickets Report', 'Failed Transaction Report', 'Bus Cancellation Report', 'Owner Payment Report','Contact Report','Coupon Used User Report'];          
          return of(SubMenu);  
      }
      else if(menu=='Website CMS Setting')
      {
          let SubMenu = ['Page Content', 'Social Media', 'User Review', 'Testimonial', 'Banner Management', 'SEO Setting','Special Slider','Master Setting'];    
          return of(SubMenu);  
      }
      else if(menu=='Association')
      {
          let SubMenu = ['Manage Association', 'Assign Operator', 'Assign Bus', 'Assign Agent', 'Booking Report', 'Cancel Report','Assign Agent Report','Assign Bus Report','Assign Operator Report'];     
          return of(SubMenu); 
      }
      else if(menu=='Operators')
      {
          let SubMenu = ['Operators', 'Assign Operators', 'Assign OperatorsBus', 'Assign Agent', 'Operator Booking Report', 'Operator Cancel Report'];  
          return of(SubMenu); 
      }
      else if(menu=='Manage Agent')
      {
          let SubMenu = ['Agent Wallet Request', 'Agent Wallet Balance', 'Agent All Transaction', 'Agent Feedback', 'Push Notification', 'Agent Requested','Our Agent','Agent Commission Slab','Agent Fee Slab','Agent Boooking Report','Agent Cancellation Report'];    
          return of(SubMenu); 
      }
      else if(menu=='Ticket Information')
      {
          let SubMenu = ['Cancel Ticket', 'Adjust Ticket'];   
          return of(SubMenu); 
      }      
             
  }

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
