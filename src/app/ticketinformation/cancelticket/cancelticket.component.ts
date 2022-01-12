import { BusOperatorService } from './../../services/bus-operator.service';
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {Admincancelticket} from '../../model/admincancelticket';
import { NotificationService } from '../../services/notification.service';
import { AdmincancelticketService } from '../../services/admincancelticket.service';
import { BusService} from '../../services/bus.service';
import { FormArray,FormBuilder, FormGroup, Validators } from '@angular/forms';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../services/location.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-cancelticket',
  templateUrl: './cancelticket.component.html',
  styleUrls: ['./cancelticket.component.scss'],
  providers: [NgbModalConfig, NgbModal]

})
export class CancelticketComponent implements OnInit {

  @ViewChild("addnew") addnew;
  public cancelTicketForm: FormGroup;
  public formConfirm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;


  public searchForm: FormGroup;
  pagination: any;

  cancelTickets: Admincancelticket[];
  cancelTicketRecord: Admincancelticket;
 
  buses :any;
  busoperators: any;
  locations: any;
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
  public searchBy:any;
  all: any;
  pnrDetails: any[];
  msg: any;
  

  constructor(private acts: AdmincancelticketService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private busService:BusService,private busOperatorService:BusOperatorService,private locationService:LocationService , private spinner: NgxSpinnerService,) { 
    this.isSubmit = false;
    this.cancelTicketRecord= {} as Admincancelticket;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Cancel Ticket";
    this.ModalBtn = "Cancel Ticket";
    
  }

  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    // this.spinner.show();
    this.cancelTicketForm = this.fb.group({
        pnr_no:[null],
        percentage_deduct:[null],
        refundAmount:[null], 
        reason:[null]
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });

    this.search();
    this.pnrDetails=[];
  }

  page(label:any){
    return label;
   }

   
  search(pageurl="")
  {     
      this.spinner.show(); 
    const data = { 
      name: this.searchForm.value.name,
      rows_number:this.searchForm.value.rows_number, 
    };
    if(pageurl!="")
    {
      this.acts.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.cancelTickets= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;
          // console.log(this.cancelTickets);
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.acts.getAllData(data).subscribe(
        res => {
          this.cancelTickets= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;
          // console.log( this.cancelTickets);
          this.spinner.hide();
        }
      );
    }
  }

  search_pnr()
  {
    this.spinner.show(); 

    let pnr = this.cancelTicketForm.value.pnr_no;
    if(pnr!=null)
    {
      this.acts.getPnrDetails(pnr).subscribe(
        res => {
          this.pnrDetails= res.data;
          this.spinner.hide();
       
          if(this.pnrDetails.length == 0)
          {
            this.msg = "No Pnr Found"
          }
        }
      );
    }
  }

  calculate()
  {
    let percentage = this.cancelTicketForm.value.percentage_deduct;
    // console.log(percentage);
    let totalFare  = this.pnrDetails[0].total_fare;
    // console.log(((totalFare/100)*(100-percentage)).toFixed(2));
    this.cancelTicketForm.controls['refundAmount'].setValue(((totalFare/100)*(100-percentage)).toFixed(2));
    
    // ((totalFare/100)*percentage).toFixed(2) //percentage calculation in angular

  }
  previewCancelTicket()
  {
    // console.log(this.cancelTicketForm.value);
  }

  cancelTicket()
  {
    // console.log(this.cancelTicketForm.value);
    const data={
      id: this.pnrDetails[0].id , 
      email:this.pnrDetails[0].users.email,
      pnr:this.cancelTicketForm.value.pnr_no,
      percentage_deduct:this.cancelTicketForm.value.percentage_deduct,
      refund_amount:this.cancelTicketForm.value.refundAmount,
      reason:this.cancelTicketForm.value.reason,
      cancelled_by:localStorage.getItem('USERNAME'),
      status:2,
    };

    // console.log(data);
    this.acts.cancelTicket(data).subscribe(
      res =>{
        if (res.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: res.message, type: 'success' });
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: res.message, type: 'error' });
          this.spinner.hide();
        }
      }
    );

  }

  refresh()
   {
    this.spinner.show();
    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });
     this.search();
   }


  title = 'angular-app';
  fileName= 'Owner-Fare.xlsx';

  exportexcel(): void
  {
    
    /* pass here the table id */
    let element = document.getElementById('print-section');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
  }
  ResetAttributes()
  {
    this.pnrDetails=[];
    // this.festivalFareRecord = {} as Festivalfare;
    this.cancelTicketForm = this.fb.group({
      pnr_no:[null],
      percentage_deduct:[null],
      refundAmount:[null],
      reason:[null]
  });
    this.ModalHeading = "Cancel Ticket By Admin End";
    this.ModalBtn = "Save"; 
  }




}
