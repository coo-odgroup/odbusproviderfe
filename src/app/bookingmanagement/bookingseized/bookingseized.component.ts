import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BookingseizedService } from "../../services/bookingseized.service";
import { Bookingseized } from "../../model/bookingseized";
import { NotificationService } from '../../services/notification.service';
import {Constants} from '../../constant/constant';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";
import { BusService } from '../../services/bus.service';
import { BusOperatorService } from './../../services/bus-operator.service';



@Component({
  selector: 'app-bookingseized',
  templateUrl: './bookingseized.component.html',
  styleUrls: ['./bookingseized.component.scss']
})
export class BookingseizedComponent implements OnInit {
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  bookingSeized : Bookingseized[];
  bookingSeizedRecord : Bookingseized;

  public formConfirm: FormGroup;

  public searchForm: FormGroup;
  ModalHeading:any;
  
  public ModalBtn :any;
  public bookingseizedForm: FormGroup;
  bookingseizedData: FormArray;
  opertaors_name: any;
  buss_name: any;
  buss_number: any;
  pagination: any;
  all: any;
  buses: any;
  busoperators: any;

  constructor(
    private http: HttpClient,  private busService: BusService,
    private busOperatorService: BusOperatorService,
    private bookingseizedService: BookingseizedService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    config: NgbModalConfig,private spinner: NgxSpinnerService,
    private modalService: NgbModal)
    {
      config.backdrop = 'static';
      config.keyboard = false;
      this.ModalBtn = "Save";
    }

    


  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    this.spinner.show();
    this.bookingseizedForm = this.fb.group({
      bus_operator_id: [null],
      id: [null],
      bus_id: [null],
      busRoute: [null],
      date: [null],
      reason: [null],
      otherReson: [null],
      bookingseized:this.fb.array([ ]),
    });

    this.loadServices();




    // this.bookingseizedForm = this.fb.group({

    //   bookingseized:this.fb.array([ ])
      
    // });

   

    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });

    this.search();
  }


  page(label:any){
    return label;
   }

   
  search(pageurl="")
  {        this.spinner.show();
    const data = { 
      name: this.searchForm.value.name,
      rows_number:this.searchForm.value.rows_number, 
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.bookingseizedService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.all= res.data;
          this.bookingSeized= res.data.data.data;
          this.pagination= res.data.data;
          // console.log( this.bookingSeized);         
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.bookingseizedService.getAllData(data).subscribe(
        res => {
          this.all= res.data;
          this.bookingSeized= res.data.data.data;
          this.pagination= res.data.data;
          // console.log( res.data);
          this.spinner.hide();
        }
      );
    }
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
  fileName= 'Seat-Open.xlsx';

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
    this.bookingseizedForm = this.fb.group({
      bus_operator_id: [null],
      id: [null],
      bus_id: [null],
      busRoute: [null],
      date: [null],
      reason: [null],
      otherReson: [null],
      bookingseized:this.fb.array([ ]),
    });

  }


  getAll()
  {
    this.bookingseizedService.readAll().subscribe(
      resp => {
        this.bookingSeized = resp.data;
       
      }
    );
  }

  editbookingseized(id)
  { 
    const data = {
      bus_id: this.bookingseizedForm.value.bus_id
    };

    this.bookingseizedService.getById(data.bus_id).subscribe(
      resp => {
        this.bookingSeizedRecord= resp.data;  
    
      this.bookingseizedData = (<FormArray>this.bookingseizedForm.controls['bookingseized']) as FormArray;
      this.bookingseizedData.clear();
    // console.log(this.bookingSeizedRecord);
    // let resdata:any=this.bookingSeizedRecord[0].ticket_price;

    
    if (this.bookingSeizedRecord[0].ticket_price.length != 0)
    {
      for (let seized of this.bookingSeizedRecord[0].ticket_price) {
        // console.log(seized);
           let arraylen = this.bookingseizedData.length;
           let seizeddata: FormGroup = this.fb.group({
            location: this.fb.control( seized.from_location[0].name +">>"+ seized.to_location[0].name ),
            time: [seized.seize_booking_minute,Validators.compose([Validators.required ,Validators.pattern("^[0-9]*$")])] ,
            dep_time: this.fb.control( seized.dep_time),
            id: this.fb.control( seized.id)
          });
          this.bookingseizedData.insert(arraylen, seizeddata);
      } 

    }

      }
    );
   

    this.ModalHeading = 'Edit Booking Seized';
  }


  updatebookingseized()
  {
 
    this.spinner.show();

    const data = {
      busSeized: this.bookingseizedForm.controls.bookingseized.value,
      created_by: localStorage.getItem('USERNAME'),
      reason: this.bookingseizedForm.controls.reason.value,
      date: this.bookingseizedForm.controls.date.value,
      bus_id: this.bookingseizedForm.controls.bus_id.value,
      otherReson: this.bookingseizedForm.controls.otherReson.value      
    }   

    // this.bookingseizedService.save(data).subscribe(
    //   resp => {
    //     this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
    //     this.modalReference.close();
    //     this.search();
    
    // });

    this.bookingseizedService.save(data).subscribe(
      resp => {

        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.modalReference.close();
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      }
    );

}


loadServices() {
  this.busService.all().subscribe(
    res => {
      this.buses = res.data;
      this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });
    }
  );
  const BusOperator = {
    USER_BUS_OPERATOR_ID: localStorage.getItem("USER_BUS_OPERATOR_ID")
  };
  if (BusOperator.USER_BUS_OPERATOR_ID == "") {
    this.busOperatorService.readAll().subscribe(
      record => {
        this.busoperators = record.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name + '  )'; return i; });

      }
    );
  }
  else {
    this.busOperatorService.readOne(BusOperator.USER_BUS_OPERATOR_ID).subscribe(
      record => {
        this.busoperators = record.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name + '  )'; return i; });

      }
    );
  }
}

findOperator(event: any) {
  let operatorId = event.id;
  if (operatorId) {
    this.busService.getByOperaor(operatorId).subscribe(
      res => {
        this.buses = res.data;
        this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });
      }
    );
  }

}


openConfirmDialog(content,i)
{

  this.bookingSeizedRecord = this.bookingSeized[i];
  
  this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'lg' });
}

deleteRecord()
{
  // console.log(this.bookingSeizedRecord);

  let delitem=this.bookingSeizedRecord.id;
  // console.log(delitem);return
   this.bookingseizedService.delete(delitem).subscribe(
     resp => {
       if(resp.status==1)
         {
             this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
             this.confirmDialogReference.close();

              this.refresh();
          }
          else{
             
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
             this.spinner.hide();
           }
    }); 
}




}





