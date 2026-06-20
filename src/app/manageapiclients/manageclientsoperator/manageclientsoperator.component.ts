import { Component, EventEmitter, OnInit, Output, Input, ViewChild } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { ManageclientsoperatorService } from '../../services/manageclientsoperator.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Apiusercommissionslab} from '../../model/apiusercommissionslab';
import { Subject } from 'rxjs';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml  } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";
import { BusOperatorService } from './../../services/bus-operator.service';
const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
!one || !two ? false :
one.year === two.year
? one.month === two.month
? one.day === two.day
? false
: one.day < two.day
: one.month < two.month
: one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
!one || !two ? false :
one.year === two.year
? one.month === two.month
? one.day === two.day
? false
: one.day > two.day
: one.month > two.month
: one.year > two.year;

@Component({
  selector: 'app-manageclientsoperator',
  templateUrl: './manageclientsoperator.component.html',
  styleUrls: ['./manageclientsoperator.component.scss']
})
export class ManageclientsoperatorComponent implements OnInit {

  hoveredDate: NgbDateStruct;

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;

  _datesSelected: NgbDateStruct[] = [];

  @Input()
  set datesSelected(value: NgbDateStruct[]) {
  this._datesSelected = value;
  }

  get datesSelected(): NgbDateStruct[] {
  return this._datesSelected ? this._datesSelected : [];
  }

  @Output()
  datesSelectedChange = new EventEmitter<NgbDateStruct[]>();



  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  
  @ViewChild("addnew") addnew;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  apiusercommissionslab: Apiusercommissionslab[];
  aapiusercommissionslabRecord: Apiusercommissionslab;
  public isSubmit: boolean;

  public ModalHeading:any;
  public ModalBtn:any;
  pagination: any;
  all: any;
  allagent: any;
  busoperators: any;


constructor(
  private spinner: NgxSpinnerService,
  private ManageclientsoperatorService: ManageclientsoperatorService,
  private http: HttpClient,
  private notificationService: NotificationService,
  private fb: FormBuilder,
  private modalService: NgbModal,
  config: NgbModalConfig,
  private busOperatorService: BusOperatorService, ) 
  {
      this.isSubmit = false;
      this.aapiusercommissionslabRecord= {} as Apiusercommissionslab;
      config.backdrop = 'static';
      config.keyboard = false;
      this.ModalHeading = "Add Agent Commission Slab";
      this.ModalBtn = "Save";
}

OpenModal(content) {
  this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
}

ngOnInit(): void {

    // this.spinner.show();
    this.form = this.fb.group({
      id:[null],
      user_id: [null, Validators.compose([Validators.required])],
      bus_operator_id: [null, Validators.compose([Validators.required])],
      restriction_type:['permanent', Validators.required],
      journey_dates:[[]],
      user_name : sessionStorage.getItem('USERNAME'),   
    });  
    this.formConfirm=this.fb.group({
      id:[null]
    });

    this.searchForm = this.fb.group({ 
      user_id:[null],
      rows_number: Constants.RecordLimit,
    });
    this.loadServices();
    this.search(); 

    this.form.get('restriction_type')?.valueChanges.subscribe((type: string) => {

      const journeyDate = this.form.get('journey_dates');

      if (type === 'datewise') {
        journeyDate?.setValidators([Validators.required]);
      } else {
        journeyDate?.clearValidators();
        journeyDate?.setValue(null);
      }

      journeyDate?.updateValueAndValidity();
    });
}

page(label:any){
  return label;
 }

 loadServices() {

  this.busOperatorService.getApiClient().subscribe(
    res => {
      this.allagent = res.data;       
    }
  );
  this.busOperatorService.readAll().subscribe(
    res => {
      this.busoperators = res.data;
      this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });
    }
  );
}  


search(pageurl="")
{
  this.spinner.show();
    
  const data = { 
    user_id: this.searchForm.value.user_id,
    rows_number: this.searchForm.value.rows_number
  };
 
  // console.log(data);
  if(pageurl!="")
  {
    this.ManageclientsoperatorService.getAllaginationData(pageurl,data).subscribe(
      res => {
        this.apiusercommissionslab= res.data.data.data;
        // console.log(this.apiusercommissionslab);
        this.pagination= res.data.data;
        this.all= res.data;
        this.spinner.hide();
      }
    );
  }
  else
  {
    this.ManageclientsoperatorService.getAllData(data).subscribe(
      res => {
        this.apiusercommissionslab= res.data.data.data;
        // console.log(this.apiusercommissionslab);
        this.pagination= res.data.data;
        this.all= res.data;
        this.spinner.hide();
      }
    );
  }
}

refresh()
{
    this.spinner.show();

    this.searchForm = this.fb.group({  
      user_id: [null],
      starting_fare: [null], 
      upto_fare: [null],  
      commision: Constants.RecordLimit,
    });
    this.search();
}  
ResetAttributes()
{

  this.datesSelected = [];
  this.fromDate = null;
  this.toDate = null;

    this.aapiusercommissionslabRecord = {
      user_id:'',
      starting_fare:'',
      upto_fare:'',
      commision:''
    } as Apiusercommissionslab;
    this.form = this.fb.group({
      id:[null],
      user_id: ['', Validators.compose([Validators.required])],
      bus_operator_id: ['', Validators.compose([Validators.required])],
      restriction_type:['permanent', Validators.required],
      journey_dates:[[]],
      user_name : sessionStorage.getItem('USERNAME'),   
    });
    this.ModalHeading = "Add Commission Slab";
    this.ModalBtn = "Save";
}

addCommissionSlab()
{  

  this.spinner.show();

  let id:any=this.aapiusercommissionslabRecord.id;  
  const data = {
      user_id: this.form.value.user_id,
      bus_operator_id:this.form.value.bus_operator_id,
      restriction_type:this.form.value.restriction_type,
      journey_dates:this.form.value.journey_dates,
      created_by : sessionStorage.getItem('USERNAME'),     
  };

  // console.log(data);
  // return;

    this.ManageclientsoperatorService.create(data).subscribe(
      resp => {
     if(resp.status==1)
     {
          this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
          this.modalReference.close();
          //this.closebutton.nativeElement.click();
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

editAgentCommission(event : Event, id : any)
{
    this.aapiusercommissionslabRecord=this.apiusercommissionslab[id] ;
    console.log(this.aapiusercommissionslabRecord);

    this.form = this.fb.group({
      id:[this.aapiusercommissionslabRecord.id],
      user_id: [this.aapiusercommissionslabRecord.user_id, Validators.compose([Validators.required])],
      starting_fare: [this.aapiusercommissionslabRecord.starting_fare, Validators.compose([Validators.required])],
      upto_fare: [this.aapiusercommissionslabRecord.upto_fare,Validators.compose([Validators.required])],
      commision: [this.aapiusercommissionslabRecord.commision,Validators.compose([Validators.required])],
      addationalCharges: [this.aapiusercommissionslabRecord.addationalcharges,Validators.compose([Validators.required])],
      cancelCommission: [this.aapiusercommissionslabRecord.cancellation_commission,Validators.compose([Validators.required])],
      user_name : sessionStorage.getItem('USERNAME'),   
    });
    this.ModalHeading = "Edit Agent Commission Slab";
    this.ModalBtn = "Update";
}

openConfirmDialog(content,i)
{
      this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
      this.aapiusercommissionslabRecord=this.apiusercommissionslab[i] ;
      // console.log(this.aapiusercommissionslabRecord.id);

} 

deleteRecord()
{
  this.spinner.show()
  let delitem=this.aapiusercommissionslabRecord.id;

   this.ManageclientsoperatorService.delete(delitem).subscribe(
    resp => {
      if(resp.status==1)
          {
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
              this.confirmDialogReference.close();
              this.refresh();
              this.spinner.hide()
          }
          else{
             
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
            this.spinner.hide();
          }
    }); 
}


onDateSelection(event: any, date: NgbDateStruct) {

event.target.parentElement.blur();

if (!this.fromDate && !this.toDate) {

if (event.ctrlKey === true) {
  this.fromDate = date;
} else {
  this.addDate(date);
}

this.datesSelectedChange.emit(this.datesSelected);

} else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {

this.toDate = date;

this.addRangeDate(this.fromDate, this.toDate);

this.fromDate = null;
this.toDate = null;

} else {

this.toDate = null;
this.fromDate = date;

}
}

addDate(date: NgbDateStruct) {

const index = this.datesSelected.findIndex(
f => f.day === date.day &&
f.month === date.month &&
f.year === date.year
);

if (index >= 0) {
this.datesSelected.splice(index, 1);
} else {
this.datesSelected.push(date);
}

this.form.controls['journey_dates'].setValue([...this.datesSelected]);

console.log(this.datesSelected);

}

addRangeDate(fromDate: NgbDateStruct, toDate: NgbDateStruct) {

const from = new Date(
fromDate.year + '-' + fromDate.month + '-' + fromDate.day
).getTime();

const to = new Date(
toDate.year + '-' + toDate.month + '-' + toDate.day
).getTime();

for (let time = from; time <= to; time += 86400000) {

const date = new Date(time);

this.addDate({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate()
});

}

this.datesSelectedChange.emit(this.datesSelected);
}

isDateSelected(date: NgbDateStruct) {

return this.datesSelected.findIndex(
f => f.day === date.day &&
f.month === date.month &&
f.year === date.year
) >= 0;
}

isHovered = date =>
this.fromDate &&
!this.toDate &&
this.hoveredDate &&
after(date, this.fromDate) &&
before(date, this.hoveredDate);

isInside = date =>
after(date, this.fromDate) &&
before(date, this.toDate);

isFrom = date => equals(date, this.fromDate);

isTo = date => equals(date, this.toDate);


}
