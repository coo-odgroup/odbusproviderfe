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

  public SmsToCustomerForm: FormGroup;
  public SmsToConductorForm: FormGroup;
  public EmailToBookingForm: FormGroup;
  public EmailToCustomerForm: FormGroup;
  public CancelSmsToCustomerForm: FormGroup;
  public CancelSmsToConductorForm: FormGroup;
  public CancelEmailToCustomerForm: FormGroup;
  public CancelEmailToSupportForm: FormGroup;

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
  SMSDetails: any[];
  BookingID: any[];
  CancelMsg: any[];
  EmailDetails:any[];
  EmailToBooking:any[];
  msg: any;
  

  constructor(private acts: AdmincancelticketService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private busService:BusService,private busOperatorService:BusOperatorService,private locationService:LocationService , private spinner: NgxSpinnerService,) { 
    this.isSubmit = false;
    // this.cancelTicketRecord= {} as Admincancelticket;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Send Sms and Email ";
    this.ModalBtn = "Submit"; 
    
  }

  OpenModal(content) {
     this.modalReference = this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }

  ngOnInit(): void {
    // this.spinner.show();
    this.sendSmsEmailTicketForm = this.fb.group({
        pnr_no:[null],
        action: [null]       
    });

    this.SmsToCustomerForm = this.fb.group({
        customer_mob:[null],
        sms_to_customer:[null],
        reason:[null]
    });

    this.SmsToConductorForm = this.fb.group({
        cmo_mob:[null],       
        sms_to_cmo:[null],
        cmo_reason:[null]
    });

    this.EmailToCustomerForm = this.fb.group({
      customer_mobile:[null],       
      customer_eml:[null],     
      ceml_reason:[null]
    });

    this.EmailToBookingForm = this.fb.group({
        Email_PNR:[null],  
        booking_eml:[null],
        eml_msg:[null],
        eml_reason:[null]
    });

    this.CancelSmsToCustomerForm = this.fb.group({
        ccustomer_mob:[null],
        csms_to_customer:[null],
        creason:[null]
    });

    this.CancelSmsToConductorForm = this.fb.group({
        ccmo_mob:[null],
        csms_to_cmo:[null],
        ccmo_reason:[null]
    });

   this.CancelEmailToCustomerForm = this.fb.group({
        ccustomer_eml:[null],     
        cceml_reason:[null]
   });

   this.CancelEmailToSupportForm = this.fb.group({
        cnclsupport_eml:[null],       
        cncleml_reason:[null]
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

  CancelSms_details()
  {
      if(this.sendSmsEmailTicketForm.value.action == 'cancelsmsToCustomer')
      {
          const pnr = {
                         pnr:this.sendSmsEmailTicketForm.value.pnr_no                       
                      };
         
          this.acts.GetCancelSmsToCustomer(pnr).subscribe(
              res => {                          
                  this.CancelMsg = res.data;
                  //console.log(this.CancelMsg);
                  this.CancelSmsToCustomerForm.controls['ccustomer_mob'].setValue(this.CancelMsg[0].Phone);
                  this.CancelSmsToCustomerForm.controls['csms_to_customer'].setValue(this.CancelMsg[0].Message);
              }
           );   
      } 

      if(this.sendSmsEmailTicketForm.value.action == 'cancelsmsToConductor')
      {
          const pnr = {
                         pnr:this.sendSmsEmailTicketForm.value.pnr_no                       
                      };
         
          this.acts.GetCancelSmsToCMO(pnr).subscribe(
              res => {                          
                  this.CancelMsg = res.data;
                  //console.log(this.CancelMsg);
                  this.CancelSmsToConductorForm.controls['ccmo_mob'].setValue(this.CancelMsg[0].Phone);
                  this.CancelSmsToConductorForm.controls['csms_to_cmo'].setValue(this.CancelMsg[0].Message);
              }
           );   
      }

      if(this.sendSmsEmailTicketForm.value.action == 'cancelemailToSupport')
      {
           this.CancelEmailToSupportForm.controls['cnclsupport_eml'].setValue('support@odbus.in');
      }

      if(this.sendSmsEmailTicketForm.value.action == 'cancelemailToCustomer')
      {
            const data = {
                pnr:this.sendSmsEmailTicketForm.value.pnr_no,
                action:this.sendSmsEmailTicketForm.value.action
            };

            this.acts.getEmailID(data).subscribe(
                res => {
                    this.EmailDetails = res.data;
                    //console.log(this.EmailDetails);  
                    this.CancelEmailToCustomerForm.controls['ccustomer_eml'].setValue(this.EmailDetails[0].users.email);                   
                }
            )
      }
  }

  Sms_details()
  {     
      const data = {
          pnr:this.sendSmsEmailTicketForm.value.pnr_no,
          action:this.sendSmsEmailTicketForm.value.action
      };    

      if(data != null)
      {
        if(this.sendSmsEmailTicketForm.value.action == 'smsToCustomer' || this.sendSmsEmailTicketForm.value.action == 'smsToConductor')
        {
            this.acts.getSmsDetails(data).subscribe(
                res => {

                    this.SMSDetails = res.data; 
                    
                    console.log(this.SMSDetails); 

                    if(this.sendSmsEmailTicketForm.value.action == 'smsToCustomer')
                    {                   
                        this.SmsToCustomerForm.controls['customer_mob'].setValue(this.SMSDetails[0].to);
                        this.SmsToCustomerForm.controls['sms_to_customer'].setValue(this.SMSDetails[0].contents);
                    }  
                    
                    if(this.sendSmsEmailTicketForm.value.action == 'smsToConductor')
                    {                   
                        let cmo_mob = this.SMSDetails[0].to;
                        cmo_mob = cmo_mob.replace('[',''); 
                        cmo_mob = cmo_mob.replace(']',''); 
                        this.SmsToConductorForm.controls['cmo_mob'].setValue(cmo_mob);
                        this.SmsToConductorForm.controls['sms_to_cmo'].setValue(this.SMSDetails[0].contents);
                    }                                
                }
            );
        }   
        
        if(this.sendSmsEmailTicketForm.value.action == 'emailToCustomer' || this.sendSmsEmailTicketForm.value.action == 'emailToBooking')
        {            
                const data = {
                    pnr:this.sendSmsEmailTicketForm.value.pnr_no,
                    action:this.sendSmsEmailTicketForm.value.action
                };
                
                if(this.sendSmsEmailTicketForm.value.action == 'emailToCustomer')
                {
                    this.acts.getEmailID(data).subscribe(
                        res => {
                            this.EmailDetails = res.data;
                            console.log(this.EmailDetails[0].users.email);  
                            this.EmailToCustomerForm.controls['customer_eml'].setValue(this.EmailDetails[0].users.email);
                            this.EmailToCustomerForm.controls['customer_mobile'].setValue(this.EmailDetails[0].users.phone);
                        }
                    )
                }   
                
                if(this.sendSmsEmailTicketForm.value.action == 'emailToBooking')
                {
                    this.acts.getEmailID(data).subscribe(
                        res => {
                            this.EmailDetails = res.data;
                            console.log(this.EmailDetails);  
                            this.EmailToBookingForm.controls['Email_PNR'].setValue(this.EmailDetails[0].PNR);
                            this.EmailToBookingForm.controls['booking_eml'].setValue(this.EmailDetails[0].Booking_email);
                            this.EmailToBookingForm.controls['eml_msg'].setValue(this.EmailDetails[0].Message);
                        }
                    )
                }
        }        

      }
  } 

  SendEmailToBooking()
  {   
       const data = {
            pnr:this.sendSmsEmailTicketForm.value.pnr_no,
            action:this.sendSmsEmailTicketForm.value.action,
            Booking_Email:this.EmailToBookingForm.value.booking_eml,
            Booking_Msg:this.EmailToBookingForm.value.eml_msg,
            Booking_Reason:this.EmailToBookingForm.value.eml_reason,
        };
        
        this.acts.sendEmailToBooking(data).subscribe(
            res => {                    
                if(res.status==1)
                {
                    this.notificationService.addToast({title:Constants.SuccessTitle,msg:res.message, type:Constants.SuccessType});
                    this.ResetAttributes();
                }                 
        });  
  }

    sendEmailToCustomer()
    {    
        const data = {
            pnr:this.sendSmsEmailTicketForm.value.pnr_no,
            mobile:this.EmailToCustomerForm.value.customer_mobile,
            email:this.EmailToCustomerForm.value.customer_eml
        };

        this.acts.sendEmailToCustomer(data).subscribe(
            res => {                    
                if(res.status==1)
                {
                    this.notificationService.addToast({title:Constants.SuccessTitle,msg:res.message, type:Constants.SuccessType});
                    this.ResetAttributes();
                }                 
            });  
    }

    sendCancelEmailToSupport()
    {
        const pnr = {
            pnr:this.sendSmsEmailTicketForm.value.pnr_no                       
         };

        this.acts.GetCancelSmsToCustomer(pnr).subscribe(
            res => {                          
                this.CancelMsg = res.data;

                const data = {
                    pnr:this.sendSmsEmailTicketForm.value.pnr_no,
                    mobile:this.CancelMsg[0].Phone,
                    email:this.CancelEmailToSupportForm.value.cnclsupport_eml
                };

                this.acts.sendCancelEmailToSupport(data).subscribe(
                    res => {
                        if(res.status == 1)
                        {
                            this.notificationService.addToast({title:Constants.SuccessTitle,msg:res.message, type:Constants.SuccessType});
                            this.ResetAttributes();
                        } 
                    }
                );  
            }
        ); 
    }

    sendCancelEmailToCustomer()
    {
        const pnr = {
            pnr:this.sendSmsEmailTicketForm.value.pnr_no                       
         };

        this.acts.GetCancelSmsToCustomer(pnr).subscribe(
            res => {                          
                this.CancelMsg = res.data;                
                const data = {
                    pnr:this.sendSmsEmailTicketForm.value.pnr_no,
                    mobile:this.CancelMsg[0].Phone,
                    email:this.CancelEmailToCustomerForm.value.ccustomer_eml
                };

                //console.log(data); 

                this.acts.sendCancelEmailToSupport(data).subscribe(
                    res => {
                        if(res.status == 1)
                        {
                            this.notificationService.addToast({title:Constants.SuccessTitle,msg:res.message, type:Constants.SuccessType});
                            this.ResetAttributes();
                        } 
                    }
                );  
            }
        ); 
    }

    previewTicket()
    {          
       let pnr = this.sendSmsEmailTicketForm.value.pnr_no;       
       let url = 'https://www.odbus.in/pnr/'+pnr;       
       let myWindow = window.open(url,"_blank");
       myWindow.focus();
       
    }



  //Save Customer SMS Data to custom_sms table
  SaveCustomerSMS(){

      let type = this.sendSmsEmailTicketForm.value.action;
     
      const pnr = {
          pnr:this.sendSmsEmailTicketForm.value.pnr_no         
      }; 

      if(pnr != null)
      {
            this.acts.getBookingID(pnr).subscribe(
              res => {
                  
                  this.BookingID = res.data;

                  if(type == 'smsToCustomer')
                  {
                      const data = {
                            pnr:this.sendSmsEmailTicketForm.value.pnr_no,
                            booking_id:this.BookingID[0].id,
                            type:this.sendSmsEmailTicketForm.value.action,
                            mobile_no:this.SmsToCustomerForm.value.customer_mob,
                            contents:this.SmsToCustomerForm.value.sms_to_customer,
                            reason:this.SmsToCustomerForm.value.reason,
                            added_by:localStorage.getItem('USERID')
                      };

                      if(data != null)
                      {
                          //Save data
                          this.acts.save_customSMS(data).subscribe(
                              resp => {
                                if(resp.status==1)
                                {
                                    this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                                    this.ResetAttributes();
                                }
                          });   
                      }
                  }
                  else if(type == 'smsToConductor')
                  {
                      const data = {
                            pnr:this.sendSmsEmailTicketForm.value.pnr_no,
                            booking_id:this.BookingID[0].id,
                            type:this.sendSmsEmailTicketForm.value.action,
                            mobile_no:this.SmsToConductorForm.value.cmo_mob,
                            contents:this.SmsToConductorForm.value.sms_to_cmo,
                            reason:this.SmsToConductorForm.value.cmo_reason,
                            added_by:localStorage.getItem('USERID')
                      };

                      //console.log(data);

                      if(data != null)
                      {
                          //Save data
                          this.acts.save_customSMS(data).subscribe(
                              resp => {
                                if(resp.status==1)
                                {
                                    this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                                    this.ResetAttributes();
                                }
                          });   
                      }
                  }  
                  else if(type == 'cancelsmsToCustomer')
                  {
                      const data = {
                            pnr:this.sendSmsEmailTicketForm.value.pnr_no,
                            booking_id:this.BookingID[0].id,
                            type:this.sendSmsEmailTicketForm.value.action,
                            mobile_no:this.CancelSmsToCustomerForm.value.ccustomer_mob,
                            contents:this.CancelSmsToCustomerForm.value.csms_to_customer,
                            reason:this.CancelSmsToCustomerForm.value.creason,
                            added_by:localStorage.getItem('USERID')
                      };

                      //console.log(data); 

                      if(data != null)
                      {
                          //Save data
                          this.acts.save_CancelcustomSMSCustomer(data).subscribe(
                              resp => {
                                if(resp.status==1)
                                {
                                    this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                                    this.ResetAttributes();
                                }
                          });   
                      }
                  }
                  else if(type == 'cancelsmsToConductor')
                  {
                      const data = {
                            pnr:this.sendSmsEmailTicketForm.value.pnr_no,
                            booking_id:this.BookingID[0].id,
                            type:this.sendSmsEmailTicketForm.value.action,
                            mobile_no:this.CancelSmsToConductorForm.value.ccmo_mob,
                            contents:this.CancelSmsToConductorForm.value.csms_to_cmo,
                            reason:this.CancelSmsToConductorForm.value.ccmo_reason,
                            added_by:localStorage.getItem('USERID')
                      };

                      //console.log(data); 

                      if(data != null)
                      {
                          //Save data
                          this.acts.save_CancelcustomSMSToCMO(data).subscribe(
                              resp => {
                                if(resp.status==1)
                                {
                                    this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                                    this.ResetAttributes();
                                }
                          });   
                      }
                  }
                  
                                 
              }
            );      
      }
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
      this.pnrDetails=[];
      this.sendSmsEmailTicketForm = this.fb.group({
          pnr_no:[null],
          action:[null]
      });    
  }
}
