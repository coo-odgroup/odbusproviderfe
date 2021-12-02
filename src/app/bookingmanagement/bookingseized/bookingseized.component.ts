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







@Component({
  selector: 'app-bookingseized',
  templateUrl: './bookingseized.component.html',
  styleUrls: ['./bookingseized.component.scss']
})
export class BookingseizedComponent implements OnInit {
  modalReference: NgbModalRef;
  bookingSeized : Bookingseized[];
  bookingSeizedRecord : Bookingseized;

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

  constructor(
    private http: HttpClient,
    private bookingseizedService: BookingseizedService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    config: NgbModalConfig,private spinner: NgxSpinnerService,
    private modalService: NgbModal)
    {
      config.backdrop = 'static';
      config.keyboard = false;
      this.ModalBtn = "Update";
    }

    


  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    this.spinner.show();
    this.bookingseizedForm = this.fb.group({

      bookingseized:this.fb.array([ ])
      
    });

    // this.getAll();

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
          // console.log( this.BusOperators);
         
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



  getAll()
  {
    this.bookingseizedService.readAll().subscribe(
      resp => {
        this.bookingSeized = resp.data;
        // console.log( this.bookingSeized );
      }
    );
  }

  editbookingseized(id)
  { 
    
    this.bookingSeizedRecord = this.bookingSeized[id];
    // console.log(this.bookingSeizedRecord );
    
    this.opertaors_name = this.bookingSeizedRecord.bus_operator.operator_name;
    this.buss_name = this.bookingSeizedRecord.name;
    this.buss_number = this.bookingSeizedRecord.bus_number;




    this.bookingseizedData = (<FormArray>this.bookingseizedForm.controls['bookingseized']) as FormArray;
    this.bookingseizedData.clear();
    if (this.bookingSeizedRecord.bookingseized.length> 0)
    {
      for (let seized of this.bookingSeizedRecord.bookingseized) {
           let arraylen = this.bookingseizedData.length;
           let seizeddata: FormGroup = this.fb.group({
            location: this.fb.control( seized.location.name ),
            time: [seized.seize_booking_minute,Validators.compose([Validators.required ,Validators.pattern("^[0-9]*$")])] ,
            id: this.fb.control( seized.id)
          });
          this.bookingseizedData.insert(arraylen, seizeddata);
      } 

    }

    this.ModalHeading = 'Edit Booking Seized';
  }


  updatebookingseized()
  {
 
    this.spinner.show();

    const data = {
      busSeized: this.bookingseizedForm.controls.bookingseized.value,
      created_by: localStorage.getItem('USERNAME')
    }

    this.bookingseizedService.update(data).subscribe(
      resp => {

    this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
    this.modalReference.close();
    this.search();
    
    });

}

}





