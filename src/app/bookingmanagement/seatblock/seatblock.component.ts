import { BusOperatorService } from './../../services/bus-operator.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Seatblock } from '../../model/seatblock';
import { DataTablesResponse } from '../../model/datatable';
import { NotificationService } from '../../services/notification.service';
import { SeatblockService } from '../../services/seatblock.service';
import { BusService } from '../../services/bus.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../services/location.service';;
import { SeatlayoutService } from '../../services/seatlayout.service';

@Component({
  selector: 'app-seatblock',
  templateUrl: './seatblock.component.html',
  styleUrls: ['./seatblock.component.scss']
})
export class SeatblockComponent implements OnInit {

  @ViewChild("addnew") addnew;
  public seatBlockForm: FormGroup;
  public formConfirm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  position = 'bottom-right';
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionsOwnerFare: any = {};
  dtOwnerFareOptions: any = {};
  dtOwnerFareOptionsData: any = {};
  seatBlock: Seatblock[];
  seatBlockRecord: Seatblock;

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
  selectedSeats: any;
  busArray: FormArray;
  busesData: FormArray;
  lowerData: FormArray;
  upperData: FormArray;
  busopenform: any;
  dtOptionsSeatblock: { pagingType: string; pageLength: number; serverSide: boolean; processing: boolean; dom: string; order: string[]; aLengthMenu: (string | number)[]; buttons: ({ extend: string; className: string; init: (api: any, node: any, config: any) => void; exportOptions: { columns: string; }; text?: undefined; action?: undefined; } | { text: string; className: string; init: (api: any, node: any, config: any) => void; action: () => void; extend?: undefined; exportOptions?: undefined; })[]; language: { searchPlaceholder: string; processing: string; }; ajax: (dataTablesParameters: any, callback: any) => void; columns: ({ data: string; title?: undefined; render?: undefined; orderable?: undefined; className?: undefined; } | { title: string; data: string; render?: undefined; orderable?: undefined; className?: undefined; } | { data: string; render: (data: any) => "Active" | "Pending"; title?: undefined; orderable?: undefined; className?: undefined; } | { title: string; data: any; orderable: boolean; className: string; render?: undefined; })[]; };
  constructor(
    private seatblockService: SeatblockService,
    private seatlayoutService: SeatlayoutService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private busService: BusService,
    private busOperatorService: BusOperatorService,
    private locationService: LocationService
  ) {
    this.isSubmit = false;
    this.seatBlockRecord = {} as Seatblock;
    //this.busstoppageRecord= {} as Busstoppage;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Seat Block";
    this.ModalBtn = "Save";
  }

  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    this.seatBlockForm = this.fb.group({
      bus_operator_id: [null],
      id: [null],
      bus_id: [null],
      date: [null],
      reason: [null],
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
    this.loadSeatBlockData();
  }
  loadSeatBlockData() {

    this.dtOptionsSeatblock = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: 'lBfrtip',
      order: ["0", "desc"],
      aLengthMenu: [10, 25, 50, 100, "All"],
      buttons: [
        {
          extend: 'copy', className: 'btn btn-sm btn-primary', init: function (api, node, config) {
            $(node).removeClass('dt-button')
          },
          exportOptions: {
            columns: "thead th:not(.noExport)"
          }
        },
        {
          extend: 'print', className: 'btn btn-sm btn-danger', init: function (api, node, config) {
            $(node).removeClass('dt-button')
          },
          exportOptions: {
            columns: "thead th:not(.noExport)"
          }
        },
        {
          extend: 'excel', className: 'btn btn-sm btn-info', init: function (api, node, config) {
            $(node).removeClass('dt-button')
          },
          exportOptions: {
            columns: "thead th:not(.noExport)"
          }
        },
        {
          extend: 'csv', className: 'btn btn-sm btn-success', init: function (api, node, config) {
            $(node).removeClass('dt-button')
          },
          exportOptions: {
            columns: "thead th:not(.noExport)"
          }
        },
        {
          text: "Add",
          className: 'btn btn-sm btn-warning', init: function (api, node, config) {
            $(node).removeClass('dt-button')
          },
          action: () => {
            this.addnew.nativeElement.click();
          }
        }
      ],
      language: {
        searchPlaceholder: "Search Open seats",
        processing: "<img src='assets/images/loading.gif' width='30'>"
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            Constants.BASE_URL + '/getseatblockDT',
            dataTablesParameters, {}
          ).subscribe(resp => {

            this.seatBlock = resp.data.aaData;

            // console.log(this.seatBlock);
            // for (let items of this.seatBlock) {
            //   this.seatBlockRecord = items;
            //   this.seatBlockRecord.name = this.seatBlockRecord.name.split(",");
            // }
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: resp.data.aaData
            });
          });
      },
      columns: [{ data: 'id' }, { data: 'bus.name' }, { data: 'date_applied' }, { data: 'bus.bus_operator.operator_name' }, { data: 'seatBlock[0].seat_block_seats' }, { data: 'reason' }, {
        data: 'status',
        render: function (data) {
          return (data == "1") ? "Active" : "Pending"
        }

      }, { title: 'Action', data: null, orderable: false, className: "noExport" }]
    };

    this.busService.readAll().subscribe(
      res => {
        this.buses = res.data;
      }
    );
  }

  // print(i) {
  //   console.log(i);
  // }

  checkEvent(event: any) {
    const data = {
      bus_id: this.seatBlockForm.value.bus_id
    };


    this.busService.getSelectedSeat(data.bus_id).subscribe(
      seatData => {
        this.selectedSeats = seatData.data;
        //console.log(this.selectedSeats);
        this.seatlayoutService.seatsBus(data).subscribe(
      resp => {
        // console.log(resp);
        let counter = 0;
        this.seatLayoutData = (<FormArray>this.seatBlockForm.controls['bus_seat_layout_data']) as FormArray;
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
            this.seatLayoutCol = (<FormArray>this.seatBlockForm.controls['bus_seat_layout_data']).at(counter).get('lowerBerth') as FormArray;
            for (let seatData of lowerData) {
              let checkedval = "";
              let seatId = "";
              let desiabled_seats = "";
              for (let selectedSeat of this.selectedSeats) {
                if (selectedSeat.seats_id == seatData.id) {
                  checkedval = "true";
                  seatId = selectedSeat.id;
                  desiabled_seats = "true";
                }
              }
              let collen = this.seatLayoutCol.length;

              if (checkedval == "true") {
                //console.log(this.seatBlockRecord.seat_block_seats);
                if (!this.seatBlockRecord.seat_block_seats) {
                  let columnData: FormGroup = this.fb.group({
                    seatText: [seatData.seatText],
                    seatType: [seatData.seat_class_id],
                    berthType: [seatData.berthType],
                    seatChecked: [],
                    category: ['0'],
                    seatId: [seatData.id],
                    busId: [data.bus_id]
                  });
                  this.seatLayoutCol.insert(collen, columnData);
                }
                else {
                  var isPresent = this.seatBlockRecord.seat_block_seats.some(function (el) { 
                    
                    return JSON.parse(el.seat_id) === JSON.parse(seatData.id); 
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
                      seatChecked: [],
                      category: ['0'],
                      seatId: [seatData.id],
                      busId: [data.bus_id]
                    });
                    this.seatLayoutCol.insert(collen, columnData);
                  }
                }
              }
              else {
                // console.log(this.seatBlockRecord.seat_block_seats);            

                let columnData: FormGroup = this.fb.group({
                  seatText: [seatData.seatText],
                  seatType: [seatData.seat_class_id],
                  berthType: [seatData.berthType],
                  seatChecked: [{ value: false, disabled: true }],
                  category: ['0'],
                  seatId: [seatData.id],
                  busId: [data.bus_id]
                });
                this.seatLayoutCol.insert(collen, columnData);
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
            this.seatLayoutCol = (<FormArray>this.seatBlockForm.controls['bus_seat_layout_data']).at(counter).get('upperBerth') as FormArray;
            for (let seatData of upperData) {
              let checkedval = "";
              let seatId = "";
              let desiabled_seats = "";
              for (let selectedSeat of this.selectedSeats) {
                if (selectedSeat.seats_id == seatData.id) {
                  checkedval = "true";
                  seatId = selectedSeat.id;
                  // desiabled_seats = "true";
                }
              }
              let collen = this.seatLayoutCol.length;

              if (checkedval == "true") {
                if (!this.seatBlockRecord.seat_block_seats) {
                  let columnData: FormGroup = this.fb.group({
                    seatText: [seatData.seatText],
                    seatType: [seatData.seat_class_id],
                    berthType: [seatData.berthType],
                    seatChecked: [],
                    category: ['0'],
                    seatId: [seatData.id],
                    busId: [data.bus_id]
                  });
                  this.seatLayoutCol.insert(collen, columnData);
                }
                else {
                  
                  var isPresent = this.seatBlockRecord.seat_block_seats.some(function (el) { 
                    return JSON.parse(el.seat_id) === JSON.parse(seatData.id); 
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
                      seatChecked: [],
                      category: ['0'],
                      seatId: [seatData.id],
                      busId: [data.bus_id]
                    });
                    this.seatLayoutCol.insert(collen, columnData);
                  }
                }


              }
              else {
                // console.log(this.seatBlockRecord.seat_block_seats);            

                let columnData: FormGroup = this.fb.group({
                  seatText: [seatData.seatText],
                  seatType: [seatData.seat_class_id],
                  berthType: [seatData.berthType],
                  seatChecked: [{ value: false, disabled: true }],
                  category: ['0'],
                  seatId: [seatData.id],
                  busId: [data.bus_id]
                });
                this.seatLayoutCol.insert(collen, columnData);
              }
            }
            counter++;
          }
        }

      }
    );
      }
    );

    
  }

  ResetAttributes() {
    this.seatBlockRecord = {} as Seatblock;
    this.seatBlockForm = this.fb.group({
      bus_operator_id: [null],
      id: [null],
      bus_id: [null],
      date: [null],
      reason: [null],

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

    this.ModalHeading = "Add Seat Block";
    this.ModalBtn = "Save";
  }

  loadServices() {
    this.busService.all().subscribe(
      res => {
        this.buses = res.data;
      }
    );
    this.busOperatorService.readAll().subscribe(
      res => {
        this.busoperators = res.data;
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
        }
      );
    }

  }
  findSource() {
    let source_id = this.seatBlockForm.controls.source_id.value;
    let destination_id = this.seatBlockForm.controls.destination_id.value;


    if (source_id != "" && destination_id != "") {
      this.busService.findSource(source_id, destination_id).subscribe(
        res => {
          this.buses = res.data;
        }
      );
    }
    else {
      this.busService.all().subscribe(
        res => {
          this.buses = res.data;
        }
      );
    }
  }

  addBlockseat() {

    const data = {
      bus_operator_id: this.seatBlockForm.value.bus_operator_id,
      bus_id: this.seatBlockForm.value.bus_id,
      reason: this.seatBlockForm.value.reason,
      date: this.seatBlockForm.value.date,
      bus_seat_layout_data: this.seatBlockForm.value.bus_seat_layout_data,
    };
    let id = this.seatBlockRecord.id;
    if (id != null) {
      this.seatblockService.update(id, data).subscribe(
        resp => {
          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.rerender();
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          }
        }
      );
    }
    else {
      this.seatblockService.create(data).subscribe(
        resp => {

          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.rerender();
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          }
        }
      );

    }

  }

  changeStatus(event: Event, stsitem: any) {
    this.seatblockService.chngsts(stsitem).subscribe(
      resp => {

        if (resp.status == 1) {
          this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.rerender();
        }
        else {
          this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  openConfirmDialog(content, id: any) {
    this.confirmDialogReference = this.modalService.open(content, { scrollable: true, size: 'md' });
    this.seatBlockRecord = this.seatBlock[id];
  }
  deleteRecord() {
    let delitem = this.seatBlockRecord.id;
    this.seatblockService.delete(delitem).subscribe(
      resp => {
        if (resp.status == 1) {
          this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: Constants.SuccessType });
          this.confirmDialogReference.close();

          this.rerender();
        }
        else {

          this.notificationService.addToast({ title: Constants.ErrorTitle, msg: resp.message, type: Constants.ErrorType });
        }
      });
  }
 


  editsblock(index: any) {

    this.seatBlockRecord = this.seatBlock[index];

    // console.log(this.seatBlockRecord);
    this.loadServices();

    var d = new Date(this.seatBlockRecord.date_applied);
    let date = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');

    this.seatBlockForm = this.fb.group({
      bus_operator_id: [JSON.parse(this.seatBlockRecord.bus.bus_operator_id)],
      id: [JSON.parse(this.seatBlockRecord.id)],
      bus_id: [JSON.parse(this.seatBlockRecord.bus_id)],
      date: date,
      reason: [this.seatBlockRecord.reason],

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
    this.ModalHeading = "Edit Seat Block";
    this.ModalBtn = "Update";
    this.checkEvent(this.seatBlockRecord.bus_id);
  }



}
