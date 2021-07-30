import { Component,OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { SeatlayoutService } from "src/app/services/seatlayout.service";
import { Subscription } from "rxjs";
//import { Test} from '../../model/test';


class newSeatLayout
{
  constructor(public seatText: any, public rowNum:any, public colNumber:any, public berthType:any, public seatType:any) {

  }
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  ngOnInit(): void {
  } 

}