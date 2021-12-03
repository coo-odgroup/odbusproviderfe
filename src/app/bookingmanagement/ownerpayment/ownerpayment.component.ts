import { BusOperatorService } from './../../services/bus-operator.service';
import { Busoperator } from './../../model/busoperator';
import { BusstoppageService } from '../../services/busstoppage.service';
import { Busstoppage } from '../../model/busstoppage';
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Ownerfare } from '../../model/ownerfare';
import { NotificationService } from '../../services/notification.service';
import { OwnerpaymentService } from '../../services/ownerpayment.service';
import { Ownerpayment} from '../../model/ownerpayment';
import { BusService} from '../../services/bus.service';
import { FormArray,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../services/location.service';
import { Location } from '../../model/location';
import {IOption} from 'ng-select';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-ownerpayment',
  templateUrl: './ownerpayment.component.html',
  styleUrls: ['./ownerpayment.component.scss']
})
export class OwnerpaymentComponent implements OnInit {

  @ViewChild("addnew") addnew;
  public ownerpaymentForm: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  pagination: any;
  

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  
  ownerpayments: Ownerpayment[];
  ownerpaymentRecord: Ownerpayment;
  //buses: Bus[];
  //busoperators: Busoperator[];
  //locations: Location[];
  //busstoppages: Busstoppage[];
  //busstoppageRecord: Busstoppage;
  buses :any;
  busoperators: any;
  locations: any;
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
  public searchBy:any;
  all: any;

  constructor(private ownerpaymentservice: OwnerpaymentService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private busService:BusService,private busOperatorService:BusOperatorService,private locationService:LocationService, private spinner: NgxSpinnerService,) { 
    this.isSubmit = false;
    this.ownerpaymentRecord= {} as Ownerpayment;
    //this.busstoppageRecord= {} as Busstoppage;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Owner Payment";
    this.ModalBtn = "Save";
  }

  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    this.spinner.show();
    this.ownerpaymentForm = this.fb.group({     
      bus_operator_id: [null],
      transaction_id:[null],      
      date: [null],
      amount: [null],
      remark: [null]
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });

    this.search();
    this.loadServices();

  }

  page(label:any){
    return label;
   }

   
  search(pageurl="")
  {      
    this.spinner.show();
    const data = { 
      name: this.searchForm.value.name,
      rows_number:this.searchForm.value.rows_number, 
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.ownerpaymentservice.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.ownerpayments= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;
          // console.log( this.BusOperators);
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.ownerpaymentservice.getAllData(data).subscribe(
        res => {
          this.ownerpayments= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;
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
  fileName= 'Owner-Payment.xlsx';

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



  ResetAttributes()
  {
    this.ownerpaymentRecord = {} as Ownerpayment;
    //this.busstoppageRecord= {} as Busstoppage;
    this.ownerpaymentForm = this.fb.group({
      bus_operator_id: [null],      
      date: [null],
      transaction_id:[null],
      amount: [null],
      remark: [null]
      
    });
    this.ModalHeading = "Add Owner Payment";
    this.ModalBtn = "Save";
  }

  loadServices(){
    this.busService.all().subscribe(
      res=>{
        this.buses=res.data;
      }
    );
    this.busOperatorService.readAll().subscribe(
    res=>{
      this.busoperators=res.data;
      this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });

    }
  );
  this.locationService.readAll().subscribe(
    records=>{
      this.locations=records.data;
    }
  );
  }



findSource()
{
  let source_id=this.ownerpaymentForm.controls.source_id.value;
  let destination_id=this.ownerpaymentForm.controls.destination_id.value;


  if(source_id!="" && destination_id!="")
  {
    this.busService.findSource(source_id,destination_id).subscribe(
      res=>{
        this.buses=res.data;
      }
    );
  }
  else
  {
    this.busService.all().subscribe(
      res=>{
        this.buses=res.data;
      }
    );
  }
}

  addOwnerFare()
  {
    this.spinner.show();
    const data ={
      bus_operator_id: this.ownerpaymentForm.value.bus_operator_id,      
      date: this.ownerpaymentForm.value.date,
      transaction_id:this.ownerpaymentForm.value.transaction_id,
      amount: this.ownerpaymentForm.value.amount,
      remark: this.ownerpaymentForm.value.remark,
      created_by:localStorage.getItem('USERNAME'),
    };
  //  console.log(data);
  //  return false;
   this.ownerpaymentservice.create(data).subscribe(
     resp => {
      if(resp.status==1)
         { 
      this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
          this.modalReference.close();
          this.ResetAttributes();
          this.loadServices();
          this.refresh();
         }
     }
   )    
  }


 
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }

  deleteOwnerFare(content, delitem:any)
  {
  
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });

    this.refresh();
    
  }



}

