import { Component, OnInit } from '@angular/core';
import { ApiuserreportService } from '../../services/apiuserreport.service' ;
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BusOperatorService } from './../../services/bus-operator.service';
import { LocationService } from '../../services/location.service';
import { BusService} from '../../services/bus.service';
import {CancelTicketsReport } from '../../model/cancelticketsreports';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Constants} from '../../constant/constant' ;
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";
import { AdmincancelticketService } from 'src/app/services/admincancelticket.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-apicanceltickets',
  templateUrl: './apicanceltickets.component.html',
  styleUrls: ['./apicanceltickets.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class ApicancelticketsComponent implements OnInit {
  
  public searchFrom: FormGroup;
  modalReference: NgbModalRef;

  cancelTicketsReport: CancelTicketsReport[];
  cancelTicketsReportRecord: CancelTicketsReport;

  cancelticketdata: any;
  busoperators: any;
  locations: any;
  buses: any;
  allagent: any;
  // completedata: any;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  ModalHeading: string;
  ModalBtn: string;
  user: string;
  msg: string;
  pnrDetails: any[];
  cancelTicketForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient ,private notificationService: NotificationService,
    private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal,
    private locationService:LocationService,
    private busService:BusService, 
    private rs:ApiuserreportService,
    private busOperatorService: BusOperatorService ,
    private calendar: NgbCalendar, private acts: AdmincancelticketService,
    public formatter: NgbDateParserFormatter 
  ) { 
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getToday();
      config.backdrop = 'static';
      config.keyboard = false;
      this.ModalHeading = "Cancel Ticket";
      this.ModalBtn = "Cancel Ticket";
  }

  title = 'angular-app';
  fileName= 'Cancel-Ticket-Report.csv';
 
 
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ResetAttributes()
  {
    this.user='';
    this.msg ='';
    this.pnrDetails=[];
    // this.festivalFareRecord = {} as Festivalfare;
    this.cancelTicketForm = this.fb.group({
      pnr_no:[null],
      refundAmount:[null],
      reason:[null]
  });
    this.ModalHeading = "Cancel Ticket By Admin End";
    this.ModalBtn = "Cancel Ticket";
}

  ngOnInit(): void {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      payment_id : [null],pnr:[null],
      date_type:['journey'],
      rows_number: 50,
      source_id:[null],
      destination_id:[null],
      rangeFromDate:[null],
      rangeToDate :[null]

    })  
    this.search(); 
    this.loadServices();
  }

  search_pnr()
  {
    this.spinner.show(); 
    this.user='';
    this.cancelTicketForm.controls.refundAmount.setValue('');
    this.cancelTicketForm.controls.reason.setValue('');
 

    let pnr = this.cancelTicketForm.value.pnr_no;
    if(pnr!=null)
    {
      this.acts.getApiPnrDetails(pnr).subscribe(
        res => {
          this.pnrDetails= res.data;
          this.spinner.hide();
          console.log(this.pnrDetails);
       
          if(this.pnrDetails.length == 0)
          {
            this.msg = "No Pnr Found"
          }
        }
      );
    }
  }

  cancelTicket()
  {
    this.spinner.show();
    if(this.pnrDetails[0].user_id>0)
    {
      this.user = this.pnrDetails[0].user_id;
    }
    const data={
      id: this.pnrDetails[0].id , 
      pnr:this.cancelTicketForm.value.pnr_no,
      refund_amount:this.cancelTicketForm.value.refundAmount,
      reason:this.cancelTicketForm.value.reason,
      cancelled_by:localStorage.getItem('USERNAME'),
      created_by:localStorage.getItem('USERNAME'),
      status:2,
    };
    this.acts.ApicancelTicket(data).subscribe(
      res =>{
        if (res.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: res.message, type: 'success' });
          this.modalReference.close();
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: res.message, type: 'error' });
          this.spinner.hide();
        }
      }
    );

  }


  


  page(label:any){
    return label;
   }
  search(pageurl="")
  {
    this.spinner.show();
     this.cancelTicketsReportRecord = this.searchFrom.value ; 
     
    const data = {
          bus_operator_id: this.cancelTicketsReportRecord.bus_operator_id,
          payment_id:this.cancelTicketsReportRecord.payment_id,
          pnr:this.cancelTicketsReportRecord.pnr,
          date_type :this.cancelTicketsReportRecord.date_type,
          rows_number:this.cancelTicketsReportRecord.rows_number,
          source_id:this.cancelTicketsReportRecord.source_id,
          destination_id:this.cancelTicketsReportRecord.destination_id,
          rangeFromDate:this.cancelTicketsReportRecord.rangeFromDate,
          rangeToDate :this.cancelTicketsReportRecord.rangeToDate,
          USER_BUS_OPERATOR_ID:localStorage.getItem('USER_BUS_OPERATOR_ID')            
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.rs.cancelticketpaginationReport(pageurl,data).subscribe(
        res => {
          this.cancelticketdata= res.data;          
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.rs.cancelticketReport(data).subscribe(
        res => {
          this.cancelticketdata= res.data;
          console.log( this.cancelticketdata);
          // console.log( this.cancelticketdata);
          this.spinner.hide();
        }
      );
    }    
  }

  copyMessage($event:any ){
    // console.log($event);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = $event;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  
  exportexcel(): void
  {
    
    /* pass here the table id */
    let element = document.getElementById('export-section');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
  }

  refresh()
  {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      bus_operator_id: [null],
      payment_id : [null],pnr:[null],
      date_type:['journey'],
      rows_number: 50,
      source_id:[null],
      destination_id:[null],
      rangeFromDate:[null],
      rangeToDate :[null]

    })  
    this.loadServices();
    this.search();
  }


  
  loadServices() {

    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });

      }
    );
    this.locationService.readAll().subscribe(
      records=>{
        this.locations=records.data;
      }
    );

    this.busOperatorService.getApiClient().subscribe(
      res => {
        this.allagent = res.data;       
      }
    );
  }

  findSource(event:any)
  {
    let source_id=this.searchFrom.controls.source_id.value;
    let destination_id=this.searchFrom.controls.destination_id.value;
  
  
    if(source_id!="" && destination_id!="")
    {
      this.busService.findSource(source_id,destination_id).subscribe(
        res=>{
          this.buses=res.data;
        }
      );
    }
    else
    {
      this.busService.all().subscribe(
        res=>{
          this.buses=res.data;
        }
      );
    }
  }

}
