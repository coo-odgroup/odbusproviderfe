import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Contactreport } from '../../model/contactreport';
import { ApiLogreport } from '../../model/apilogreport';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ContactreportService } from '../../services/contactreport.service';
import { ApilogreportService } from '../../services/apilogreport.service';
import { BusOperatorService } from './../../services/bus-operator.service';
import { Constants } from '../../constant/constant';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-apilogreport',
  templateUrl: './apilogreport.component.html',
  styleUrls: ['./apilogreport.component.scss']
})
export class ApilogreportComponent implements OnInit {
  public formConfirm!: FormGroup;

  public searchFrom!: FormGroup;

  modalReference!: NgbModalRef;
  confirmDialogReference!: NgbModalRef;

  public isSubmit!: boolean;
  public ModalHeading: any;
  public ModalBtn: any;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  contactcontent!: Contactreport[];
  contactcontentRecord!: Contactreport;
  pagination: any;
  busoperators: any;

  apilogreport!: ApiLogreport[];
  apilogreportRecord!: ApiLogreport;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private busOperatorService: BusOperatorService,
    private cs: ContactreportService,
    private alrs: ApilogreportService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "View Details";
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getToday();
  }

  ngOnInit(): void {
    this.spinner.show();
    this.formConfirm = this.fb.group({
      id: [null]
    });

    this.searchFrom = this.fb.group({
      date: [null],
      user: [null],
      rows_number: 100
    })

    this.search();

  }

  page(label: any) {
    return label;
  }
  search(pageurl = "") {
    this.spinner.show();

    const data = {
      date: this.searchFrom.value.date,
      user: this.searchFrom.value.user,
      rows_number: this.searchFrom.value.rows_number,
    };

    console.log(data);
    console.log(pageurl);

    if (pageurl != "") {
      this.alrs.ApiLogpaginationReport(pageurl, data).subscribe(
        res => {
          this.apilogreport = res.data;
          console.log("api search log works");
          this.pagination = res;
          this.spinner.hide();
        }
      );
    } else {
      this.alrs.ApiLogreport(data).subscribe(
        res => {
          this.apilogreport = res.data;
          console.log(res);
          console.log("api log works");
          this.pagination = res;
          this.spinner.hide();
        }
      );

      return;
    }
  }

  refresh() {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      date: [null],
      user: [null],
      rows_number: 100
    });
    this.search();
  }
}
