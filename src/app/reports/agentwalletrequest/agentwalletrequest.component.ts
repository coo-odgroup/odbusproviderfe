import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WalletService } from '../../services/wallet.service'
import { AgentWallet } from '../../model/agentwallet';
import { Constants } from '../../constant/constant';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-agentwalletrequest',
  templateUrl: './agentwalletrequest.component.html',
  styleUrls: ['./agentwalletrequest.component.scss']
})
export class AgentwalletrequestComponent implements OnInit {

  public form: FormGroup;

  public formConfirm: FormGroup;
  public formRejectReason: FormGroup;
  public searchForm: FormGroup;
  pagination: any;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading: any;
  public ModalBtn: any;

  wallet: AgentWallet[];
  walletRecord: AgentWallet;
  busoperators: any;
  all: any;
  allagent: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder, 
    private busOperatorService: BusOperatorService, 
    private ws: WalletService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Location";
    this.ModalBtn = "Save";
  }





  ngOnInit(): void {
    this.spinner.show();
    this.form = this.fb.group({
      id: [null],
      otp: [null, Validators.compose([Validators.required])]
    });

    this.formRejectReason = this.fb.group({
      id: [null],
      reject_reason: [null, Validators.compose([Validators.required])]
    });
    
    this.formConfirm = this.fb.group({
      id: [null]
    });
    this.searchForm = this.fb.group({
      bus_operator_id: [null],
      name: [null],
      rows_number: Constants.RecordLimit,
      rangeFromDate:[null],
      rangeToDate:[null],
      user_id:[null],
    });

    this.search();
    this.loadServices();

  }


  OpenModal(content,id) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.walletRecord =this.wallet[id];
    // console.log(this.walletRecord);
  }

  
  ResetAttributes() {
    this.walletRecord = {} as AgentWallet;
    this.form = this.fb.group({
      id: [null],
      otp: [null, Validators.compose([Validators.required])]
    });
    this.form.reset();
    this.ModalHeading = "Enter OTP to Active ";
    this.ModalBtn = "Submit";
  }



  page(label: any) {
    return label;
  }


  search(pageurl = "") {
    this.spinner.show();
    const data = {
      name: this.searchForm.value.name,
      bus_operator_id: this.searchForm.value.bus_operator_id,
      rows_number: this.searchForm.value.rows_number,
      user_id:this.searchForm.value.user_id,
      rangeFromDate:this.searchForm.value.rangeFromDate,
      rangeToDate :this.searchForm.value.rangeToDate,
    };
    // console.log(data);
    if (pageurl != "") {
      this.ws.getAllAgentPaginationData(pageurl, data).subscribe(
        res => {
          this.wallet = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
          // console.log( this.BusOperators);
        }
      );
    }
    else {
      this.ws.getAllagentData(data).subscribe(
        
        res => {
          this.wallet = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
          // console.log( res.data);
        }
      );
    }
  }

  changeStatus()
  {
    this.spinner.show();
    let id:any=this.walletRecord.id;
    
    const data ={
      otp:this.form.value.otp,
      user_name : localStorage.getItem('USERNAME'),
    };

    this.ws.chngsts(id,data).subscribe(
      resp => {
        
        if(resp.status==1)
        {
            this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
            this.refresh();
            this.ResetAttributes();
            this.modalReference.close();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }

        this.spinner.hide();
      }
    );
  }


  OpenDeclinemodal(declinemodal,id){
    this.modalReference = this.modalService.open(declinemodal, { scrollable: true, size: 'md' });
    this.walletRecord =this.wallet[id];
  }
  ResetDeclineAttributes(){
    this.formRejectReason = this.fb.group({
      id: [null],
      reject_reason: [null, Validators.compose([Validators.required])]
    });
    this.formRejectReason.reset();
  }
  changeWalletReqStatus(){
    this.spinner.show();
    let id:any=this.walletRecord.id;
    
    const data ={
      reject_reason:this.formRejectReason.value.reject_reason,
      user_name : localStorage.getItem('USERNAME'),
    };

    //this.ws.chngsts(id,data).subscribe(
    this.ws.declineWlletReq(id,data).subscribe(
      resp => {        
        if(resp.status==1){          
          //console.log(resp.data);
          this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
          this.refresh();
          this.ResetDeclineAttributes();
          this.modalReference.close();
        }
        else{
          this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
        this.spinner.hide();
      }
    );
  }


  
  loadServices() {
    this.busOperatorService.getAllAgent().subscribe(
      res => {
        this.allagent = res.data;
        this.allagent.map((i: any) => { i.agentData = i.name + '   -(  ' + i.location  + '  )'; return i; });
      }
    );
  }



  refresh() {
    this.searchForm = this.fb.group({
      name: [null],
      bus_operator_id: [null],
      rows_number: Constants.RecordLimit,
      rangeFromDate:[null],
      rangeToDate:[null],
      user_id:[null],
    });
    this.search();
    this.spinner.hide();
    

  }

  title = 'angular-app';
  fileName = 'Seo-Setting.xlsx';

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

  


 

}
