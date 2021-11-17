import { Component, OnInit, ViewChild } from '@angular/core';
import { BusService } from '../../services/bus.service';
import { BusSeatsService } from '../../services/bus-seats.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Bus } from '../../model/bus';
import { Constants } from '../../constant/constant';
import { LocationService } from '../../services/location.service';
import { NotificationService } from '../../services/notification.service';
import * as XLSX from 'xlsx';
interface AllLocation {
  [index: number]: { name: any };
}

@Component({
  selector: 'app-seatfare',
  templateUrl: './seatfare.component.html',
  styleUrls: ['./seatfare.component.scss'],
  providers: [NgbModalConfig, NgbModal, NgbDropdownConfig]
})

export class SeatfareComponent implements OnInit {
  modalReference: NgbModalRef;

  @ViewChild("closebutton") closebutton;
  buses: Bus[];
  busRecord: Bus;


  public locationArray: {};
  public ticketPrice: any;
  public busSeats: any;
  public ModalHeading: any;
  public ModalBtn: any;
  locations: any;
  public fareGroup: FormGroup;

  public searchForm: FormGroup;
  pagination: any;

  public fareRecord: any;
  @ViewChild("addnew") addnew;

  constructor(private http: HttpClient, private busService: BusService, private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal, dpconfig: NgbDropdownConfig, private busSeatsService: BusSeatsService, private locationService: LocationService, private notificationService: NotificationService) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Bus";
    this.ModalBtn = "Save";

    dpconfig.placement = 'top-left';
    dpconfig.autoClose = false;

    this.fareGroup = this.fb.group({
      fareArray: this.fb.array([
        this.fb.group({
          id: [null],
          seat_number: [null],
          source_id: [null],
          destination_id: [null],
          // baseFare:[null],
          new_fare: [null]
        })
      ])
    });

  }
  get fareFormGroup() {
    return this.fareGroup.get('fareArray') as FormArray;
  }
  OpenModal(content) {

    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }

  


  getSeats(id: any) {
    this.busRecord = this.buses[id];
    this.locationService.readAll().subscribe(
      records => {
        //CHANDRA TO BE CHANGED
        this.locations = records.data;
        let locs = {};
        for (let loc of this.locations) {
          var key = loc.id;
          locs[key] = loc.name;
        }
        this.locationArray = locs;
        // console.log(this.locationArray);
      }
    );
    this.fareRecord = (<FormArray>this.fareGroup.controls['fareArray']) as FormArray;
    this.fareRecord.clear();
    this.busSeatsService.readAll(this.busRecord.id).subscribe(records => {

      // console.log(records);
      this.ticketPrice = records.result;
      let baseSeaterFare = "";
      let baseSleeperFare = "";
      let sourceId = "";
      let destinationId = "";
      for (let journey of this.ticketPrice) {

        baseSeaterFare = journey.base_seat_fare;
        baseSleeperFare = journey.base_sleeper_fare;
        sourceId = journey.source_id;
        destinationId = journey.destination_id;
        let seatFare = "";
        for (let singleSeats of journey.get_bus_seats) {
          seatFare = (singleSeats.seat_type == "1") ? baseSeaterFare : baseSleeperFare;
          let totalLength = this.fareRecord.length;
          let seatRow: FormGroup = this.fb.group({
            id: [singleSeats.id],
            seat_number: [singleSeats.seats.seatText],
            source_id: [sourceId],
            destination_id: [destinationId],
            baseFare: [seatFare],
            new_fare: [singleSeats.new_fare]
          })
          this.fareRecord.insert(totalLength, seatRow);
        }

      }

      //console.log(this.fareRecord);
    });
  }
  updatePrice() {
    // console.log(this.fareGroup);
    const data = {
      fare_info: this.fareGroup.value.fareArray
    };
    this.busService.updateNewFare(data).subscribe(
      resp => {
        if (resp.status == 1) {

          this.notificationService.addToast({ title: Constants.SuccessTitle, msg: resp.message, type: Constants.SuccessType });
          this.modalReference.close();
          this.refresh();
        }
        else {
          this.notificationService.addToast({ title: Constants.ErrorTitle, msg: resp.message, type: Constants.ErrorType });
        }
      }
    );
  }

  dropfg: any;
  ngOnInit(): void {
    this.fareGroup = this.fb.group({
      fareArray: this.fb.array([
        this.fb.group({
          new_fare: [null]
        })
      ])
    });
    // this.loadBus();

    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
    });

    this.search();

  }



  page(label: any) {
    return label;
  }


  search(pageurl = "") {
    const data = {
      name: this.searchForm.value.name,
      rows_number: this.searchForm.value.rows_number,
      USER_BUS_OPERATOR_ID:localStorage.getItem('USER_BUS_OPERATOR_ID')
    };

    // console.log(data);
    if (pageurl != "") {
      this.busSeatsService.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.buses = res.data.data.data;
          this.pagination = res.data.data;
          // console.log( this.BusOperators);
        }
      );
    }
    else {
      this.busSeatsService.getAllData(data).subscribe(
        res => {
          this.buses = res.data.data.data;
          this.pagination = res.data.data;
          // console.log( res.data);
        }
      );
    }
  }


  refresh() {
    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
    });
    this.search();

  }


  title = 'angular-app';
  fileName = 'Seat-Fare.xlsx';

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
