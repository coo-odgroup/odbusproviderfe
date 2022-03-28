import { BusOperatorService } from './../../services/bus-operator.service';
import { Busoperator } from './../../model/busoperator';
import { BusstoppageService } from '../../services/busstoppage.service';
import { Busstoppage } from '../../model/busstoppage';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Ownerfare } from '../../model/ownerfare';
import { NotificationService } from '../../services/notification.service';
import { OwnerfareService } from '../../services/ownerfare.service';
import { Bus } from '../../model/bus';
import { BusService } from '../../services/bus.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../services/location.service';
import { Location } from '../../model/location';
import { IOption } from 'ng-select';
import * as XLSX from 'xlsx';
import { debounceTime, map } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import {Input,Output,EventEmitter} from '@angular/core';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';



const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;


@Component({
  selector: 'app-ownerfare',
  templateUrl: './ownerfare.component.html',
  styleUrls: ['./ownerfare.component.scss'],
  providers: [NgbModalConfig, NgbModal],
  styles: [`
  .custom-day {
    text-align: center;
    padding: 0.185rem 0.25rem;
    display: inline-block;
    height: 2rem;
    width: 2rem;
  }
  .custom-day.range, .custom-day:hover {
    background-color: rgb(2, 117, 216);
    color: white;
  }
  .custom-day.faded {
    background-color: rgba(2, 117, 216, 0.5);
  }
  .custom-day.selected{  
    background-color: rgba(255, 255, 0, .5);
      
  }
`]
})
export class OwnerfareComponent implements OnInit {
  @ViewChild("addnew") addnew;
  public ownerFareForm: FormGroup;
  public editownerFareForm: FormGroup;
  public formConfirm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  ownerFares: Ownerfare[];
  ownerFareRecord: Ownerfare;
  //buses: Bus[];
  //busoperators: Busoperator[];
  //locations: Location[];
  //busstoppages: Busstoppage[];
  //busstoppageRecord: Busstoppage;
  buses: any;
  busoperators: any;
  locations: any;
  public isSubmit: boolean;
  public mesgdata: any;
  public ModalHeading: any;
  public ModalBtn: any;
  public searchBy: any;


  public searchForm: FormGroup;
  pagination: any;
  all: any;


  constructor(private ownerfareService: OwnerfareService, private http: HttpClient, private notificationService: NotificationService, private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal, private busService: BusService, private busOperatorService: BusOperatorService, private locationService: LocationService, private spinner: NgxSpinnerService) {
    this.isSubmit = false;
    this.ownerFareRecord = {} as Ownerfare;
    //this.busstoppageRecord= {} as Busstoppage;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Owner Fare";
    this.ModalBtn = "Save";
  }

  OpenModal(content) {
    // console.log(content);

    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    this.spinner.show();
    this.ownerFareForm = this.fb.group({
      searchBy: ['operator'],
      bus_operator_id: [null],
      source_id: [null],
      destination_id: [null],
      id: [null],
      bus_id: [null],
      date: [null],
      seater_price: [null],
      sleeper_price: [null],
      reason: [null],
    });
    this.editownerFareForm = this.fb.group({
      searchBy: ['operator'],
      bus_operator_id: [null],
      source_id: [null],
      destination_id: [null],
      id: [null],
      bus_id: [null],
      date: [null],
      seater_price: [null],
      sleeper_price: [null],
      reason: [null],
    });
    this.formConfirm = this.fb.group({
      id: [null]
    });
    // this.loadOwnerFareData();


    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
    });

    this.search();
    this.loadServices();

  }

  page(label: any) {
    return label;
  }


  search(pageurl = "") {
    this.spinner.show();
    const data = {
      name: this.searchForm.value.name,
      rows_number: this.searchForm.value.rows_number,
    };

    // console.log(data);
    if (pageurl != "") {
      this.ownerfareService.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.ownerFares = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          // console.log( this.BusOperators);
          this.spinner.hide();
        }
      );
    }
    else {
      this.ownerfareService.getAllData(data).subscribe(
        res => {
          this.ownerFares = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
          // console.log( res.data);
        }
      );
    }
  }


  refresh() {
    this.spinner.show();
    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
    });
    this.search();


  }


  title = 'angular-app';
  fileName = 'Owner-Fare.xlsx';

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


  ResetAttributes() {
    this.datesSelected=[];
    this.ownerFareRecord = {} as Ownerfare;
    //this.busstoppageRecord= {} as Busstoppage;
    this.ownerFareForm = this.fb.group({
      searchBy: ["operator"],
      bus_operator_id: [null],
      source_id: [null],
      destination_id: [null],
      id: [null],
      bus_id: [null],
      date: [null],
      seater_price: [null],
      sleeper_price: [null],
      reason: [null],

    });
    this.editownerFareForm = this.fb.group({
      searchBy: ["operator"],
      bus_operator_id: [null],
      source_id: [null],
      destination_id: [null],
      id: [null],
      bus_id: [null],
      date: [null],
      seater_price: [null],
      sleeper_price: [null],
      reason: [null],

    });

    this.ModalHeading = "Add Owner Fare";
    this.ModalBtn = "Save";
    this.loadServices();
  }

  loadServices() {
    this.busService.all().subscribe(
      res => {
        this.buses = res.data;
        this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '  (' + i.from_location[0].name + ' >> ' + i.to_location[0].name + ')'; return i; });
      }
    );
    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name + '  )'; return i; });

      }
    );
    this.locationService.readAll().subscribe(
      records => {
        this.locations = records.data;
      }
    );
  }

  findOperator(event: any) {
    let operatorId = event.id;
    if (operatorId) {
      this.busService.getByOperaor(operatorId).subscribe(
        res => {
          this.buses = res.data;
          this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });
        }
      );
    }

  }

  // findSource(event:Event)
  // {
  //   let source_id=this.ownerFareForm.controls.source_id.value;
  //   let destination_id=this.ownerFareForm.controls.destination_id.value;

  //   if(source_id!="" && destination_id!="")
  //   {
  //     this.busService.findSource(source_id,destination_id).subscribe(
  //       res=>{
  //         this.buses=res.data;
  //       }
  //     );
  //   }
  //   else
  //   {
  //     this.busService.all().subscribe(
  //       res=>{
  //         this.buses=res.data;
  //       }
  //     );
  //   }
  // }

  findSource() {
    let source_id = this.ownerFareForm.controls.source_id.value;
    let destination_id = this.ownerFareForm.controls.destination_id.value;


    if (source_id != "" && destination_id != "") {
      this.busService.findSource(source_id, destination_id).subscribe(
        res => {
          this.buses = res.data;
          this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });
        }
      );
    }
    else {
      this.busService.all().subscribe(
        res => {
          this.buses = res.data;
          this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });
        }
      );
    }
  }

  addOwnerFare() {
    let id: any = this.editownerFareForm.value.id;
      if (id == null) {
        if(this.ownerFareForm.value.date == null){
          this.notificationService.addToast({ title: 'Error', msg: 'Please Select Date', type: 'error' });
          this.spinner.hide();
          return;
        }
        else{
          const data = {
            date: this.ownerFareForm.value.date,
            seater_price: this.ownerFareForm.value.seater_price,
            sleeper_price: this.ownerFareForm.value.sleeper_price,
            reason: this.ownerFareForm.value.reason,
            bus_operator_id: this.ownerFareForm.value.bus_operator_id,
            source_id: this.ownerFareForm.value.source_id,
            destination_id: this.ownerFareForm.value.destination_id,
            created_by: localStorage.getItem('USERNAME'),
            bus_id: this.ownerFareForm.value.bus_id,
          };
          this.ownerfareService.create(data).subscribe(
            resp => {
              if (resp.status == 1) {
                this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: Constants.SuccessType });
                this.modalReference.close();
                this.ResetAttributes();
                this.loadServices();
                this.refresh();
              }
              else {
                this.notificationService.addToast({ title: Constants.ErrorTitle, msg: resp.message, type: Constants.ErrorType });
                this.spinner.hide();
              }
            });
        }        
      }
      else {  
        const data = {
          date: this.editownerFareForm.value.date,
          seater_price: this.editownerFareForm.value.seater_price,
          sleeper_price: this.editownerFareForm.value.sleeper_price,
          reason: this.editownerFareForm.value.reason,
          bus_operator_id: this.editownerFareForm.value.bus_operator_id,
          source_id: this.editownerFareForm.value.source_id,
          destination_id: this.editownerFareForm.value.destination_id,
          created_by: localStorage.getItem('USERNAME'),
          bus_id: this.editownerFareForm.value.bus_id,
        };
        this.ownerfareService.update(id, data).subscribe(
          resp => {
            if (resp.status == 1) {
              this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: Constants.SuccessType });
              this.modalReference.close();
              this.ResetAttributes();
              this.refresh();
            }
            else {
              this.notificationService.addToast({ title: Constants.ErrorTitle, msg: resp.message, type: Constants.ErrorType });
              this.spinner.hide();
            }
          });
      }
  }

  editOwnerFare(event: Event, id: any) {
    this.spinner.show();
    this.ownerFareRecord = this.ownerFares[id];
    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
        this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name + '  )'; return i; });
      }
    );
    this.locationService.readAll().subscribe(
      records => {
        this.locations = records.data;
      }
    );
    if (this.ownerFareRecord.bus_operator_id != null) {
      this.searchBy = "operator";
      this.busService.getByOperaor(this.ownerFareRecord.bus_operator_id).subscribe(
        res => {
          this.buses = res.data;
          this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });
          this.spinner.hide();
        }
      );
    }
    else if (this.ownerFareRecord.source_id != null && this.ownerFareRecord.destination_id != null) {
      this.searchBy = "routes";
      this.busService.findSource(this.ownerFareRecord.source_id, this.ownerFareRecord.destination_id).subscribe(
        res => {
          this.buses = res.data;
          this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });
          this.spinner.hide();
        }
      );
    }
    else {
      this.busService.all().subscribe(
        res => {
          this.buses = res.data;
          this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });
          this.spinner.hide();
        }
      );
    }

    var d = new Date(this.ownerFareRecord.date);
    let date = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');

    this.editownerFareForm = this.fb.group({

      id: [this.ownerFareRecord.id],
      bus_id: [null],
      date: [date],
      seater_price: [this.ownerFareRecord.seater_price],
      sleeper_price: [this.ownerFareRecord.sleeper_price],
      reason: [this.ownerFareRecord.reason],
      source_id: [this.ownerFareRecord.source_id],
      destination_id: [this.ownerFareRecord.destination_id],
      bus_operator_id: [this.ownerFareRecord.bus_operator_id],
      searchBy: [this.searchBy],
    });
    let selBusses = [];
    for (let busData of this.ownerFareRecord.bus) {
      selBusses.push(JSON.parse(busData.id));
    }
    this.editownerFareForm.controls.bus_id.setValue(selBusses);

    this.ModalHeading = "Edit Owner Fare";
    this.ModalBtn = "Update";
  }
  openConfirmDialog(content) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
  }
  deleteRecord() {

    let delitem = this.formConfirm.value.id;
    this.ownerfareService.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: Constants.SuccessType });
          this.confirmDialogReference.close();

          this.refresh();
        }
        else {

          this.notificationService.addToast({ title: Constants.ErrorTitle, msg: resp.message, type: Constants.ErrorType });
          this.spinner.hide();
        }
      });
  }
  deleteOwnerFare(content, delitem: any) {

    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.formConfirm = this.fb.group({
      id: [delitem]
    });

  }

  changeStatus(event: Event, stsitem: any) {
    this.spinner.show();
    this.ownerfareService.chngsts(stsitem).subscribe(
      resp => {

        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
        }
      }
    );
  }

  hoveredDate: NgbDateStruct;

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;

  _datesSelected:NgbDateStruct[]=[]; 

  @Input()
  set datesSelected(value:NgbDateStruct[])  
  {
     this._datesSelected=value;
     
  }
  get datesSelected():NgbDateStruct[]
  {
    
    return this._datesSelected?this._datesSelected:[];
  }

  @Output() datesSelectedChange=new EventEmitter<NgbDateStruct[]>();

 

  onDateSelection(event:any,date: NgbDateStruct) {

    event.target.parentElement.blur();  //make that not appear the outline
    if (!this.fromDate && !this.toDate) {
      if (event.ctrlKey==true)  //If is CrtlKey pressed
        this.fromDate = date;
      else
        this.addDate(date);

      this.datesSelectedChange.emit(this.datesSelected);

    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
      this.addRangeDate(this.fromDate,this.toDate);
      this.fromDate=null;
      this.toDate=null;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  addDate(date:NgbDateStruct)
  {
      let index=this.datesSelected.findIndex(f=>f.day==date.day && f.month==date.month && f.year==date.year);
      if (index>=0)       //If exist, remove the date
        this.datesSelected.splice(index,1);
      else   //a simple push
        this.datesSelected.push(date);
        // console.log(this.datesSelected);
        this.ownerFareForm.controls['date'].setValue(this.datesSelected);
    }
    addRangeDate(fromDate:NgbDateStruct,toDate:NgbDateStruct)
    {
        //We get the getTime() of the dates from and to
        let from=new Date(fromDate.year+"-"+fromDate.month+"-"+fromDate.day).getTime();
        let to=new Date(toDate.year+"-"+toDate.month+"-"+toDate.day).getTime();
        for (let time=from;time<=to;time+=(24*60*60*1000)) //add one day
        {
            let date=new Date(time);
            //javascript getMonth give 0 to January, 1, to February...
            this.addDate({year:date.getFullYear(),month:date.getMonth()+1,day:date.getDate()});
        }   
        this.datesSelectedChange.emit(this.datesSelected);
    }
    //return true if is selected
    isDateSelected(date:NgbDateStruct)
    {
        return (this.datesSelected.findIndex(f=>f.day==date.day && f.month==date.month && f.year==date.year)>=0);
    }
  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);


}
