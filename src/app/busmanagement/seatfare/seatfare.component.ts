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
import { NgxSpinnerService } from "ngx-spinner";
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
  groupedFare: any[] = [];
  @ViewChild("addnew") addnew;
  all: any;

  constructor(private spinner: NgxSpinnerService, private http: HttpClient, private busService: BusService, private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal, dpconfig: NgbDropdownConfig, private busSeatsService: BusSeatsService, private locationService: LocationService, private notificationService: NotificationService) {
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
          new_fare: [null],
          new_fare_status: [0]
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


  // sortFareBySeatNumber(data: any[]): any[] {

  //   const sortedSeats: any[] = [];

  //   data.forEach(journey => {

  //     journey.get_bus_seats?.forEach((singleSeats: any) => {

  //       // Ignore seats which don't have seat information
  //       if (!singleSeats.seats) {
  //         return;
  //       }

  //       // Calculate base fare
  //       const seatFare =
  //         singleSeats.seats.berthType == "1"
  //           ? journey.base_seat_fare
  //           : journey.base_sleeper_fare;

  //       sortedSeats.push({
  //         id: singleSeats.id,
  //         seat_number: singleSeats.seats.seatText,
  //         source_id: journey.source_id,
  //         destination_id: journey.destination_id,
  //         baseFare: seatFare,
  //         new_fare: singleSeats.backup_fare,
  //         new_fare_status: singleSeats.new_fare_status ?? 0
  //       });

  //     });

  //   });

  //   // Sort by seat number
  //   sortedSeats.sort((a, b) => {
  //     return Number(a.seat_number) - Number(b.seat_number);
  //   });

  //   return sortedSeats;
  // }




  // getSeats(id: any) {
  //   this.busRecord = this.buses[id];
  //   this.locationService.readAll().subscribe(
  //     records => {
  //       //CHANDRA TO BE CHANGED

  //       this.locations = records.data;
  //       let locs = {};
  //       for (let loc of this.locations) {
  //         var key = loc.id;
  //         locs[key] = loc.name;
  //       }
  //       this.locationArray = locs;
  //       // console.log(this.locationArray);
  //     }
  //   );
  //   this.fareRecord = (<FormArray>this.fareGroup.controls['fareArray']) as FormArray;
  //   this.fareRecord.clear();
  //   this.busSeatsService.readAll(this.busRecord.id).subscribe(records => {

  //     // console.log(records);
  //     // console.log(records);
  //     this.ticketPrice = records.result;
  //     let baseSeaterFare = "";
  //     let baseSleeperFare = "";
  //     let sourceId = "";
  //     let destinationId = "";
  //     for (let journey of this.ticketPrice) {

  //       baseSeaterFare = journey.base_seat_fare;
  //       baseSleeperFare = journey.base_sleeper_fare;
  //       sourceId = journey.source_id;
  //       destinationId = journey.destination_id;
  //       let seatFare = "";
  //       for (let singleSeats of journey.get_bus_seats) {
  //         if (singleSeats.seats != null) {
  //           seatFare = (singleSeats.seats.berthType == "1") ? baseSeaterFare : baseSleeperFare;

  //         }
  //         let totalLength = this.fareRecord.length;
  //         let seatRow: FormGroup = this.fb.group({
  //           id: [singleSeats.id],
  //           seat_number: [singleSeats.seats.seatText],
  //           source_id: [sourceId],
  //           destination_id: [destinationId],
  //           baseFare: [seatFare],
  //           new_fare: [singleSeats.backup_fare],
  //           new_fare_status: [singleSeats.new_fare_status ?? 0]
  //         })
  //         this.fareRecord.insert(totalLength, seatRow);
  //       }

  //     }

  //     //console.log(this.fareRecord);
  //   });
  // }

  sortFareBySeatNumber(data: any[]): any[] {

    const sortedSeats: any[] = [];

    data.forEach(journey => {

      journey.get_bus_seats?.forEach((singleSeats: any) => {

        // Ignore seats without seat information
        if (!singleSeats.seats) {
          return;
        }

        // Calculate base fare
        const seatFare =
          singleSeats.seats.berthType == "1"
            ? journey.base_seat_fare
            : journey.base_sleeper_fare;

        sortedSeats.push({
          id: singleSeats.id,
          seat_number: singleSeats.seats.seatText,
          source_id: journey.source_id,
          destination_id: journey.destination_id,
          baseFare: seatFare,
          new_fare: singleSeats.backup_fare,
          new_fare_status: singleSeats.new_fare_status ?? 0
        });

      });

    });

    // Group/sort all same seat numbers together
    sortedSeats.sort((a, b) => {

      const seatA = Number(a.seat_number);
      const seatB = Number(b.seat_number);

      // Numeric seat numbers
      if (!isNaN(seatA) && !isNaN(seatB)) {
        return seatA - seatB;
      }

      // If seat numbers contain text like D9, SL6, etc.
      return String(a.seat_number).localeCompare(
        String(b.seat_number),
        undefined,
        {
          numeric: true,
          sensitivity: 'base'
        }
      );
    });

    return sortedSeats;
  }

  getSeats(id: any) {

    this.busRecord = this.buses[id];

    this.locationService.readAll().subscribe(
      records => {

        this.locations = records.data;

        let locs = {};

        for (let loc of this.locations) {
          var key = loc.id;
          locs[key] = loc.name;
        }

        this.locationArray = locs;
      }
    );

    this.fareRecord = this.fareGroup.get('fareArray') as FormArray;

    this.fareRecord.clear();

    this.busSeatsService.readAll(this.busRecord.id).subscribe(records => {

      this.ticketPrice = records.result;

      // STEP 1:
      // Convert all journey seats into one array
      const sortedSeats = this.sortFareBySeatNumber(this.ticketPrice);

      // STEP 2:
      // Add sorted seats to FormArray
      sortedSeats.forEach((seat: any) => {

        const seatRow: FormGroup = this.fb.group({

          id: [seat.id],

          seat_number: [seat.seat_number],

          source_id: [seat.source_id],

          destination_id: [seat.destination_id],

          baseFare: [seat.baseFare],

          new_fare: [seat.new_fare],

          new_fare_status: [seat.new_fare_status]

        });

        this.fareRecord.push(seatRow);

      });

    });
  }
  updatePrice() {
    // console.log(this.fareGroup);
    this.spinner.show();
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
          this.spinner.hide();
        }
      }
    );
  }

  dropfg: any;
  ngOnInit(): void {
    this.spinner.show();
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
    this.spinner.show();
    const data = {
      name: this.searchForm.value.name,
      rows_number: this.searchForm.value.rows_number,
      USER_BUS_OPERATOR_ID: sessionStorage.getItem('BUS_OPERATOR_ID')
    };

    // console.log(data);
    if (pageurl != "") {
      this.busSeatsService.getAllaginationData(pageurl, data).subscribe(
        res => {
          this.buses = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
          // console.log( this.BusOperators);
        }
      );
    }
    else {
      this.busSeatsService.getAllData(data).subscribe(
        res => {
          this.buses = res.data.data.data;
          this.pagination = res.data.data;
          this.all = res.data;
          this.spinner.hide();
          console.log(res.data);
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
    this.spinner.hide();

  }


  title = 'angular-app';
  fileName = 'Seat-Fare.csv';

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


  toggleAllFareStatus(event: any): void {
    const checked = event.target.checked;

    this.fareFormGroup.controls.forEach((control: any) => {
      control.get('new_fare_status').setValue(checked);
    });
  }

  isAllChecked(): boolean {
    const controls = this.fareFormGroup.controls;

    return controls.length > 0 &&
      controls.every((control: any) =>
        control.get('new_fare_status').value === true
      );
  }


}
