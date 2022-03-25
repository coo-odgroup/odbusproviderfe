import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; 
import { Contactreport } from '../../model/contactreport';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {ContactreportService } from '../../services/contactreport.service';
import { BusOperatorService } from './../../services/bus-operator.service';
import {Constants} from '../../constant/constant' ;
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-contactreport',
  templateUrl: './contactreport.component.html',
  styleUrls: ['./contactreport.component.scss']
})
export class ContactreportComponent implements OnInit {

  
  public formConfirm: FormGroup;

  public searchFrom: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

   public isSubmit: boolean;
  public ModalHeading:any;
  public ModalBtn:any;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  contactcontent: Contactreport[];
  contactcontentRecord: Contactreport;
  pagination: any;
  busoperators: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient, 
    private notificationService: NotificationService, 
    private fb: FormBuilder,
    private busOperatorService: BusOperatorService ,
    private cs: ContactreportService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter
    )
    { 
      config.backdrop = 'static';
      config.keyboard = false;
      this.ModalHeading = "View Details";
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getToday();
    }


    
    

  ngOnInit(): void {
    this.spinner.show();
    this.formConfirm=this.fb.group({
      id:[null]
    });

    
    this.searchFrom = this.fb.group({
      bus_operator_id:[null],
      rows_number: Constants.RecordLimit,
      rangeFromDate:[null],
      rangeToDate:[null]    
    })

    this.search();
    this.loadServices();

  }


  
  OpenModal(content) 
  {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }

  page(label:any){
    return label;
   }
   search(pageurl="")
  {
    this.spinner.show();
      
    const data = {
      bus_operator_id:this.searchFrom.value.bus_operator_id,
      rows_number:this.searchFrom.value.rows_number,  
      rangeFromDate:this.searchFrom.value.rangeFromDate,
      rangeToDate :this.searchFrom.value.rangeToDate
    };
   
    if(pageurl!="")
    {
      this.cs.contactpaginationReport(pageurl,data).subscribe(
        res => {
          this.contactcontent= res.data.data;
          this.pagination= res.data;
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.cs.contactReport(data).subscribe(
        res => {
          this.contactcontent= res.data.data;
          console.log(this.contactcontent);
          this.pagination= res.data;
          this.spinner.hide();
        }
      );
    }


  }

  refresh()
  {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      bus_operator_id:[null],
      rows_number: Constants.RecordLimit,
      rangeFromDate:[null],
      rangeToDate:[null]    
    });
    this.search();
  }

  loadServices() {

    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });

      }
    );
  }


  ResetAttributes()
  {     
    this.ModalHeading = "View Details";
    // this.ModalBtn = "Save";
  }

  // getAll()
  // {
  //   this.cs.readAll().subscribe(
  //     res=>{
  //       this.contactcontent = res.data;
  //       // console.log(res.data);
  //     }
  //   );
  // }
  viewDetails(index)
  {
    // console.log(index);

    this.contactcontentRecord = this.contactcontent[index];

  }



  openConfirmDialog(content, index: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.contactcontentRecord = this.contactcontent[index];
  }
 

  deleteRecord(){
    this.spinner.show();
    let delitem = this.contactcontentRecord.id;
    // console.log(delitem);
    this.cs.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.confirmDialogReference.close();
          this.search();         
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
        }
      });
  }

}
