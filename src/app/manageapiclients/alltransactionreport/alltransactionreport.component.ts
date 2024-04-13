import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { ApiclientwalletService } from '../../services/apiclientwallet.service'
import { AgentWallet } from '../../model/agentwallet';
import { Constants } from '../../constant/constant';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";
import { ExitStatus } from 'typescript';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alltransactionreport',
  templateUrl: './alltransactionreport.component.html',
  styleUrls: ['./alltransactionreport.component.scss']
})
export class AlltransactionreportComponent implements OnInit {

  public form: FormGroup;
  model: NgbDateStruct;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  public editform: FormGroup;
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

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  walletdetails: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder, 
    private busOperatorService: BusOperatorService, 
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter,
    private ws: ApiclientwalletService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) 
  
  {
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
    this.formConfirm = this.fb.group({
      id: [null]
    });
    this.searchForm = this.fb.group({    
      name: [null],
      rangeFromDate:[null],
      rangeToDate:[null],
      user_id:[null],
      tranType:['all_transaction'],
      rows_number: Constants.RecordLimit,
    });
     
    this.form = this.fb.group({
      user_id: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])],
      remarks: [null, Validators.compose([Validators.required])],
      transaction_type: [null, Validators.compose([Validators.required])],
      pnr: [null, Validators.compose([Validators.required])],
      transaction_id: [null, Validators.compose([Validators.required])],
      reference_id: [null]
    });

    this.editform = this.fb.group({      
      amount: [null, Validators.compose([Validators.required])],
      balance: [null, Validators.compose([Validators.required])],
      id:[null]
    });


    this.search();
    this.loadServices();

  }


  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }
  ResetAttributes() {
    this.walletRecord = {} as AgentWallet;  

    this.form = this.fb.group({
      user_id: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])],
      remarks: [null, Validators.compose([Validators.required])],
      transaction_type: [null, Validators.compose([Validators.required])],
      pnr: [null, Validators.compose([Validators.required])],
      transaction_id: [null, Validators.compose([Validators.required])],
      reference_id: [null]
    });
    this.editform = this.fb.group({      
      amount: [null, Validators.compose([Validators.required])],
      balance: [null, Validators.compose([Validators.required])],
      id:[null]
    });

    this.form.reset();
    this.ModalHeading = "Enter OTP to Active ";
    this.ModalBtn = "Submit";
  }

  add(){
  
    const data = {
      user_id:this.form.value.user_id,
      amount:this.form.value.amount,
      remarks:this.form.value.remarks,
      transaction_id:this.form.value.transaction_id,
      pnr:this.form.value.pnr,
      reference_id:this.form.value.reference_id,
      transaction_type:this.form.value.transaction_type,
      created_by: localStorage.getItem('USERNAME') 
    };

    this.ws.clientTransByAdmin(data).subscribe(
      resp => {
      if(resp.status==1)
      {
          this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
          this.modalReference.close();
          this.ResetAttributes();
          this.search();
          
      }
      else
      {
          this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
          this.spinner.hide();
      }
    }); 
  }

  edit(id){
    this.walletRecord = this.wallet[id];
    // console.log(this.walletRecord);
    this.editform = this.fb.group({
      id:[this.walletRecord.id],
      amount: [this.walletRecord.amount, Validators.compose([Validators.required])],
      balance: [this.walletRecord.balance, Validators.compose([Validators.required])],
    });

  }
  update(){
  const data = {
    id:this.editform.value.id,
    amount:this.editform.value.amount,
    balance:this.editform.value.balance,
    created_by: localStorage.getItem('USERNAME') 
  };

this.ws.clientTransUpdateByAdmin(data).subscribe(
  resp => {
  if(resp.status==1)
  {
      this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
      this.modalReference.close();
      this.ResetAttributes();
      this.search();
      
  }
  else
  {
      this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
      this.spinner.hide();
  }
});

  }



  page(label: any) {
    return label;
  }


  search(pageurl = "") {
    this.spinner.show();
    // console.log(this.searchForm.value);
  
    const data = {
      name: this.searchForm.value.name,
      rows_number: this.searchForm.value.rows_number,
      rangeFromDate:this.searchForm.value.rangeFromDate,
      rangeToDate :this.searchForm.value.rangeToDate,
      tranType :this.searchForm.value.tranType,
      user_id:this.searchForm.value.user_id
    };

    if (pageurl != "") {
      this.ws.getAllAgentPaginationTransaction(pageurl, data).subscribe(
        res => {
          this.wallet = res.data.data.data;
          // console.log(this.wallet);
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
        }
      );
    }
    else {
      this.ws.getAllagentTransaction(data).subscribe(
        res => {
          // this.wallet = res.data;

          this.wallet = res.data.data.data;
          // console.log(this.wallet);
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
          
        }
      );
    }
  }



  loadServices() {
    this.busOperatorService.getApiClient().subscribe(
      res => {
        this.allagent = res.data;
        // console.log(this.allagent);
        // this.allagent.map((i: any) => { i.agentData = i.name + '   -(  ' + i.location  + '  )'; return i; });
      }
    );
  }


 

  refresh() {
    this.searchForm = this.fb.group({    
      name: [null],
      rangeFromDate:[null],
      rangeToDate:[null],
      user_id:[null],
      tranType:['all_transaction'],
      rows_number: Constants.RecordLimit,
    });
    this.search();
    this.spinner.hide();

  }


  expsearch() {
    this.spinner.show();  
    const data = {
      name: this.searchForm.value.name,
      rows_number: 'all',
      rangeFromDate:this.searchForm.value.rangeFromDate,
      rangeToDate :this.searchForm.value.rangeToDate,
      tranType :this.searchForm.value.tranType,
      user_id:this.searchForm.value.user_id
    };
      this.ws.getAllagentTransaction(data).subscribe(
        res => {
          this.walletdetails = res.data.data.data;
          let length = this.walletdetails.length;
         
          if(length != 0)
          {
            setTimeout(() => {
              this.exportexcel();
            }, 3 * 1000);
            this.spinner.hide();
          }
        }
      );
  }

  title = 'angular-app';
  fileName = 'API-Client-All-Transaction.csv';

  exportexcel(): void {

    /* pass here the table id */
    let element = document.getElementById('export-section');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

}
