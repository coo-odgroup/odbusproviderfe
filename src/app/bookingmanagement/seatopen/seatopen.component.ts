import { BusOperatorService } from './../../services/bus-operator.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Seatopen } from '../../model/seatopen';
import { NotificationService } from '../../services/notification.service';
import { SeatopenService } from '../../services/seatopen.service';
import { BusscheduleService } from '../../services/busschedule.service';
import { BusService } from '../../services/bus.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../services/location.service';
import { SeatlayoutService } from '../../services/seatlayout.service';
import * as XLSX from 'xlsx';
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
  selector: 'app-seatopen',
  templateUrl: './seatopen.component.html',
  styleUrls: ['./seatopen.component.scss'],
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
export class SeatopenComponent implements OnInit {

  @ViewChild("addnew") addnew;
  public seatOpenForm: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  seatOpen: any=[];
  seatOpenRecord: Seatopen;



  buses: any;
  busoperators: any;
  locations: any;
  public isSubmit: boolean;
  public mesgdata: any;
  public ModalHeading: any;
  public ModalBtn: any;
  public searchBy: any;
  seatLayouts: any;
  busRecord: any;
  seatLayoutData: any;
  busForm: any;
  seatLayoutCol: any;
  upperberthcol: any; 
  lowerberthcol: any;
  selectedSeats: any=[];
  busArray: FormArray;
  busesData: FormArray;
  lowerData: FormArray;
  upperData: FormArray;
  busopenform: any;
  dtOptionsSeatopen: { pagingType: string; pageLength: number; serverSide: boolean; processing: boolean; dom: string; order: string[]; aLengthMenu: (string | number)[]; buttons: ({ extend: string; className: string; init: (api: any, node: any, config: any) => void; exportOptions: { columns: string; }; text?: undefined; action?: undefined; } | { text: string; className: string; init: (api: any, node: any, config: any) => void; action: () => void; extend?: undefined; exportOptions?: undefined; })[]; language: { searchPlaceholder: string; processing: string; }; ajax: (dataTablesParameters: any, callback: any) => void; columns: ({ data: string; title?: undefined; render?: undefined; orderable?: undefined; className?: undefined; } | { title: string; data: string; render?: undefined; orderable?: undefined; className?: undefined; } | { data: string; render: (data: any) => "Active" | "Pending"; title?: undefined; orderable?: undefined; className?: undefined; } | { title: string; data: any; orderable: boolean; className: string; render?: undefined; })[]; };
  pagination: any;
  all: any;
  route: any;
  deletedata: any;
  page_no=1;
  busSchedule: any;
  seatOpenDetails: any;
  constructor(
    calendar: NgbCalendar,
    private seatopenService: SeatopenService,
    private seatlayoutService: SeatlayoutService,
    private bss: BusscheduleService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private busService: BusService,
    private busOperatorService: BusOperatorService,
    private locationService: LocationService, private spinner: NgxSpinnerService,
  ) {
    this.isSubmit = false;
    this.seatOpenRecord = {} as Seatopen;
    //this.busstoppageRecord= {} as Busstoppage;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Seat Open";
    this.ModalBtn = "Save";
  }

  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    this.spinner.show();
    this.seatOpenForm = this.fb.group({
      bus_operator_id: [null],
      id: [null],
      bus_id: [null],
      busRoute: [null],
      date: [null],
      reason: [null],
      otherReson: [null],
      bus_seat_layout_id: [null],
      bus_seat_layout_data: this.fb.array([
        this.fb.group({
          upperBerth: this.fb.array([
          ]),//Upper Berth Items Will be Added Here
          lowerBerth: this.fb.array([
          ])//Lower Berth Items will be added Here
        })
      ]),
    });
    this.formConfirm = this.fb.group({
      id: [null]
    });


    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
      page_no:this.page_no,
      fromDate:[null],
      toDate:[null],
      source_id:[null],
      destination_id:[null],
      bus_operator_id:[null],
    });

    this.search();
    this.loadServices();

  }

  page(label: any) {
    return label;
  }
  set_page(url:any)
  {  
    this.page_no = url.replace('/api/seatopenData?&page=','');
    this.search();
  
  }


  search(pageurl = "") {
    this.spinner.show();
    this.seatOpen = [];
    const data = {
      name: this.searchForm.value.name,
      rows_number: this.searchForm.value.rows_number,
      page_no:this.page_no,
      bus_operator_id:this.searchForm.value.bus_operator_id,
      fromDate:this.searchForm.value.fromDate,
      toDate:this.searchForm.value.toDate,
      source_id:this.searchForm.value.source_id,
      destination_id:this.searchForm.value.destination_id,
      USER_BUS_OPERATOR_ID: localStorage.getItem('USER_BUS_OPERATOR_ID')
    };

    // console.log(data);
    if (pageurl != "") {
      this.seatopenService.getAllaginationData(pageurl, data).subscribe(
        res => {
          let mainArray = res.data.data;
          this.pagination = res.data;
          this.all = res.data;
          this.spinner.hide();
          // console.log( this.BusOperators);
          
          mainArray = Object.keys(mainArray).map(k1 => ({ value: mainArray[k1] }));
          // console.log(mainArray);
          if(mainArray.length >0)
          {
            for (var bus of mainArray) {
              bus = Object.keys(bus.value).map(k2 => ({ value: bus.value[k2] })); 
             //  console.log(bus);               
              
              let allbus=[];
             for (var date of bus) {
               date = Object.keys(date.value).map(k3 => ({ value: date.value[k3] }));
               let allDate=[];
               // console.log(date);               
 
               for (var route of date) {
                 route = Object.keys(route.value).map(k4 => ({ value: route.value[k4] }));              
                 let allroute = [];
                //  console.log(route);               
 
                 for (var seat of route) {
                   seat = Object.keys(seat.value).map(k5 => ({ value: seat.value[k5] }));  
                   allroute.push(seat);
                   // console.log(seat);               
                 }
                 allDate.push(route);
               }
               allbus.push(date);
              //  console.log(allbus);
             }
             this.seatOpen.push(allbus);
           }
          }
        }
      );
    }
    else {
      this.seatopenService.getAllData(data).subscribe(
        res => {
          let mainArray = res.data.data;
          this.pagination = res.data;
          this.all = res.data;
          this.spinner.hide();
          console.log(mainArray);


          mainArray = Object.keys(mainArray).map(k1 => ({ value: mainArray[k1] }));
          // console.log(mainArray);
          if(mainArray.length >0)
          {
            for (var bus of mainArray) {
              bus = Object.keys(bus.value).map(k2 => ({ value: bus.value[k2] })); 
             //  console.log(bus);               
              
              let allbus=[];
             for (var date of bus) {
               date = Object.keys(date.value).map(k3 => ({ value: date.value[k3] }));
               let allDate=[];
               // console.log(date);               
 
               for (var route of date) {
                 route = Object.keys(route.value).map(k4 => ({ value: route.value[k4] }));              
                 let allroute = [];
                //  console.log(route);               
 
                 for (var seat of route) {
                   seat = Object.keys(seat.value).map(k5 => ({ value: seat.value[k5] }));  
                   allroute.push(seat);
                   // console.log(seat);               
                 }
                 allDate.push(route);
               }
               allbus.push(date);
              //  console.log(allbus);
             }
             this.seatOpen.push(allbus);
            
           }
          //  console.log(this.seatOpen);
          }  
        }
      );
    }
  }


  refresh() {
    this.spinner.show();
    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
      page_no:this.page_no,
      fromDate:[null],
      toDate:[null],
      source_id:[null],
      destination_id:[null],
      bus_operator_id:[null],
    });
    this.search();
    


  }


  viewDetails(id)
  {
   // console.log(id);
   this.seatOpenDetails= this.seatOpen[id] ;
  }


  title = 'angular-app';
  fileName = 'Seat-Open.xlsx';

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

  checkEvent(event: any) {
    this.spinner.show();
    const data = {
      bus_id: this.seatOpenForm.value.bus_id
    };
    console.log(data);

    this.busService.getSelectedSeat(data.bus_id).subscribe(
      seatData => {
        console.log('get seat layout');
        this.selectedSeats = seatData.data['seat'];
        console.log(this.selectedSeats);
        this.seatlayoutService.seatsBus(data).subscribe(
          resp => {            
            let counter = 0;
            this.seatLayoutData = (<FormArray>this.seatOpenForm.controls['bus_seat_layout_data']) as FormArray;
            this.seatLayoutData.clear();
            if (resp.data.lowerBerth != undefined) {
              for (let lowerData of resp.data.lowerBerth) {
    
                let arraylen = this.seatLayoutData.length;
                let berthData: FormGroup = this.fb.group({
                  lowerBerth: this.fb.array([
                  ]),
                  upperBerth: this.fb.array([
                  ])
                });
                this.seatLayoutData.insert(arraylen, berthData); //PUSH BLANK LOWER BETH ARRAY TO seatLayoutData
                this.seatLayoutCol = (<FormArray>this.seatOpenForm.controls['bus_seat_layout_data']).at(counter).get('lowerBerth') as FormArray;
                for (let seatData of lowerData) {
                  let checkedval = "";
                  let seatId = "";
                  for (let selectedSeat of this.selectedSeats) {
                    if (selectedSeat.seats_id == seatData.id) {
                      if(selectedSeat.type== null){
                        checkedval = "true";
                        seatId = selectedSeat.id;
                      }                 
                    }
                  }
    
                  let collen = this.seatLayoutCol.length;
    
                  if (checkedval == "true") {
                    let columnData: FormGroup = this.fb.group({
                      seatText: [seatData.seatText],
                      seatType: [seatData.seat_class_id],
                      berthType: [seatData.berthType],
                      seatChecked: [{ value: true, disabled: true }],
                      category: ['0'],
                      seatId: [seatData.id],
                      busId: [data.bus_id]
                    });
                    this.seatLayoutCol.insert(collen, columnData);
                  }
                  else {
                    if (!this.seatOpenRecord.seat_open_seats) {
                      let columnData: FormGroup = this.fb.group({
                        seatText: [seatData.seatText],
                        seatType: [seatData.seat_class_id],
                        berthType: [seatData.berthType],
                        seatChecked: [false],
                        category: ['0'],
                        seatId: [seatData.id],
                        busId: [data.bus_id]
                      });
                      this.seatLayoutCol.insert(collen, columnData);
                    }
                    else {
                      var isPresent = this.seatOpenRecord.seat_open_seats.some(function (el) {
                        return JSON.parse(el.seats_id) === JSON.parse(seatData.id);
                      });
                      if (isPresent) {
                        let columnData: FormGroup = this.fb.group({
                          seatText: [seatData.seatText],
                          seatType: [seatData.seat_class_id],
                          berthType: [seatData.berthType],
                          seatChecked: [true],
                          category: ['0'],
                          seatId: [seatData.id],
                          busId: [data.bus_id]
                        });
                        this.seatLayoutCol.insert(collen, columnData);
    
                      } else {
                        let columnData: FormGroup = this.fb.group({
                          seatText: [seatData.seatText],
                          seatType: [seatData.seat_class_id],
                          berthType: [seatData.berthType],
                          seatChecked: [false],
                          category: ['0'],
                          seatId: [seatData.id],
                          busId: [data.bus_id]
                        });
                        this.seatLayoutCol.insert(collen, columnData);
    
                      }
                    }
                  }
                }
                counter++;
              }
            }
            if (resp.data.upperBerth != undefined) {
              for (let upperData of resp.data.upperBerth) {
                let arraylen = this.seatLayoutData.length;
                let berthData: FormGroup = this.fb.group({
                  lowerBerth: this.fb.array([
                  ]),
                  upperBerth: this.fb.array([
                  ])
                });
                this.seatLayoutData.insert(arraylen, berthData); //PUSH BLANK LOWER BETH ARRAY TO seatLayoutData
                this.seatLayoutCol = (<FormArray>this.seatOpenForm.controls['bus_seat_layout_data']).at(counter).get('upperBerth') as FormArray;
                for (let seatData of upperData) {
                  let checkedval = "";
                  let seatId = "";
                  let desiabled_seats = "";
                  for (let selectedSeat of this.selectedSeats) {
                    if (selectedSeat.seats_id == seatData.id) {
                      if(selectedSeat.type== null){                  
                        checkedval = "true";
                        seatId = selectedSeat.id;
                        // desiabled_seats = "true";
                      }                
                    }
                  }
                  let collen = this.seatLayoutCol.length;
    
                  if (checkedval == "true") {
    
                    let columnData: FormGroup = this.fb.group({
                      seatText: [seatData.seatText],
                      seatType: [seatData.seat_class_id],
                      berthType: [seatData.berthType],
                      seatChecked: [{ value: true, disabled: true }],
                      category: ['0'],
                      seatId: [seatData.id],
                      busId: [data.bus_id]
                    });
                    this.seatLayoutCol.insert(collen, columnData);
                  }
                  else {
                    if (!this.seatOpenRecord.seat_open_seats) {
                      let columnData: FormGroup = this.fb.group({
                        seatText: [seatData.seatText],
                        seatType: [seatData.seat_class_id],
                        berthType: [seatData.berthType],
                        seatChecked: [false],
                        category: ['0'],
                        seatId: [seatData.id],
                        busId: [data.bus_id]
                      });
                      this.seatLayoutCol.insert(collen, columnData);
                    }
                    else {
                      var isPresent = this.seatOpenRecord.seat_open_seats.some(function (el) {
                        return JSON.parse(el.seats_id) === JSON.parse(seatData.id);
                      });
                      if (isPresent) {
                        let columnData: FormGroup = this.fb.group({
                          seatText: [seatData.seatText],
                          seatType: [seatData.seat_class_id],
                          berthType: [seatData.berthType],
                          seatChecked: [true],
                          category: ['0'],
                          seatId: [seatData.id],
                          busId: [data.bus_id]
                        });
                        this.seatLayoutCol.insert(collen, columnData);
    
                      } else {
                        let columnData: FormGroup = this.fb.group({
                          seatText: [seatData.seatText],
                          seatType: [seatData.seat_class_id],
                          berthType: [seatData.berthType],
                          seatChecked: [false],
                          category: ['0'],
                          seatId: [seatData.id],
                          busId: [data.bus_id]
                        });
                        this.seatLayoutCol.insert(collen, columnData);
    
                      }
                    }
    
                  }
                }
                counter++;
              }
            }
            this.spinner.hide();
          }
        );
      }
    );

    
  }

  checkroute(event: any) {
    this.seatOpenForm.controls.busRoute.setValue('');

    const data = {
      bus_id: this.seatOpenForm.value.bus_id
    };

    this.busService.fetchBusRoutesById(data.bus_id).subscribe(
      resp => {
        this.route = resp.data;
        this.route.map((i: any) => { i.routes = i.source[0].name + '>>' + i.destination[0].name; return i; });

      }
    );
    // console.log(data);
  }

  getSchedule()
  {
    const data = {
      bus_id: this.seatOpenForm.value.bus_id
    };
    this.bss.getScheduleById(data.bus_id).subscribe(
      seatData => {
        this.busSchedule = seatData ;
      }
    );
  }
  
  onSelectAll() {
    const selected = this.route.map(item => item.id);
    this.seatOpenForm.get('busRoute').patchValue(selected);
  }
  onClearAll() {
    this.seatOpenForm.get('busRoute').patchValue([]);
  }

  ResetAttributes() {
    this.datesSelected=[];
    this.route = [];
    this.buses ="";
    this.loadServices();
    this.busSchedule =[] ;
    this.route = "";
    this.seatOpenRecord = {} as Seatopen;
    this.seatOpenForm = this.fb.group({
      bus_operator_id: [null],
      id: [null],
      bus_id: [null],
      busRoute: [null],
      date: [null],
      reason: [null],
      otherReson: [null],
      bus_seat_layout_data: this.fb.array([
        this.fb.group({
          upperBerth: this.fb.array([
          ]),//Upper Berth Items Will be Added Here
          lowerBerth: this.fb.array([
          ])//Lower Berth Items will be added Here
        })
      ]),
      busses: this.fb.array([

      ])
    });

    this.ModalHeading = "Add Seat Open";
    this.ModalBtn = "Save";
  }

  loadServices() {
    // this.busService.all().subscribe(
    //   res => {
    //     this.buses = res.data;
    //     this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });
    //   }
    // );
    const BusOperator = {
      USER_BUS_OPERATOR_ID: localStorage.getItem("USER_BUS_OPERATOR_ID")
    };
    if (BusOperator.USER_BUS_OPERATOR_ID == "") {
      this.busOperatorService.readAll().subscribe(
        record => {
          this.busoperators = record.data;
          this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name + '  )'; return i; });

        }
      );
    }
    else {
      this.busOperatorService.readOne(BusOperator.USER_BUS_OPERATOR_ID).subscribe(
        record => {
          this.busoperators = record.data;
          this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name + '  )'; return i; });

        }
      );
    }
    this.locationService.readAll().subscribe(
      records => {
        this.locations = records.data;
      }
    );
  }

  findOperator(event: any) {
    this.spinner.show();
    this.seatOpenForm.controls.bus_id.setValue('');
    this.seatOpenForm.controls.busRoute.setValue('');
    let operatorId = event.id;
    if (operatorId) {
      this.busService.getByOperaor(operatorId).subscribe(
        res => {
          this.buses = res.data;
          this.buses.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });
          this.spinner.hide();
        }
      );
    }

  }
  findSource() {
    let source_id = this.seatOpenForm.controls.source_id.value;
    let destination_id = this.seatOpenForm.controls.destination_id.value;


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

  addOpenseat() {
    this.spinner.show();

    if(this.seatOpenForm.value.date == null)
    {
      this.notificationService.addToast({ title: 'Error', msg: 'Please Select Date', type: 'error' });
      this.spinner.hide();
      return;
    }else{
    const data = {
      bus_operator_id: this.seatOpenForm.value.bus_operator_id,
      bus_id: this.seatOpenForm.value.bus_id,
      busRoute: this.seatOpenForm.value.busRoute,
      reason: this.seatOpenForm.value.reason,
      other_reson: this.seatOpenForm.value.otherReson,
      date: this.seatOpenForm.value.date,
      bus_seat_layout_data: this.seatOpenForm.value.bus_seat_layout_data,
      created_by: localStorage.getItem('USERNAME'),
      type: "1"

    };
    // console.log(data);
    // return;
    let id = this.seatOpenRecord.id;
    if (id != null) {
      this.seatopenService.update(id, data).subscribe(
        resp => {
          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.refresh();
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
            this.spinner.hide();
          }
        }
      );
    }
    else {
      this.seatopenService.create(data).subscribe(
        resp => {

          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.refresh();
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
            this.spinner.hide();
          }
        }
      );

    }
   }

  }

  changeStatus(event: Event, stsitem: any) {
    this.spinner.show();
    this.seatopenService.chngsts(stsitem).subscribe(
      resp => {

        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      }
    );
  }

  openConfirmDialog(content, id: any, tkt_id: any, date: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    // this.seatOpenRecord = this.seatOpen[id];

    this.deletedata = {
      bus_id: id,
      ticketPriceId: tkt_id,
      operationDate: date,
      type: "1"
    };
    // console.log(this.deletedata);
    return

  }

  deleteRecord() {

    let delitem = this.deletedata;
    // console.log(delitem);
    // return;
    this.seatopenService.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: Constants.SuccessType });
          this.confirmDialogReference.close();
          this.modalReference.close();
          this.refresh();
        }
        else {

          this.notificationService.addToast({ title: Constants.ErrorTitle, msg: resp.message, type: Constants.ErrorType });
        }
      });
  }

  editsopen(index: any) {

    this.seatOpenRecord = this.seatOpen[index];
    this.loadServices();

    var d = new Date(this.seatOpenRecord.date_applied);
    let date = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');

    this.seatOpenForm = this.fb.group({
      bus_operator_id: [JSON.parse(this.seatOpenRecord.bus.bus_operator_id)],
      id: [this.seatOpenRecord.id],
      bus_id: [JSON.parse(this.seatOpenRecord.bus_id)],
      busRoute: [JSON.parse(this.seatOpenRecord.busRoute)],
      date: date,
      reason: [this.seatOpenRecord.reason],

      bus_seat_layout_id: [null],
      bus_seat_layout_data: this.fb.array([
        this.fb.group({
          upperBerth: this.fb.array([
          ]),//Upper Berth Items Will be Added Here
          lowerBerth: this.fb.array([
          ])//Lower Berth Items will be added Here
        })
      ]),
    });
    this.ModalHeading = "Edit Seat Open";
    this.ModalBtn = "Update";
    this.checkEvent(this.seatOpenRecord.bus_id);
  }

  
  // datesSelected:NgbDateStruct[]=[]; 
  // change(value:NgbDateStruct[])
  // {
  //   this.datesSelected=value;
  //   this.seatOpenForm.controls['date'].setValue(value);
  // }

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
        this.seatOpenForm.controls['date'].setValue(this.datesSelected);
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
