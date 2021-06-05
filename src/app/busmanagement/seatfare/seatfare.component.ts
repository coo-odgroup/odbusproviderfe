import { Component, OnInit,ViewChild } from '@angular/core';
import { BusService } from '../../services/bus.service';
import {BusSeatsService} from '../../services/bus-seats.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesResponse} from '../../model/datatable';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Bus } from '../../model/bus';
import {Constants} from '../../constant/constant';
import { LocationService } from '../../services/location.service';
import { NotificationService } from '../../services/notification.service';
interface AllLocation{
  [index: number]: { name: any};
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
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  position = 'bottom-right';
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionsBus: any = {};
  dtSeatTypesOptions: any = {};
  dtSeatTypesOptionsData: any = {};
  buses: Bus[];
  busRecord: Bus;


  public locationArray:{};
  public ticketPrice:any;
  public busSeats:any;
  public ModalHeading:any;
  public ModalBtn:any;
  locations: any;
  public fareGroup: FormGroup;

  public fareRecord:any;
  @ViewChild("addnew") addnew;

  constructor(private http: HttpClient, private busService:BusService,  private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal,dpconfig: NgbDropdownConfig, private busSeatsService:BusSeatsService, private locationService:LocationService, private notificationService: NotificationService) { 
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Bus";
    this.ModalBtn = "Save";

    dpconfig.placement = 'top-left';
    dpconfig.autoClose = false;

    this.fareGroup = this.fb.group({
      fareArray:this.fb.array([
        this.fb.group({
          id:[null],
          seat_number:[null],
          source_id:[null],
          destination_id:[null],
          // baseFare:[null],
          new_fare:[null]
        })
      ])
    });

  }
  get fareFormGroup() {
    return this.fareGroup.get('fareArray') as FormArray;
  }
  OpenModal(content) {
   
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  getSeats(id:any)
  {
    this.busRecord=this.buses[id];
    this.locationService.readAll().subscribe(
      records=>{
        //CHANDRA TO BE CHANGED
        this.locations=records.data;
        let locs={};
        for(let loc of this.locations)
        {
          var key=loc.id;
          locs[key]=loc.name;
        }
        this.locationArray=locs;
       // console.log(this.locationArray);
      }
    );    
    this.fareRecord= (<FormArray>this.fareGroup.controls['fareArray']) as FormArray;
    this.fareRecord.clear();
    this.busSeatsService.readAll(this.busRecord.id).subscribe(records=>{      
      this.ticketPrice=records.result;
      let baseSeaterFare="";
      let baseSleeperFare="";
      let sourceId="";
      let destinationId="";
      for(let journey of this.ticketPrice)
      {
        
        baseSeaterFare=journey.base_seat_fare;
        baseSleeperFare=journey.base_sleeper_fare;
        sourceId=journey.source_id;
        destinationId=journey.destination_id;
        let seatFare="";
        for(let seats of journey.get_bus_seats)
        {
          seatFare=(seats.seat_type=="1")?baseSeaterFare:baseSleeperFare;
          let totalLength = this.fareRecord.length;
          let seatRow: FormGroup = this.fb.group({
            id: [seats.id],
            seat_number:[seats.seat_number],
            source_id:[sourceId],
            destination_id:[destinationId],
            baseFare:[seatFare],
            new_fare:[seats.new_fare]
          })
          this.fareRecord.insert(totalLength, seatRow);
        }
        
      }

      console.log(this.fareRecord);
    });
  }
  updatePrice()
  {
    console.log(this.fareGroup);
    const data={
      fare_info:this.fareGroup.value.fareArray
    };
    this.busService.updateNewFare(data).subscribe(
      resp => {
        if(resp.status==1)
        {
            
            this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
            this.modalReference.close();
            this.rerender();
        }
        else{
          this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
        }
      }
    );
  }
  loadBus(){
    
    this.dtOptionsBus = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: 'lBfrtip',  
      order:["0","desc"], 
      aLengthMenu:[10, 25, 50, 100, "All"],
      language: {
        searchPlaceholder: "Find Bus",
        processing: "<img src='assets/images/loading.gif' width='30'>"
      },
        
      buttons: [
        { extend: 'copy', className: 'btn btn-sm btn-primary',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     } },
      { extend: 'print', className: 'btn btn-sm btn-danger',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     } },
      { extend: 'excel', className: 'btn btn-sm btn-info',init: function(api, node, config) {
        $(node).removeClass('dt-button')
     } },
      
     {
      text:"Add",
      className: 'btn btn-sm btn-warning',init: function(api, node, config) {
        $(node).removeClass('dt-button')
      },
      action:() => {
       this.addnew.nativeElement.click();
      }
    }
    ],
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            Constants.BASE_URL+'/busDT',
            dataTablesParameters, {}
          ).subscribe(resp => {
           
            this.buses = resp.data.aaData;           
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: resp.data.aaData
            });
          });
      },
      columns: [
      { data: 'id' },
      { data: 'name'},
      { data: 'via'}, 
      { data: 'bus_number'},
      { 
        data: 'status',
        render:function(data)
        {
          return (data=="1")?"Active":"Pending"
        }
      },
      { title:'Action',data: null,orderable:false},
    ]         
    }; 

   
  }
  dropfg:any;
  ngOnInit(): void {
    this.fareGroup = this.fb.group({
      fareArray:this.fb.array([
        this.fb.group({
          new_fare:[null]
        })
      ])
    });
    this.loadBus();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
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

}
