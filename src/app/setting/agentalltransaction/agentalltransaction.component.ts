import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { WalletService } from '../../services/wallet.service'
import { AgentWallet } from '../../model/agentwallet';
import { Constants } from '../../constant/constant';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-agentalltransaction',
  templateUrl: './agentalltransaction.component.html',
  styleUrls: ['./agentalltransaction.component.scss']
})
export class AgentalltransactionComponent implements OnInit {

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

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder, 
    private busOperatorService: BusOperatorService, 
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter,
    private ws: WalletService,
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
      bus_operator_id: [null],      
      name: [null],
      rangeFromDate:[null],
      rangeToDate:[null],
      user_id:[null],
      rows_number: Constants.RecordLimit,
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
    };
    // console.log(data);
    if (pageurl != "") {
      this.ws.getAllAgentPaginationTransaction(pageurl, data).subscribe(
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
      this.ws.getAllagentTransaction(data).subscribe(
        res => {
          this.wallet = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
          // console.log( this.wallet);
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


  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
  
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
  
    return [year, month, day].join('-');
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.searchForm.controls.rangeFromDate.setValue(date);
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.searchForm.controls.rangeToDate.setValue(date);
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.searchForm.controls.rangeFromDate.setValue(date);
    }
  }
  
  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }
  
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }
  
  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }


  refresh() {
    this.searchForm = this.fb.group({
      name: [null],
      bus_operator_id: [null],
      rows_number: Constants.RecordLimit,
    });
    this.search();
    this.spinner.hide();

  }

  title = 'angular-app';
  fileName = 'Agent-All-Transaction.xlsx';

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
