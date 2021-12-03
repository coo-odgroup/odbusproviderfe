import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; 
// import { Contactreport } from '../../model/contactreport';
import { Userreview } from '../../model/userreview';
import { BusOperatorService } from './../../services/bus-operator.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {ContactreportService } from '../../services/contactreport.service';
import {Constants} from '../../constant/constant' ;
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {UserreviewService} from '../../services/userreview.service';

import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-userreview',
  templateUrl: './userreview.component.html',
  styleUrls: ['./userreview.component.scss']
})
export class UserreviewComponent implements OnInit {

   
  public formConfirm: FormGroup;

  public searchFrom: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading:any;
  public ModalBtn:any;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  contactcontent: Userreview[];
  contactcontentRecord: Userreview;
  pagination: any;
  busoperators: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient, 
    private notificationService: NotificationService, 
    private fb: FormBuilder,
    private busOperatorService: BusOperatorService ,
    private us: UserreviewService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter
    )
    { 
      config.backdrop = 'static';
      config.keyboard = false;
      this.ModalHeading = "View Details";
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getToday();
    }


    
    

  ngOnInit(): void {
    this.spinner.show();
    this.formConfirm=this.fb.group({
      id:[null]
    });

    
    this.searchFrom = this.fb.group({
      bus_operator_id:[null],
      rows_number: Constants.RecordLimit,
      rangeFromDate:[null],
      rangeToDate:[null]    
    })

    this.search();   
    this.loadServices();
  }


  OpenModal(content) 
  {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }

  page(label:any){
    return label;
   }
   search(pageurl="")
  {
    this.spinner.show();
      
    const data = {
      bus_operator_id:this.searchFrom.value.bus_operator_id,
      rows_number:this.searchFrom.value.rows_number,  
      rangeFromDate:this.searchFrom.value.rangeFromDate,
      rangeToDate :this.searchFrom.value.rangeToDate
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.us.UserReviewpaginationData(pageurl,data).subscribe(
        res => {
          this.contactcontent= res.data.data;
          this.pagination= res.data;
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.us.UserReviewData(data).subscribe(
        res => {
          this.contactcontent= res.data.data;
          this.pagination= res.data;
          this.spinner.hide();
        }
      );
    }


  }

  refresh()
  {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      bus_operator_id:[null],
      rows_number: Constants.RecordLimit,
      rangeFromDate:[null],
      rangeToDate:[null]    
    })

    this.search();
  }

  loadServices() {

    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
      }
    );
  }

  ResetAttributes()
  {     
    this.ModalHeading = "View Details";
  }

  
  viewDetails(index)
  {
    this.contactcontentRecord = this.contactcontent[index];

  }



  openConfirmDialog(content, index: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.contactcontentRecord = this.contactcontent[index];
  }
 

  deleteRecord(){
  
    let delitem = this.contactcontentRecord.id;
    // console.log(delitem);
    this.us.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.confirmDialogReference.close();
          this.search();         
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      });
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
      this.searchFrom.controls.rangeFromDate.setValue(date);
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.searchFrom.controls.rangeToDate.setValue(date);
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.searchFrom.controls.rangeFromDate.setValue(date);
    }
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
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

  changeStatus(event : Event, stsitem:any)
  {
    this.spinner.show();
    this.us.chngsts(stsitem).subscribe(
      resp => {
        
        if(resp.status==1)
        {
            this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
            this.refresh();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
            this.spinner.hide();
        }
      }
    );
  }



}
