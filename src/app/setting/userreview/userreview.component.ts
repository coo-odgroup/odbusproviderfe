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
  role_id: any;
  usre_name:any ;

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
    this.role_id= localStorage.getItem('ROLE_ID');
    this.usre_name= localStorage.getItem('USERNAME');

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
      role_id: localStorage.getItem('ROLE_ID'),
      user_id: localStorage.getItem('USERID'),
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
          // console.log(this.contactcontent);
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
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });
      }
    );
  }

  changeStatus(event,id){

    this.spinner.show();

    this.us.chngsts(id).subscribe(
      res => {
        this.refresh();
        this.notificationService.addToast({ title: 'Success', msg: res.message, type: 'success' });
        this.spinner.hide();
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

}
