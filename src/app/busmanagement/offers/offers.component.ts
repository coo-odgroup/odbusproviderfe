import { Component, OnInit,ViewChild } from '@angular/core';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],

})
export class OffersComponent implements OnInit {

  @ViewChild("addnew") addnew;


  constructor()
   {
    
  }
  
  
  ngOnInit() {
   
  }
 
}
