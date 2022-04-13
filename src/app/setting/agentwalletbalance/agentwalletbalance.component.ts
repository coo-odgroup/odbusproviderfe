import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WalletService } from '../../services/wallet.service'
import { AgentWallet } from '../../model/agentwallet';
import { Constants } from '../../constant/constant';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";
import { BusOperatorService } from './../../services/bus-operator.service';

@Component({
  selector: 'app-agentwalletbalance',
  templateUrl: './agentwalletbalance.component.html',
  styleUrls: ['./agentwalletbalance.component.scss']
})
export class AgentwalletbalanceComponent implements OnInit {

 
  public form: FormGroup;

  public formConfirm: FormGroup;
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
     // otp: [null, Validators.compose([Validators.required])]
    });
    this.formConfirm = this.fb.group({
      id: [null]
    });
    this.searchForm = this.fb.group({     
      rangeFromDate:[null],
      rangeToDate:[null],
      user_id:[null],
      rows_number: Constants.RecordLimit,
    });

    this.loadServices();
    this.search();

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
      user_id: this.searchForm.value.user_id,
      rows_number: this.searchForm.value.rows_number,
      rangeFromDate:this.searchForm.value.rangeFromDate,
      rangeToDate :this.searchForm.value.rangeToDate,
    };
    // console.log(data);
    if (pageurl != "") {
      this.ws.getAllAgentPaginationBalance(pageurl, data).subscribe(
        res => {
          this.wallet = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
          //console.log(this.wallet);
        }
      );
    }
    else {
      this.ws.getAllagentbalance(data).subscribe(
        res => {
          this.wallet = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
         console.log(this.wallet);
        }
      );
    }
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
     // name: [null],
   //   bus_operator_id: [null],
      user_id: [null],
      rows_number: Constants.RecordLimit,
      rangeFromDate:[null],
      rangeToDate:[null],
    });
    this.search();
    this.spinner.hide();

  }

  title = 'angular-app';
  fileName = 'Agent-Wallet-Balance.xlsx';

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