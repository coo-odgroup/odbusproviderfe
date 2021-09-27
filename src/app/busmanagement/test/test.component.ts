import { Component,OnInit } from "@angular/core";
import { SeatlayoutService } from "src/app/services/seatlayout.service";
import { Subscription } from "rxjs";
//import { Test} from '../../model/test';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit  {
  hoveredDate: NgbDate | null = null;
  public calendarForm: FormGroup;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private fb: FormBuilder) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getToday();
  }
  ngOnInit() {
    this.calendarForm=this.fb.group({
      rangeFromDate:[this.formatDate(this.fromDate.year+"-"+this.fromDate.month+"-"+this.fromDate.day)],
      rangeToDate:[this.formatDate(this.toDate.year+"-"+this.toDate.month+"-"+this.toDate.day)]
    });
    console.log(this.fromDate);
  }
  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.calendarForm.controls.rangeFromDate.setValue(date);
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.calendarForm.controls.rangeToDate.setValue(date);
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.calendarForm.controls.rangeFromDate.setValue(date);
    }
  }
  check_date()
  {
    console.log("Check Output");
    console.log(this.calendarForm.controls.rangeFromDate.value);
    console.log(this.calendarForm.controls.rangeToDate.value);
  }
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

}