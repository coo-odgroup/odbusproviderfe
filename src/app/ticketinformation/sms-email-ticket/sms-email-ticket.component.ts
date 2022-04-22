import { BusOperatorService } from './../../services/bus-operator.service';
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
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
  selector: 'app-sms-email-ticket',
  templateUrl: './sms-email-ticket.component.html',
  styleUrls: ['./sms-email-ticket.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class SmsEmailTicketComponent implements OnInit {

  @ViewChild("addnew") addnew;
  public sendSmsEmailTicketForm: FormGroup;
  public formConfirm: FormGroup;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public searchForm: FormGroup;
  pagination: any;
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
    // this.cancelTicketRecord= {} as Admincancelticket;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Send Sms and Email ";
    this.ModalBtn = "Send"; 
    
  }

  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    // this.spinner.show();
    this.sendSmsEmailTicketForm = this.fb.group({
        pnr_no:[null],
        action:[null]
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });

    this.pnrDetails=[];
  }

  page(label:any){
    return label;
   }

   

  search_pnr()
  {
    this.spinner.show(); 

    let pnr = this.sendSmsEmailTicketForm.value.pnr_no;
    if(pnr!=null)
    {
      this.acts.getPnrDetails(pnr).subscribe(
        res => {
          this.pnrDetails= res.data;
          // console.log(this.pnrDetails);
          this.spinner.hide();
       
          if(this.pnrDetails.length == 0)
          {
            this.msg = "No Pnr Found"
          }
        }
      );
    }
  }

 
  previewCancelTicket()
  {
    // console.log(this.sendSmsEmailTicketForm.value);
  }

  sendTicket()
  {
    if(this.sendSmsEmailTicketForm.value.action!=null )
      {
        console.log(this.sendSmsEmailTicketForm.value);
      }else{
        this.notificationService.addToast({ title: 'Error', msg: "You must select at least one button", type: 'error' });
         return false;
      }
    
  }
  
  


  ResetAttributes()
  {
    this.msg ='';
    // this.pnrDetails=[];
    this.sendSmsEmailTicketForm = this.fb.group({
        // pnr_no:[null],
        action:[null]
  });
    this.ModalHeading = "Send Sms nad Email ";
    this.ModalBtn = "Send"; 
  }





}
