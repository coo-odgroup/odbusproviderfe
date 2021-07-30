import { BusOperatorService } from './../../services/bus-operator.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Seatopen } from '../../model/seatopen';
import { DataTablesResponse } from '../../model/datatable';
import { NotificationService } from '../../services/notification.service';
import { SeatopenService } from '../../services/seatopen.service';
import { BusService } from '../../services/bus.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../services/location.service';;
import { SeatlayoutService } from '../../services/seatlayout.service';


@Component({
  selector: 'app-seatopen',
  templateUrl: './seatopen.component.html',
  styleUrls: ['./seatopen.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class SeatopenComponent implements OnInit {

  @ViewChild("addnew") addnew;
  public seatOpenForm: FormGroup;
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
  seatOpen: Seatopen[];
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
  selectedSeats: any;
  busArray: FormArray;
  busesData: FormArray;
  lowerData: FormArray;
  upperData: FormArray;
  busopenform: any;
  dtOptionsSeatopen: { pagingType: string; pageLength: number; serverSide: boolean; processing: boolean; dom: string; order: string[]; aLengthMenu: (string | number)[]; buttons: ({ extend: string; className: string; init: (api: any, node: any, config: any) => void; exportOptions: { columns: string; }; text?: undefined; action?: undefined; } | { text: string; className: string; init: (api: any, node: any, config: any) => void; action: () => void; extend?: undefined; exportOptions?: undefined; })[]; language: { searchPlaceholder: string; processing: string; }; ajax: (dataTablesParameters: any, callback: any) => void; columns: ({ data: string; title?: undefined; render?: undefined; orderable?: undefined; className?: undefined; } | { title: string; data: string; render?: undefined; orderable?: undefined; className?: undefined; } | { data: string; render: (data: any) => "Active" | "Pending"; title?: undefined; orderable?: undefined; className?: undefined; } | { title: string; data: any; orderable: boolean; className: string; render?: undefined; })[]; };
  constructor(
    private seatopenService: SeatopenService,
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
    this.seatOpenForm = this.fb.group({
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
    this.loadSeatOpenData();
  }
  loadSeatOpenData() {

    this.dtOptionsSeatopen = {
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
            Constants.BASE_URL + '/getseatopenDT',
            dataTablesParameters, {}
          ).subscribe(resp => {

            this.seatOpen = resp.data.aaData;

            // console.log(this.seatOpen);
            // for (let items of this.seatOpen) {
            //   this.seatOpenRecord = items;
            //   this.seatOpenRecord.name = this.seatOpenRecord.name.split(",");
            // }
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: resp.data.aaData
            });
          });
      },
      columns: [{ data: 'id' }, { data: 'bus.name' }, { data: 'date_applied' }, { data: 'bus.bus_operator.operator_name' }, { data: 'seatOpen[0].seat_open_seats' }, { data: 'reason' }, {
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
      bus_id: this.seatOpenForm.value.bus_id
    };

   
    this.busService.getSelectedSeat(data.bus_id).subscribe(
      seatData => {
        this.selectedSeats = seatData.data;
      }
    );

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
                  checkedval = "true";
                  seatId = selectedSeat.id;
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
                  var isPresent = this.seatOpenRecord.seat_open_seats.some(function (el) { return el.seat_id === seatData.id });
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
                  checkedval = "true";
                  seatId = selectedSeat.id;
                  desiabled_seats = "true";
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
                  var isPresent = this.seatOpenRecord.seat_open_seats.some(function (el) { return el.seat_id === seatData.id });
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

      }
    );
  }

  ResetAttributes() {
    this.seatOpenRecord = {} as Seatopen;
    this.seatOpenForm = this.fb.group({
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

    this.ModalHeading = "Add Seat Open";
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
    let source_id = this.seatOpenForm.controls.source_id.value;
    let destination_id = this.seatOpenForm.controls.destination_id.value;


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

  addOpenseat() {

    const data = {
      bus_operator_id: this.seatOpenForm.value.bus_operator_id,
      bus_id: this.seatOpenForm.value.bus_id,
      reason: this.seatOpenForm.value.reason,
      date: this.seatOpenForm.value.date,
      bus_seat_layout_data: this.seatOpenForm.value.bus_seat_layout_data,
    };

    let id = this.seatOpenRecord.id;
    if(id !=null)
    {
      this.seatopenService.update(id,data).subscribe(
        resp=>{
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
    else{
      this.seatopenService.create(data).subscribe(
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
    this.seatopenService.chngsts(stsitem).subscribe(
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
    this.seatOpenRecord = this.seatOpen[id];
  }
  deleteRecord() {
    let delitem = this.seatOpenRecord.id;
    this.seatopenService.delete(delitem).subscribe(
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

  editsopen(index: any) {

    this.seatOpenRecord = this.seatOpen[index];
    this.loadServices();

    var d = new Date(this.seatOpenRecord.date_applied);
    let date = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');

    this.seatOpenForm = this.fb.group({
      bus_operator_id: [this.seatOpenRecord.bus.bus_operator_id],
      id: [this.seatOpenRecord.id],
      bus_id: [this.seatOpenRecord.bus_id],
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


}
