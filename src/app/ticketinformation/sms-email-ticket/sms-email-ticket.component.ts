import { BusOperatorService } from '../../services/bus-operator.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { AdmincancelticketService } from '../../services/admincancelticket.service';
import { BusService } from '../../services/bus.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../constant/constant';
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
    SMSDetails: any[];
    BookingID: any[];
    CancelMsg: any[];
    EmailDetails: any[];
    EmailToBooking: any[];
    msg: any;
    msgContent: any;
    smsData: any;


    constructor(private acts: AdmincancelticketService, private http: HttpClient, private notificationService: NotificationService, private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal, private busService: BusService, private busOperatorService: BusOperatorService, private locationService: LocationService, private spinner: NgxSpinnerService,) {
        this.isSubmit = false;
        // this.cancelTicketRecord= {} as Admincancelticket;
        config.backdrop = 'static';
        config.keyboard = false;
        this.ModalHeading = "Send Sms and Email ";
        this.ModalBtn = "Submit";

    }

    OpenModal(content) {
        this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
    }

    formatDate(date: any): string {
        if (!date) return '';
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    ngOnInit(): void {
        // this.spinner.show();
        this.sendSmsEmailTicketForm = this.fb.group({
            pnr_no: [null],
            action: [null]
        });

        this.SmsToCustomerForm = this.fb.group({
            customer_mob: [null],
            pnr_no: [null],
            source: [null],
            destination: [null],
            vechicle_no: [null],
            bus_name: [null],
            sms_to_customer: [null],
            conductor_no: [null],
            reason: [null]
        });

        this.SmsToConductorForm = this.fb.group({
            cmo_mob: [null],
            sms_to_cmo: [null],
            cmo_reason: [null],
            pnr_no: [null],
            source: [null],
            destination: [null],
            vechicle_no: [null],
            bus_name: [null],
            sms_to_customer: [null],
            customer_no: [null],
        });

        this.EmailToCustomerForm = this.fb.group({
            customer_mobile: [null],
            customer_eml: [null],
            ceml_reason: [null]
        });

        this.EmailToBookingForm = this.fb.group({
            Email_PNR: [null],
            booking_eml: [null],
            eml_msg: [null],
            eml_reason: [null]
        });

        this.CancelSmsToCustomerForm = this.fb.group({
            ccustomer_mob: [null],
            csms_to_customer: [null],
            creason: [null]
        });

        this.CancelSmsToConductorForm = this.fb.group({
            ccmo_mob: [null],
            csms_to_cmo: [null],
            ccmo_reason: [null]
        });

        this.CancelEmailToCustomerForm = this.fb.group({
            ccustomer_eml: [null],
            cceml_reason: [null]
        });

        this.CancelEmailToSupportForm = this.fb.group({
            cnclsupport_eml: [null],
            cncleml_reason: [null]
        });

        this.formConfirm = this.fb.group({
            id: [null]
        });
        this.searchForm = this.fb.group({
            name: [null],
            rows_number: Constants.RecordLimit,
        });

        this.pnrDetails = [];
    }

    page(label: any) {
        return label;
    }

    CancelSms_details() {
        if (this.sendSmsEmailTicketForm.value.action == 'cancelsmsToCustomer') {
            this.spinner.show();
            const pnr = {
                pnr: this.sendSmsEmailTicketForm.value.pnr_no
            };

            this.acts.GetCancelSmsToCustomer(pnr).subscribe(
                res => {
                    this.CancelMsg = res.data;
                    //   console.log(this.CancelMsg);
                    this.CancelSmsToCustomerForm.controls['ccustomer_mob'].setValue(this.CancelMsg[0].Phone);
                    this.CancelSmsToCustomerForm.controls['csms_to_customer'].setValue(this.CancelMsg[0].Message);
                    this.spinner.hide();
                }
            );
        }

        if (this.sendSmsEmailTicketForm.value.action == 'cancelsmsToConductor') {
            this.spinner.show();
            const pnr = {
                pnr: this.sendSmsEmailTicketForm.value.pnr_no
            };

            this.acts.GetCancelSmsToCMO(pnr).subscribe(
                res => {
                    this.CancelMsg = res.data;
                    //console.log(this.CancelMsg);
                    this.CancelSmsToConductorForm.controls['ccmo_mob'].setValue(this.CancelMsg[0].Phone);
                    this.CancelSmsToConductorForm.controls['csms_to_cmo'].setValue(this.CancelMsg[0].Message);
                    this.spinner.hide();
                }
            );
        }

        if (this.sendSmsEmailTicketForm.value.action == 'cancelemailToSupport') {
            this.CancelEmailToSupportForm.controls['cnclsupport_eml'].setValue('support@odbus.in');
        }

        if (this.sendSmsEmailTicketForm.value.action == 'cancelemailToCustomer') {
            this.spinner.show();
            const data = {
                pnr: this.sendSmsEmailTicketForm.value.pnr_no,
                action: this.sendSmsEmailTicketForm.value.action
            };

            this.acts.getEmailID(data).subscribe(
                res => {
                    this.EmailDetails = res.data;
                    //console.log(this.EmailDetails);  
                    this.CancelEmailToCustomerForm.controls['ccustomer_eml'].setValue(this.EmailDetails[0].users.email);
                    this.spinner.hide();
                }
            )
        }
    }

    Sms_details() {
        const data = {
            pnr: this.sendSmsEmailTicketForm.value.pnr_no,
            action: this.sendSmsEmailTicketForm.value.action
        };

        if (data != null) {
            if (this.sendSmsEmailTicketForm.value.action == 'smsToCustomer' || this.sendSmsEmailTicketForm.value.action == 'smsToConductor') {
                this.spinner.show();
                this.acts.getSmsDetails(data).subscribe(
                    res => {
                        this.SMSDetails = res.data;
                        this.msgContent = this.SMSDetails[0].contents;
                        this.smsData = this.SMSDetails[0].smsData;
                        if (this.sendSmsEmailTicketForm.value.action == 'smsToCustomer') {
                            this.SmsToCustomerForm.controls['customer_mob'].setValue(this.SMSDetails[0].to)
                            this.SmsToCustomerForm.controls['pnr_no'].setValue(this.SMSDetails[0].smsData.PNR)
                            this.SmsToCustomerForm.controls['source'].setValue(this.SMSDetails[0].smsData.source)
                            this.SmsToCustomerForm.controls['destination'].setValue(this.SMSDetails[0].smsData.destination)
                            this.SmsToCustomerForm.controls['vechicle_no'].setValue(this.SMSDetails[0].smsData.vechicle_no)
                            this.SmsToCustomerForm.controls['conductor_no'].setValue(this.SMSDetails[0].smsData.contactmob)
                            this.SmsToCustomerForm.controls['bus_name'].setValue(this.SMSDetails[0].smsData.busname)
                            this.SmsToCustomerForm.controls['sms_to_customer'].setValue(this.SMSDetails[0].contents);
                            this.spinner.hide();
                        }

                        if (this.sendSmsEmailTicketForm.value.action == 'smsToConductor') {
                            let cmo_mob = this.SMSDetails[0].to;
                            cmo_mob = cmo_mob.replace('[', '');
                            cmo_mob = cmo_mob.replace(']', '');
                            this.SmsToConductorForm.controls['cmo_mob'].setValue(cmo_mob);
                            this.SmsToConductorForm.controls['sms_to_cmo'].setValue(this.SMSDetails[0].contents);
                            this.SmsToConductorForm.controls['pnr_no'].setValue(this.SMSDetails[0].smsData.PNR)
                            this.SmsToConductorForm.controls['source'].setValue(this.SMSDetails[0].smsData.source)
                            this.SmsToConductorForm.controls['destination'].setValue(this.SMSDetails[0].smsData.destination)
                            this.SmsToConductorForm.controls['vechicle_no'].setValue(this.SMSDetails[0].smsData.vechicle_no)
                            this.SmsToConductorForm.controls['customer_no'].setValue(this.SMSDetails[0].smsData.customermobile)
                            this.SmsToConductorForm.controls['bus_name'].setValue(this.SMSDetails[0].smsData.busname)
                            this.spinner.hide();
                        }
                    }
                );
            }

            if (this.sendSmsEmailTicketForm.value.action == 'emailToCustomer' || this.sendSmsEmailTicketForm.value.action == 'emailToBooking') {
                const data = {
                    pnr: this.sendSmsEmailTicketForm.value.pnr_no,
                    action: this.sendSmsEmailTicketForm.value.action
                };

                if (this.sendSmsEmailTicketForm.value.action == 'emailToCustomer') {
                    this.spinner.show();
                    this.acts.getEmailID(data).subscribe(
                        res => {
                            this.EmailDetails = res.data;
                            //console.log(this.EmailDetails[0].users.email);  
                            this.EmailToCustomerForm.controls['customer_eml'].setValue(this.EmailDetails[0].users.email);
                            this.EmailToCustomerForm.controls['customer_mobile'].setValue(this.EmailDetails[0].users.phone);
                            this.spinner.hide();
                        }
                    )
                }

                if (this.sendSmsEmailTicketForm.value.action == 'emailToBooking') {
                    this.spinner.show();
                    this.acts.getEmailID(data).subscribe(
                        res => {
                            this.EmailDetails = res.data;
                            //console.log(this.EmailDetails);  
                            this.EmailToBookingForm.controls['Email_PNR'].setValue(this.EmailDetails[0].PNR);
                            this.EmailToBookingForm.controls['booking_eml'].setValue(this.EmailDetails[0].Booking_email);
                            this.EmailToBookingForm.controls['eml_msg'].setValue(this.EmailDetails[0].Message);
                            this.spinner.hide();
                        }
                    )
                }
            }

        }
    }

    getcustomerPreviewMessage() {
        const sms = this.SmsToCustomerForm.value;
        const smsD = this.smsData;

        return `
        Dear ${smsD?.customer_name || sms.customerName},
        Your journey Ticket is CONFIRMED ✅
        ━━━━━━━━━━━━━━━━━━
        🎫 BOOKING DETAILS
        PNR: ${sms.pnr_no}
        📍 From: ${sms.source}
        Boarding Point: ${smsD?.boarding_point}
        📍 To: ${sms.destination}
        Drop Point: ${smsD?.dropping_point}
        🚌 Bus: ${sms.bus_name}
        🔢 Vehicle No: ${sms.vechicle_no}
        📅 Date of Journey: ${smsD?.DOJ}
        ⏰ Departure Time: ${smsD?.dep || sms.departureTime}
        ━━━━━━━━━━━━━━━━━━
        👤 Passenger: ${smsD?.Name || sms.customerName}
        💺 Seat(s): ${smsD?.seat || sms.seatNo}
        🛏️ Sleeper(s): ${smsD?.seat || sms.seatNo}
        📞 Conductor Mob: ${sms.conductor_no}
        ━━━━━━━━━━━━━━━━━━
        📧 Ticket Details, cancellation policy & boarding info sent to your registered email.
        ⏰ Kindly report 15 minutes before departure.
        📱 For smooth booking, cancellation & managing your tickets Download the ODBUS App now.
        ━━━━━━━━━━━━━━━━━━
        🌟Thank you for choosing ODBUS🌟

        We wish you a safe & comfortable journey! 🙏`;
    }

    getcmoPreviewMessage() {
        const sms = this.SmsToConductorForm.value;
        const smsD = this.smsData;

        return `
        Dear Bus Partner,🙏

        A new booking has been confirmed.

        🎫 PNR: ${sms.pnr_no}
        🚌 Bus Name: ${smsD.busname}
        🚘 Vehicle No: ${sms?.vechicle_no}
        📅 Journey Date: ${smsD?.DOJ}
        ⏰ Departure Time: ${smsD?.dep}

        📍 From: ${smsD?.source}
        📌 Boarding Point: ${smsD?.boarding_point}
        📍 To: ${smsD?.destination}
        📌 Dropping Point: ${smsD?.dropping_point}

        👤 Passenger Name: ${smsD?.Name}
        💺 Seat Number(s): ${smsD?.seat || sms.seatNo}
        📞 Passenger Mob No: ${sms.customer_no}

        📢 Kindly call the passenger to reconfirm the boarding point.

        We appreciate your cooperation in ensuring a smooth journey for the passenger.🤝

        Team ODBUS🙏`;
    }

    getcustomeCancelMessage() {
        const sms = this.CancelMsg[0]?.smsData;

        return `
        Dear ${sms?.name}, 🙏

        Your ticket has been cancelled successfully.

        🎫 PNR : ${sms?.PNR}
        🚌 Bus : ${sms?.bus_name}
        🚘 Vehicle No : ${sms?.bus_number}
        📍 Route : ${sms?.source} – ${sms?.destination}
        📅 Journey Date : ${sms?.doj}
        💺 Cancelled Seat(s) : ${sms?.seat}
        💰 Refund Amount : ₹${sms?.refundAmount}

        The refund will be credited to your original payment source within 10–12 bank working days.

        Thank you for choosing ODBUS. 🙏`
    }

    getcmoCancelMessage() {
        const sms = this.CancelMsg[0]?.smsData;

        return `
        Dear Bus Partner, 🙏

        Please note that the following ticket has been cancelled :

        🎫 PNR: ${sms?.PNR}
        🚌 Bus: ${sms?.busname}
        🚘 Vehicle No: ${sms?.bus_number}
        📍 Route: ${sms?.source} – ${sms?.destination}

        📅 Journey Date: ${sms?.doj}
        💺 Cancelled Seat(s): ${sms?.seat}

        📢 Kindly update your seat chart and records accordingly.

        With Thanks 🙏
        Team ODBUS`
    }



    SendEmailToBooking() {
        this.spinner.show();
        const data = {
            pnr: this.sendSmsEmailTicketForm.value.pnr_no,
            action: this.sendSmsEmailTicketForm.value.action,
            Booking_Email: this.EmailToBookingForm.value.booking_eml,
            Booking_Msg: this.EmailToBookingForm.value.eml_msg,
            Booking_Reason: this.EmailToBookingForm.value.eml_reason,
        };

        this.acts.sendEmailToBooking(data).subscribe(
            res => {
                if (res.status == 1) {
                    this.spinner.hide();
                    this.notificationService.addToast({ title: Constants.SuccessTitle, msg: res.message, type: Constants.SuccessType });
                    this.ResetAttributes();
                }
            });
    }

    sendEmailToCustomer() {
        this.spinner.show();
        const data = {
            pnr: this.sendSmsEmailTicketForm.value.pnr_no,
            mobile: this.EmailToCustomerForm.value.customer_mobile,
            email: this.EmailToCustomerForm.value.customer_eml
        };

        this.acts.sendEmailToCustomer(data).subscribe(
            res => {
                if (res.status == 1) {
                    this.spinner.hide();
                    this.notificationService.addToast({ title: Constants.SuccessTitle, msg: res.message, type: Constants.SuccessType });
                    this.ResetAttributes();
                }
            });
    }

    sendCancelEmailToSupport() {
        this.spinner.show();
        const pnr = {
            pnr: this.sendSmsEmailTicketForm.value.pnr_no
        };

        this.acts.GetCancelSmsToCustomer(pnr).subscribe(
            res => {
                this.CancelMsg = res.data;

                const data = {
                    pnr: this.sendSmsEmailTicketForm.value.pnr_no,
                    mobile: this.CancelMsg[0].Phone,
                    email: this.CancelEmailToSupportForm.value.cnclsupport_eml
                };

                this.acts.sendCancelEmailToSupport(data).subscribe(
                    res => {
                        if (res.status == 1) {
                            this.spinner.hide();
                            this.notificationService.addToast({ title: Constants.SuccessTitle, msg: res.message, type: Constants.SuccessType });
                            this.ResetAttributes();
                        }
                    }
                );
            }
        );
    }

    sendCancelEmailToCustomer() {
        this.spinner.show();
        const pnr = {
            pnr: this.sendSmsEmailTicketForm.value.pnr_no
        };

        this.acts.GetCancelSmsToCustomer(pnr).subscribe(
            res => {
                this.CancelMsg = res.data;
                const data = {
                    pnr: this.sendSmsEmailTicketForm.value.pnr_no,
                    mobile: this.CancelMsg[0].Phone,
                    email: this.CancelEmailToCustomerForm.value.ccustomer_eml
                };

                //console.log(data); 

                this.acts.sendCancelEmailToSupport(data).subscribe(
                    res => {
                        if (res.status == 1) {
                            this.spinner.hide();
                            this.notificationService.addToast({ title: Constants.SuccessTitle, msg: res.message, type: Constants.SuccessType });
                            this.ResetAttributes();
                        }
                    }
                );
            }
        );
    }

    previewTicket() {
        let pnr = this.sendSmsEmailTicketForm.value.pnr_no;
        let url = 'https://www.odbus.in/pnr/' + pnr;
        let myWindow = window.open(url, "_blank");
        myWindow.focus();

    }



    //Save Customer SMS Data to custom_sms table
    SaveCustomerSMS() {
        this.spinner.show();
        let type = this.sendSmsEmailTicketForm.value.action;

        const pnr = {
            pnr: this.sendSmsEmailTicketForm.value.pnr_no
        };

        if (pnr != null) {
            this.acts.getBookingID(pnr).subscribe(
                res => {

                    this.BookingID = res.data;

                    if (type == 'smsToCustomer') {
                        const data = {
                            pnr: this.sendSmsEmailTicketForm.value.pnr_no,
                            booking_id: this.BookingID[0].id,
                            type: this.sendSmsEmailTicketForm.value.action,
                            mobile_no: this.SmsToCustomerForm.value.customer_mob,
                            contents: this.SmsToCustomerForm.value.sms_to_customer,
                            reason: this.SmsToCustomerForm.value.reason,
                            added_by: sessionStorage.getItem('USERID'),
                            sms_data: this.smsData, // API data
                            form_data: this.SmsToCustomerForm.value, // Form data
                        };

                        if (data != null) {
                            //Save data
                            this.acts.save_customSMS(data).subscribe(
                                resp => {
                                    if (resp.status == 1) {
                                        this.spinner.hide();
                                        this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: Constants.SuccessType });
                                        this.ResetAttributes();
                                    }
                                });
                        }
                    }
                    else if (type == 'smsToConductor') {
                        const data = {
                            pnr: this.sendSmsEmailTicketForm.value.pnr_no,
                            booking_id: this.BookingID[0].id,
                            type: this.sendSmsEmailTicketForm.value.action,
                            mobile_no: this.SmsToConductorForm.value.cmo_mob,
                            contents: this.SmsToConductorForm.value.sms_to_cmo,
                            reason: this.SmsToConductorForm.value.cmo_reason,
                            added_by: sessionStorage.getItem('USERID'),
                            sms_data: this.smsData, // API data
                            form_data: this.SmsToConductorForm.value, // Form data
                        };

                        if (data != null) {
                            //Save data
                            this.acts.smstomCmo(data).subscribe(
                                resp => {
                                    if (resp.status == 1) {
                                        this.spinner.hide();
                                        this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: Constants.SuccessType });
                                        this.ResetAttributes();
                                    }
                                });
                        }
                    }
                    else if (type == 'cancelsmsToCustomer') {
                        const data = {
                            pnr: this.sendSmsEmailTicketForm.value.pnr_no,
                            booking_id: this.BookingID[0].id,
                            type: this.sendSmsEmailTicketForm.value.action,
                            mobile_no: this.CancelSmsToCustomerForm.value.ccustomer_mob,
                            contents: this.CancelSmsToCustomerForm.value.csms_to_customer,
                            reason: this.CancelSmsToCustomerForm.value.creason,
                            added_by: sessionStorage.getItem('USERID'),
                            smsData: this.CancelMsg,

                        };

                        //console.log(data); 

                        if (data != null) {
                            //Save data
                            this.acts.save_CancelcustomSMSCustomer(data).subscribe(
                                resp => {
                                    if (resp.status == 1) {
                                        this.spinner.hide();
                                        this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: Constants.SuccessType });
                                        this.ResetAttributes();
                                    }
                                });
                        }
                    }
                    else if (type == 'cancelsmsToConductor') {
                        const data = {
                            pnr: this.sendSmsEmailTicketForm.value.pnr_no,
                            booking_id: this.BookingID[0].id,
                            type: this.sendSmsEmailTicketForm.value.action,
                            mobile_no: this.CancelSmsToConductorForm.value.ccmo_mob,
                            contents: this.CancelSmsToConductorForm.value.csms_to_cmo,
                            reason: this.CancelSmsToConductorForm.value.ccmo_reason,
                            added_by: sessionStorage.getItem('USERID'),
                            smsData: this.CancelMsg,
                        };

                        //console.log(data); 

                        if (data != null) {
                            //Save data
                            this.acts.save_CancelcustomSMSToCMO(data).subscribe(
                                resp => {
                                    if (resp.status == 1) {
                                        this.spinner.hide();
                                        this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: Constants.SuccessType });
                                        this.ResetAttributes();
                                    }
                                });
                        }
                    }

                }
            );
        }
    }

    search_pnr() {
        this.msg = '';
        this.pnrDetails = [];
        this.sendSmsEmailTicketForm.value.action = '';
        this.sendSmsEmailTicketForm.controls.action.value == '';

        this.spinner.show();

        let pnr = this.sendSmsEmailTicketForm.value.pnr_no;

        if (pnr != null) {
            this.acts.getPnrDetails(pnr).subscribe(
                res => {
                    this.pnrDetails = res.data;
                    // console.log(this.pnrDetails);
                    this.spinner.hide();

                    if (this.pnrDetails.length == 0) {
                        this.msg = "No Pnr Found"
                    }
                }
            );
        }
    }

    sendTicket() {
        if (this.sendSmsEmailTicketForm.value.action != null) {
            console.log(this.sendSmsEmailTicketForm.value);

        } else {
            this.notificationService.addToast({ title: 'Error', msg: "You must select at least one button", type: 'error' });
            return false;
        }
    }

    ResetAttributes() {
        this.msg = '';
        this.pnrDetails = [];
        this.sendSmsEmailTicketForm = this.fb.group({
            pnr_no: [null],
            action: [null]
        });
    }

    refresh() {
        this.spinner.show();
        this.ResetAttributes();
        this.spinner.hide();
    }

    sms_log_list: any = [];

    sms_log(content) {
        this.spinner.show();
        this.acts.sms_log().subscribe(
            res => {
                this.sms_log_list = res.data;
                this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
                this.spinner.hide();
            }
        );
    }
}
