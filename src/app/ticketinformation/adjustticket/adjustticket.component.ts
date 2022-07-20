import { BusOperatorService } from './../../services/bus-operator.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Admincancelticket } from '../../model/admincancelticket';
import { NotificationService } from '../../services/notification.service';
import { AdjustticketService } from '../../services/adjustticket.service';
import { BusService } from '../../services/bus.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../services/location.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { isSet } from 'lodash';

@Component({
  selector: 'app-adjustticket',
  templateUrl: './adjustticket.component.html',
  styleUrls: ['./adjustticket.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class AdjustticketComponent implements OnInit {

  @ViewChild("addnew") addnew;
  public adjustTicketForm: FormGroup;
  public formConfirm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;


  public searchForm: FormGroup;
  pagination: any;

  cancelTickets: Admincancelticket[];
  cancelTicketRecord: Admincancelticket;

  buses: any;
  busoperators: any;
  locations: any;
  public isSubmit: boolean;
  public mesgdata: any;
  public ModalHeading: any;
  public ModalBtn: any;
  public searchBy: any;
  all: any;
  pnrDetails: any[];
  busData: any;
  msg: any;
  busList: any;
  seatLayout: any;
  seatLayoutData: FormArray;
  seatLayoutCol: FormArray;
  seatFare: any[];
  seaterRecord: any;
  seatFareDetails: any[];
  seatIDs: any=[];
  seatNames:any=[];
  selectedSeats: string;
  maxAllowedSeat:number=0;
  boardingDropping: any;
  boardingPoints: any;
  droppingPoints: any;
  boardingData: any;
  droppingData: any;
  customer_payment_id: any;
  razorpay_id: any;
  customer_payment_order_id: any;
  customer_payment_razorpay_signature: any;


  constructor(private datePipe: DatePipe, private acts: AdjustticketService, private http: HttpClient, private notificationService: NotificationService, private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal, private busService: BusService, private busOperatorService: BusOperatorService, private locationService: LocationService, private spinner: NgxSpinnerService,) {
    this.isSubmit = false;
    this.cancelTicketRecord = {} as Admincancelticket;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Adjust Ticket By Admin End";
    this.ModalBtn = "Save";

  }

  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    // this.spinner.show();
    this.adjustTicketForm = this.fb.group({
      pnr_no: [null],
      j_date: [null],
      bus: [null],
      reason: [null],
      adj_note:[null],
      boarding_id:[null],
      dropping_id:[null],
      bus_seat_layout_data: this.fb.array([  ])

    });
    this.formConfirm = this.fb.group({
      id: [null]
    });
    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
    });

    this.search();
    this.pnrDetails = [];
    this.seaterRecord='';
    this.seatFareDetails=[];
    this.customer_payment_id = "" ;
      this.razorpay_id ="" ;
      this.customer_payment_order_id = "" ;
      this.customer_payment_razorpay_signature = ""  ;
  }

  page(label: any) {
    return label;
  }


  search(pageurl = "") {
    // this.spinner.show(); 
    const data = {
      name: this.searchForm.value.name,
      rows_number: this.searchForm.value.rows_number,
    };
    if (pageurl != "") {
      this.acts.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.cancelTickets = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
           //console.log(this.cancelTickets);
          this.spinner.hide();
        }
      );
    }
    else {
      this.acts.getAllData(data).subscribe(
        res => {
          this.cancelTickets = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          // console.log( this.cancelTickets);
          this.spinner.hide();
        }
      );
    }
  }

  search_pnr() {
    this.spinner.show();
    this.seatNames=[];
    let pnr = this.adjustTicketForm.value.pnr_no;
    if (pnr != null) {
      this.acts.getPnrDetails(pnr).subscribe(
        res => {

         
          this.pnrDetails = res.data; 
          // console.log(this.pnrDetails);
          

          if (this.pnrDetails.length == 0) {
            this.msg = "No Pnr Found";
          }
          else{

            if(this.pnrDetails.length!=0)
            {
              this.maxAllowedSeat= this.pnrDetails[0].booking_detail.length;
            }
            this.pnrDetails[0].booking_detail.forEach(b => {
              this.seatNames.push(b.bus_seats.seats.seatText); 
            });
                //  console.log(this.seatNames);
            this.busListing();
          }         
          
          this.spinner.hide();
        }
      );
    }
  }

  // calculate()
  // {
  //   let percentage = this.adjustTicketForm.value.percentage_deduct;
  //   // console.log(percentage);
  //   let totalFare  = this.pnrDetails[0].total_fare;
  //   // console.log(((totalFare/100)*(100-percentage)).toFixed(2));
  //   this.adjustTicketForm.controls['refundAmount'].setValue(((totalFare/100)*(100-percentage)).toFixed(2));

  //   // ((totalFare/100)*percentage).toFixed(2) //percentage calculation in angular

  // }
  previewCancelTicket() {
    // console.log(this.adjustTicketForm.value);
  }

  // cancelTicket()
  // {
  //   const data={
  //     id: this.pnrDetails[0].id , 
  //     email:this.pnrDetails[0].users.email,
  //     pnr:this.adjustTicketForm.value.pnr_no,
  //     percentage_deduct:this.adjustTicketForm.value.percentage_deduct,
  //     refund_amount:this.adjustTicketForm.value.refundAmount,
  //     reason:this.adjustTicketForm.value.reason,
  //     cancelled_by:localStorage.getItem('USERNAME'),
  //     status:2,
  //   };

  //   // console.log(data);
  //   this.acts.cancelTicket(data).subscribe(
  //     res =>{
  //       if (res.status == 1) {
  //         this.notificationService.addToast({ title: 'Success', msg: res.message, type: 'success' });
  //         this.refresh();
  //       }
  //       else {
  //         this.notificationService.addToast({ title: 'Error', msg: res.message, type: 'error' });
  //         this.spinner.hide();
  //       }
  //     }
  //   );

  // }


  refresh() {
    this.spinner.show();
    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
    });
    this.search();
  }

  busListing() {
    this.boardingPoints = [];
    this.droppingPoints = [];
    // console.log(this.datePipe.transform(this.pnrDetails[0].journey_dt,'dd-MM-yyyy'));

    const data =
    {
      journey_dt: this.datePipe.transform(this.pnrDetails[0].journey_dt, 'dd-MM-yyyy'),
      source: this.pnrDetails[0].from_location[0].name,
      destination: this.pnrDetails[0].to_location[0].name,
    }
    this.adjustTicketForm.controls.j_date.setValue(this.pnrDetails[0].journey_dt);

    this.acts.getBusList(data).subscribe(
      res => {
        this.busList = res.data;
        this.busList.map((i: any) => { i.testing = i.busName + ' - ' + i.busNumber; return i; });
        this.spinner.hide();
      }
    );

  }

  getSeatLayout() {
    this.seatFareDetails=[];
    // console.log(this.adjustTicketForm.value.bus);
    const data =
    {
      busId: this.adjustTicketForm.value.bus,
      journey_dt:   this.datePipe.transform(this.adjustTicketForm.value.j_date, 'dd-MM-yyyy'),
      source: this.pnrDetails[0].source_id,
      destination: this.pnrDetails[0].destination_id,
    }
    this.acts.getSeatLayout(data).subscribe(
      resp => {
        this.seatLayout = resp.data;
        //console.log(this.seatLayout);
        this.spinner.hide();
      
        
      this.seatLayoutData = (<FormArray>this.adjustTicketForm.controls['bus_seat_layout_data']) as FormArray;
      this.seatLayoutData.clear();    
      if(this.seatLayout.lower_berth)
      {
        if (this.seatLayout.lower_berth.length != undefined)
        {
          for (let lowerData of this.seatLayout.lower_berth) {
            // console.log(seized);
            if (lowerData.bus_seats) {
              let arraylen = this.seatLayoutData.length;
              // console.log(arraylen);

              let berthData: FormGroup = this.fb.group({
                        seatText: [lowerData.seatText],
                        seatType: [lowerData.seat_class_id],
                        berthType: [lowerData.berthType],
                        seatChecked: [],
                        category: ['0'],
                        seatId: [lowerData.id],
                        rowNumber:[lowerData.rowNumber],
                        bus_seats_id:[lowerData.bus_seats.id]
                        
              });
              this.seatLayoutData.insert(arraylen, berthData);
            }        
          } 
          // console.log(this.seatLayoutData.value);
        }


      }
        
      if(this.seatLayout.upper_berth)
      {
        if (this.seatLayout.upper_berth.length != undefined)
        {
          for (let upperData of this.seatLayout.upper_berth) {
            if (upperData.bus_seats) {
              let arraylen = this.seatLayoutData.length;
              let berthData: FormGroup = this.fb.group({
                        seatText: [upperData.seatText],
                        seatType: [upperData.seat_class_id],
                        berthType: [upperData.berthType],
                        seatChecked: [],
                        category: ['0'],
                        seatId: [upperData.id],
                        rowNumber:[upperData.rowNumber],
                        bus_seats_id:[upperData.bus_seats.id]
           
              });
              this.seatLayoutData.insert(arraylen, berthData);
            }        
          } 
          // console.log(this.seatLayoutData.value);
        }
      }
       
      }
    );

  }
  getBoardingDropping()
  {
    const data =
    {
      busId: this.adjustTicketForm.value.bus,
      source: this.pnrDetails[0].source_id,
      destination: this.pnrDetails[0].destination_id,
    }    
    this.acts.getBoardingDropping(data).subscribe(
      res => {
        this.boardingDropping = res.data;
        this.boardingPoints = res.data[0].boardingPoints;
        this.droppingPoints = res.data[0].droppingPoints;
        this.boardingPoints.map((i: any) => { i.boarding = i.boardingPoints + ' - ' + i.boardingTimes; return i; });
        this.droppingPoints.map((i: any) => { i.dropping = i.droppingPoints + ' - ' + i.droppingTimes; return i; });
        this.spinner.hide();
      }
    );
  }

  getSeatFare()
  {
    this.seatFareDetails=[];
    let checkedSeat=0;
   
    this.selectedSeats='';
    this.seaterRecord='';
    for (let selectedSeat of this.adjustTicketForm.value.bus_seat_layout_data) {
      if (selectedSeat.seatChecked == true)
      {

        checkedSeat++;
        this.selectedSeats = this.selectedSeats+selectedSeat.seatText+',';
     
        if (selectedSeat.berthType == 1)
        {
        this.seaterRecord = this.seaterRecord+"&seater[]="+selectedSeat.seatId;
        }
        if (selectedSeat.berthType == 2)
        {
        this.seaterRecord = this.seaterRecord+"&sleeper[]="+selectedSeat.seatId;
        }
      }
    }

    if(this.maxAllowedSeat < checkedSeat){

      this.notificationService.addToast({ title: 'Error', msg: "You are allowed to select "+this.maxAllowedSeat+" seat(s) only ", type: 'error' });
      return false;

    }

    this.selectedSeats =this.selectedSeats.slice(0, -1)
    // console.log(this.selectedSeats);

      if(this.seaterRecord!='undefined')
      {
        const data =
        {
          journey_dt: this.datePipe.transform(this.adjustTicketForm.value.j_date, 'dd-MM-yyyy'),
          busId: this.adjustTicketForm.value.bus,
          source: this.pnrDetails[0].source_id,
          destination: this.pnrDetails[0].destination_id,
          seat:this.seaterRecord,
        }
        // console.log(data);
        this.acts.getSeatFare(data).subscribe(
        resp => {
          this.seatFareDetails=resp.data;
          // console.log(this.seatFareDetails);
        });
      }   
  }

  dateWiseBusListing() {
    this.spinner.show();
    this.busList =[];
    this.boardingPoints = [];
    this.droppingPoints = [];
    // console.log(this.busList);
    this.adjustTicketForm.controls.bus.setValue('');
    const data =
    {
      journey_dt: this.datePipe.transform(this.adjustTicketForm.value.j_date, 'dd-MM-yyyy'),
      source: this.pnrDetails[0].from_location[0].name,
      destination: this.pnrDetails[0].to_location[0].name,
    }
    // this.adjustTicketForm.controls.j_date.setValue(this.pnrDetails[0].journey_dt);
    // console.log(data);
    this.acts.getBusList(data).subscribe(
      res => {
        this.busList = res.data;
        this.busList.map((i: any) => { i.testing = i.busName + ' - ' + i.busNumber; return i; });
        this.spinner.hide();
        // console.log(res.data);
      }
    );

  }
  



  title = 'angular-app';
  fileName = 'Adjust-ticket.xlsx';

  exportexcel(): void {

    /* pass here the table id */
    let element = document.getElementById('print-section');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
  ResetAttributes() {
    this.busList = [];
    this.seatLayout = [];
    this.pnrDetails = [];
    this.seaterRecord='';
    this.seatFareDetails=[];
    this.boardingPoints = [];
    this.droppingPoints = [];
      
    // this.festivalFareRecord = {} as Festivalfare;
    this.adjustTicketForm = this.fb.group({
      pnr_no: [null],
      j_date: [null],
      bus: [null],
      reason: [null],
      adj_note:[null],
      boarding_id:[null],
      dropping_id:[null],
      bus_seat_layout_data: this.fb.array([  ])
    });
    this.ModalHeading = "Adjust Ticket By Admin End";
    this.ModalBtn = "Adjust Ticket";
  }

  adjustTicket()
  {
    // console.log(this.pnrDetails[0]);

    this.spinner.show(); 

    this.seatIDs=[];
    

    let bookingDetailarr=[];

    let i=0;

    this.adjustTicketForm.value.bus_seat_layout_data.forEach(b => {

      if(b.seatChecked==true && this.pnrDetails[0].booking_detail[i]){
        let booking_dtl={
          "bus_seats_id": b.seatId,
          "passenger_name": this.pnrDetails[0].booking_detail[i].passenger_name,
          "passenger_gender": this.pnrDetails[0].booking_detail[i].passenger_gender,
          "passenger_age": this.pnrDetails[0].booking_detail[i].passenger_age,
          "created_by": localStorage.getItem('USERNAME')
          };  
          bookingDetailarr.push(booking_dtl);
          this.seatIDs.push(b.seatId);        
          i++;
      }
    });
    this.boardingPoints.forEach(b => {
      if(b.id==  this.adjustTicketForm.value.boarding_id){
        this.boardingData= b;     
      }
    });
    this.droppingPoints.forEach(b => {
      if(b.id==  this.adjustTicketForm.value.dropping_id){
        this.droppingData= b;     
      }
    });

// console.log(this.boardingData);
// console.log(this.droppingData);
// return;
    this.busList.forEach(b => {
      if(b.busId==  this.adjustTicketForm.value.bus){
        this.busData= b;     
      }
    });

    // console.log(this.busData[0].busNumber);

    if( bookingDetailarr.length== 0)
    {
      this.notificationService.addToast({ title: 'Error', msg: "Please Select Seat ", type: 'error' });
      this.spinner.hide(); 
      return false;
  
    }

    if(bookingDetailarr.length < this.maxAllowedSeat)
    {
      this.notificationService.addToast({ title: 'Error', msg: "You must select "+this.maxAllowedSeat+" seat(s)", type: 'error' });
      this.spinner.hide(); 
      return false;
  
    }

    if(bookingDetailarr.length > this.maxAllowedSeat)
    {
      this.notificationService.addToast({ title: 'Error', msg: "You are allowed to select "+this.maxAllowedSeat+" seat(s) only ", type: 'error' });
      this.spinner.hide(); 
      return false;
  
    }


    let conductor_number='';

    if(this.pnrDetails[0].bus.bus_contacts.length>0){
      this.pnrDetails[0].bus.bus_contacts.forEach(c => {

        if(c.type==2){
          conductor_number = c.phone;
        }
      
      });
    }
    if(this.pnrDetails[0].customer_payment!= null)
    {
      this.customer_payment_id = this.pnrDetails[0].customer_payment.id ;
      this.razorpay_id = this.pnrDetails[0].customer_payment.razorpay_id ;
      this.customer_payment_order_id = this.pnrDetails[0].customer_payment.order_id ;
      this.customer_payment_razorpay_signature = this.pnrDetails[0].customer_payment.razorpay_signature  ;
    }
    
    // console.log(this.pnrDetails[0]);
    // this.spinner.hide(); 
    // return;
    
    // console.log(this.busData);
    // return;
    let agent_number = null;
    let agent_email=null;
    let agent_name=null;

    // console.log(this.pnrDetails[0]);

    if(this.pnrDetails[0].user){
      agent_number=this.pnrDetails[0].user.phone;
      agent_email=this.pnrDetails[0].user.email;
      agent_name=this.pnrDetails[0].user.name;
    }

    

    const data = { 
        "customerInfo":{
          "email": this.pnrDetails[0].users.email,
          "phone": this.pnrDetails[0].users.phone,
          "name": this.pnrDetails[0].users.name
        },
        "bookingInfo":{
          "id": this.pnrDetails[0].id,
          "user_id": this.pnrDetails[0].user_id,
          "agent_number": agent_number,
          "agent_email": agent_email,
          "agent_name": agent_name,
          "customer_comission": this.pnrDetails[0].customer_comission,
          "pnr": this.pnrDetails[0].pnr,
          "bus_id": this.adjustTicketForm.value.bus,
          "busname": this.busData.busName,
          "busNumber": this.busData.busNumber,
          "bustype":this.busData.busType,
          "busTypeName":this.busData.busTypeName,
          "sittingType":this.busData.sittingType,
          "conductor_number":this.busData.conductor_number,
          "source_id":this.pnrDetails[0].source_id,
          "source_name":this.pnrDetails[0].from_location[0].name,
          "destination_id": this.pnrDetails[0].destination_id,
          "destination_name": this.pnrDetails[0].to_location[0].name,
          "seat_ids":this.seatIDs,
          "seat_names":this.seatNames,
          "journey_dt": this.adjustTicketForm.value.j_date,
          "boarding_point":  this.boardingData.boardingPoints,
          "dropping_point":  this.droppingData.droppingPoints,
          "boarding_time": this.boardingData.boardingTimes,
          "dropping_time": this.droppingData.droppingTimes,
          "origin": this.pnrDetails[0].origin,
          "app_type": this.pnrDetails[0].app_type,
          "typ_id": this.pnrDetails[0].typ_id,
          "total_fare": this.seatFareDetails[0].totalFare,
          "specialFare": this.seatFareDetails[0].specialFare,
          "addOwnerFare": this.seatFareDetails[0].addOwnerFare,
          "festiveFare": this.seatFareDetails[0].festiveFare,
          "owner_fare": this.seatFareDetails[0].ownerFare,
          "odbus_service_Charges": this.seatFareDetails[0].odbusServiceCharges,
          "odbus_gst":this.seatFareDetails[0].transactionFee, 
          "payable_amount":this.pnrDetails[0].payable_amount, 
          "reason": this.adjustTicketForm.value.reason,
          "adj_note": this.adjustTicketForm.value.adj_note,
          "created_by": localStorage.getItem('USERNAME'),
          "customer_payment_id" : this.customer_payment_id,
          "razorpay_payment_id" : this.razorpay_id,
          "razorpay_order_id" : this.customer_payment_order_id,
          "razorpay_signature" :this.customer_payment_razorpay_signature, 
          "bookingDetail": bookingDetailarr 
        },
    };
    
      // console.log(data);
      // return;

      this.acts.adjustTicket(data).subscribe(
        res =>{
         // console.log(res);
          if (res.status == 1) {
             if(res.data=='SEAT NOT AVAIL'){
              this.notificationService.addToast({ title: 'Error', msg:"Seat(s) are not available at the moment.Please select other..", type: 'error' });
             
             }else{

              this.notificationService.addToast({ title: 'Success', msg: res.message, type: 'success' });
          
               this.modalReference.close();
               this.refresh();
             }

             this.spinner.hide();
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: res.message, type: 'error' });
            this.spinner.hide();
            
          }
        },
        error => {
          this.notificationService.addToast({ title: 'Error', msg: error, type: 'error' });
          this.spinner.hide();   
    
        }
      );   

  }

  


}
