import { Component,OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { DragulaService } from "ng2-dragula";
import { SeatlayoutService } from "src/app/services/seatlayout.service";
import { Subscription } from "rxjs";
//import { Test} from '../../model/test';

interface seatGroup {
  items: seatItem[][];
}
interface seatItem {
  seatText: any;
  rowNum: any;
  colNumber: any;
  berthType: any;
  seatType: any;
}

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
  
  LayoutRecords: seatGroup[];
  LayoutRecord: seatGroup;

  leaftSeatTypes=[
    new newSeatLayout('','','','','seater'),
    new newSeatLayout('','','','','sleeper'),
    new newSeatLayout('','','','','blank')
  ];

  left = [
    'sleeper.png',
    'seater.png',
    'blank.png'
  ];
  rightArray=[];
  subs = new Subscription();
  constructor(private dragulaService: DragulaService, private sLayout: SeatlayoutService) { 
   
    dragulaService.createGroup('PERSON', {
      copy: (el, source) => {
        return source.id === 'left';
      },
      copyItem: (item) => {
        return item;
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return target.id !== 'left';
      }
    });
  }
  RowCounter=[];
  genrows(rowForm: NgForm)
  {
    let rowNumberChoosen=rowForm.form.value.total_rows;

    if(rowNumberChoosen>0)
    {
      for(let startCounter=0; startCounter<rowNumberChoosen; startCounter++)
      {
        this.RowCounter.push(startCounter);
        this.rightArray.push(Array());//THIS IS USED TO CHECK IF THERE IS ANY ROW CREATED
      }
    }
    
  }
  ngOnInit(): void {
   
    this.subs.add(this.dragulaService.drop('PERSON')
      .subscribe(({ el, source, target, name, sibling }) => {
        console.log(sibling);
      })
    );
    
  } 
  formValue:any;
  saveLayout(form: NgForm)
  {
    // let tags = Object.keys(form.value).map(items => {
    //   return form.value[items];
    // });
    // this.formValue = tags;
    // console.log(tags);

    console.log(form.value);

  }
  
}