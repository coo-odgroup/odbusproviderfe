import { Component, OnInit, ViewChild } from '@angular/core';
import { BusService } from '../../services/bus.service';
import { Busoperator } from '../../model/busoperator';
import { Bustype } from '../../model/bustype';
import { Seatingtype } from '../../model/seatingtype';
import { Amenities } from '../../model/amenities';
import { Cancellationslab } from '../../model/cancellationslab';
import { Buscontact } from '../../model/buscontact';
import { SeatLayout } from '../../model/seatlayout';
import { Location } from '../../model/location';
import { Busstoppage } from '../../model/busstoppage';
import { BoardingDropping } from '../../model/boardingdropping';
import {Constants} from '../../constant/constant';
import { DataTablesResponse} from '../../model/datatable';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Bus } from '../../model/bus';
import {SafetyService} from '../../services/safety.service';
import { Safety } from '../../model/safety';
import { BusOperatorService } from '../../services/bus-operator.service';
import { BusTypeService } from '../../services/bus-type.service';
import { SeatingtypeService } from '../../services/seatingtype.service';
import { AmenitiesService } from '../../services/amenities.service';
import { CancellationslabService } from '../../services/cancellationslab.service';
import { BusContactService } from '../../services/bus-contact.service';
import { SeatlayoutService } from '../../services/seatlayout.service';
import { LocationService } from '../../services/location.service';
import { BoardingdropingService } from '../../services/boardingdroping.service';

//import {IOption} from 'ng-select';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { count } from 'rxjs/operators';

interface SeatBlock{
  rowNumber?:any;
  colNumber?:any;
  seatType?:any;
  berthType?:any;
  seatText?:any;
}
interface SelectedLocation{
  [index: number]: { id: any; location_name: any};
}
interface SelectedAmenities{
  id?:any;
  name?:any;
}
@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss'],
  providers: [NgbModalConfig, NgbModal, NgbDropdownConfig]
})
export class BusComponent implements OnInit {  

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  seatBlock:SeatBlock;
  seatBlocks:SeatBlock[]=[];
  selectedLocation:SelectedLocation;
  selectedLocations:SelectedLocation[]=[];


  public selectedAmenities:SelectedAmenities[];
  public formConfirm: FormGroup;
  public busGallery: FormGroup;
  public busForm: FormGroup;
  public routeList: FormArray;
  public seatlayoutList:FormArray;
  public businfoList: FormArray;
  public destinationDroppings: FormArray;
  public sourceBoardingList: FormArray;
  public destinationDroppingList: FormArray;
  @ViewChild("addnew") addnew;

  counter=0;
  public seatLayoutData:any;  
  public seatLayoutCol:any;
  getSeatLayout($event:any)
  {
    this.seatLayoutData = (<FormArray>this.busForm.controls['bus_seat_layout_data']) as FormArray;
    this.seatLayoutData.clear();
    this.seatlayoutService.getByID($event.id).subscribe(
      resp=>{
        let counter=0;
        
        this.seatLayoutData = (<FormArray>this.busForm.controls['bus_seat_layout_data']) as FormArray;
        if(resp.data.lowerBerth!=undefined)
        {
          for(let lowerData of resp.data.lowerBerth)
          {
            let arraylen=this.seatLayoutData.length;
            let berthData: FormGroup = this.fb.group({ 
              lowerBerth: this.fb.array([
              ]),
              upperBerth: this.fb.array([
              ])
            });
            this.seatLayoutData.insert(arraylen, berthData); //PUSH BLANK LOWER BETH ARRAY TO seatLayoutData
            this.seatLayoutCol = (<FormArray>this.busForm.controls['bus_seat_layout_data']).at(counter).get('lowerBerth') as FormArray;
            for(let seatData of lowerData)
            {
              let collen=this.seatLayoutCol.length;
              let columnData: FormGroup = this.fb.group({ 
                seatText:[seatData.seatText],
                seatType:[seatData.seatType],
                berthType:[seatData.berthType],
                seatChecked:[null]
              });
              this.seatLayoutCol.insert(collen, columnData);
              
            }
            counter++;
          }
          
        }
        if(resp.data.upperBerth!=undefined)
        {
          for(let upperData of resp.data.upperBerth)
          {
            let arraylen=this.seatLayoutData.length;
            let berthData: FormGroup = this.fb.group({ 
              lowerBerth: this.fb.array([
              ]),
              upperBerth: this.fb.array([
              ])
            });
            this.seatLayoutData.insert(arraylen, berthData); //PUSH BLANK LOWER BETH ARRAY TO seatLayoutData
            this.seatLayoutCol = (<FormArray>this.busForm.controls['bus_seat_layout_data']).at(counter).get('upperBerth') as FormArray;
            for(let seatData of upperData)
            {
              let collen=this.seatLayoutCol.length;
              let columnData: FormGroup = this.fb.group({ 
                seatText:[seatData.seatText],
                seatType:[seatData.seatType],
                berthType:[seatData.berthType],
                seatChecked:[null]
              });
              this.seatLayoutCol.insert(collen, columnData);
            }
            counter++;
          }
        }
      }
    );
    
  }

  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
     this.busService.delete(delitem).subscribe(
      resp => {
        if(resp.status==1)
            {
                this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                this.confirmDialogReference.close();

                this.rerender();
            }
            else{
               
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
            }
      }); 
  }
  // returns all form groups under routes
  get layoutFormGroup() {
    return this.busForm.get('bus_seat_layout_data') as FormArray;
  }
  get routeFormGroup() {
    return this.busForm.get('busRoutes') as FormArray;
  }
  get routeInfoFormGroup() {
    return this.busForm.get('busRoutesInfo') as FormArray;
  }
  get businfoFormGroup() {
    return this.busForm.get('businfo') as FormArray;
  }
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
  operators: Busoperator[];
  operatorRecord: Busoperator;
  busTypes: Bustype[];
  busTypeRecord: Bustype;
  busSeatingTypes: Seatingtype[];
  busSeatingTypeRecord: Seatingtype; 
  amenitiesRecord: Amenities;
  amenities:Amenities[];

  safetyRecord: Safety;
  safetyies:Safety[];

  
  cancellationslabs: Cancellationslab[];
  cancellationslabRecord: Cancellationslab;
  busContacts: Buscontact[];
  busContactsRecord: Buscontact;
  seatLayouts: SeatLayout[];
  seatLayoutRecord: SeatLayout;
  locations: Location[];
  locationRecord: Location;
  Busstoppages: Busstoppage[];
  busStoppageRecord: Busstoppage;
  boardings: BoardingDropping[];
  boardingRecord: BoardingDropping;
  droppings: BoardingDropping[];
  droppingRecord: BoardingDropping;
  source: any;
  destination: any;
  
  
  
  public isSubmit: boolean;
  public mesgdata:any;
  public sources:any={};
  public destinations: any={};
  public allSources:string;
  public allDestinations:string;
  public allAmenities:string;
  public boardingChildreen = {};
  public droppingChildren = {};
  public ModalHeading:any;
  public ModalBtn:any;

  public data_conductor_no="";
  public data_c_sms_ticket="";
  public data_c_sms_cancel="";
  public data_manager_no="";
  public data_m_sms_ticket="";
  public data_m_sms_cancel="";
  public data_owner_no="";
  public data_o_sms_ticket="";
  public data_o_sms_cancel="";

  constructor(private safetyService: SafetyService,private http: HttpClient, private busService:BusService, private notificationService: NotificationService,private busOperartorService:BusOperatorService, private busTypeService:BusTypeService, private seatingtypeService:SeatingtypeService, private amenitiesService:AmenitiesService, private cancellationslabService:CancellationslabService, private busContactService:BusContactService, private seatlayoutService:SeatlayoutService, private locationService:LocationService, private boardingdropingService:BoardingdropingService, private fb: FormBuilder, config: NgbModalConfig, private modalService: NgbModal,dpconfig: NgbDropdownConfig ) {
    this.isSubmit = false;
    this.busRecord={} as Bus; 
    this.busContactsRecord={} as Buscontact; 
    this.busStoppageRecord={} as Busstoppage;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Bus";
    this.ModalBtn = "Save";

    dpconfig.placement = 'top-left';
    dpconfig.autoClose = false;
    

    
  }
  OpenModal(content) {
   
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  busImageGallery(index:any)
  {
    this.busRecord=this.buses[index];
   // console.log(this.busRecord);
    this.busGallery = this.fb.group({
      image_file:[null],
      alt_tag:[null, Validators.compose([Validators.required])]
    });
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
  allDestinationDroppings:FormArray;
  ngOnInit() {
    this.busGallery = this.fb.group({
      image_file:[null],
      alt_tag:[null, Validators.compose([Validators.required])]
    });
    this.busForm = this.fb.group({
      id:[null],
      bus_operator_id: [null, Validators.compose([Validators.required])],
      name: [null, Validators.compose([Validators.required])],
      via: [null, Validators.compose([Validators.required])],
      bus_type_id: [null, Validators.compose([Validators.required])],
      bus_sitting_id: [null, Validators.compose([Validators.required])],
      amenities:[null, Validators.compose([Validators.required])],
      safety:[null],
      cancellationslabs_id: [null, Validators.compose([Validators.required])],
      cancelation_points: [null],
      selectedSeat:this.fb.array([
        this.fb.group({
          category:[0],
          seat_type:[null],
          berth_type:[null],
          seat_number:[null],
          duration:[0]
        })
      ]),
      bus_seat_layout_id: [null, Validators.compose([Validators.required])],
      bus_seat_layout_data:this.fb.array([
        this.fb.group({
          upperBerth:this.fb.array([
          ]),//Upper Berth Items Will be Added Here
          lowerBerth:this.fb.array([
          ])//Lower Berth Items will be added Here
        })
      ]),
      busRoutes: this.fb.array([
        this.fb.group({
          source_id: [null, Validators.compose([Validators.required])], 
          sourceBoarding: this.fb.array([])
        })
      ]),
      busRoutesInfo:this.fb.array([
        this.fb.group({
          from_location:[null],
          to_location:[null],
          arr_days:[null],
          dep_days:[null],
          seater_fare:[null],
          sleeper_fare:[null]
        })
      ]),
      bus_number: [null, Validators.compose([Validators.required])], 
      conductor_no: [null, Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])], 
      c_sms_ticket: ["true"], 
      c_sms_cancel: ["true"], 
      manager_no: [null, Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])], 
      m_sms_ticket: ["true"], 
      m_sms_cancel: ["true"],
      owner_no: [null, Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])], 
      o_sms_ticket: ["true"], 
      o_sms_cancel: ["true"],
    });
    this.routeList = this.busForm.get('busRoutes') as FormArray;
    this.seatlayoutList = this.busForm.get('bus_seat_layout_data') as FormArray;
    this.allDestinationDroppings = this.busForm.controls.busRoutes.get('destinationDroppings') as FormArray;
    this.businfoList = this.busForm.get('businfo') as FormArray;
    this.loadBus();
  }
  // route formgroup
  createRoute(): FormGroup {
      return this.fb.group({
        source_id: [null, Validators.compose([Validators.required])], 
        sourceBoarding: this.fb.array([])
      });
  }
  createRouteInfo(): FormGroup {
    return this.fb.group({
      from_location:[null, Validators.compose([Validators.required])],
      to_location:[null, Validators.compose([Validators.required])],
      arr_days:[null, Validators.compose([Validators.required])],
      dep_days:[null, Validators.compose([Validators.required])],
      seater_fare:[null, Validators.compose([Validators.required])],
      sleeper_fare:[null, Validators.compose([Validators.required])]
    });

}
  createDestinationDropping(): FormGroup {
    return this.fb.group({
      destination_dropping: [null], 
      destination_dropping_name: [null], 
      destination_dropping_time: [null]      
    });
  }
  // add a route form group
  addRoute() {
    this.busRoutesRecords=this.busForm.get('busRoutes') as FormArray;
    let arraylen = this.busRoutesRecords.length;
    this.busRoutesRecords.insert(arraylen, this.createRoute());
  }
  addRouteInfo(){
    this.busRouteInfo=this.busForm.get('busRoutesInfo') as FormArray;
    let arraylen = this.busRouteInfo.length;
    this.busRouteInfo.insert(arraylen, this.createRouteInfo());
  }
  // remove route from group
  removeRoute(index) {
    // this.routeList = this.busForm.get('routes') as FormArray;
    this.busRoutesRecords=this.busForm.get('busRoutes') as FormArray;
    this.busRoutesRecords.removeAt(index);
    this.selectedLocations.splice(index,1);

  }
  removeRouteInfo(index)
  {
    this.busRouteInfo=this.busForm.get('busRoutesInfo') as FormArray;
    this.busRouteInfo.removeAt(index);
  }
  // get the formgroup under contacts form array
  getRoutesFormGroup(index): FormGroup {
    // this.contactList = this.busForm.get('contacts') as FormArray;
    const formGroup = this.routeList.controls[index] as FormGroup;
    return formGroup;
  }
  getSeatlayoutGroup(index): FormGroup {
    // this.contactList = this.busForm.get('contacts') as FormArray;
    const formGroup = this.seatlayoutList.controls[index] as FormGroup;
    return formGroup;
  }
  removeBusinfo(index) {
    this.businfoList.removeAt(index);
  }
  createSourceBoarding(): FormGroup {
    return this.fb.group({});
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
  lowerlayoutData:FormArray;
  upperlayoutData:FormArray;
  seatLayout=[];
  row_arr=[];
  sleeper_row_arr=[];
  sLayoutData=[];
  viewSeats=[];
  Rows=[];
  sleeperRows=[];
  seats=[];

  layoutArray:FormArray;
  
  public selectSlab;
  public selectedcSlabRecord;
  public allDurations;
  public allDeductions;
  
  LoadAllService()
  {
    this.busOperartorService.readAll().subscribe(
      record=>{
      this.operators=record.data;
      }
    );
    this.busTypeService.readAll().subscribe(
      rec=>{
      this.busTypes=rec.data;
      }
    );
    this.seatingtypeService.readAll().subscribe(
      records=>{
      this.busSeatingTypes=records.data;
      }
    );
    // Amenities Commented as Work Ongoing by PD Sir
    this.amenitiesService.all().subscribe(
      res=>{
        this.amenities=res.data;
      }
    );
    this.safetyService.readAll().subscribe(res=>{
      this.safetyies=res.data;
    });
    this.cancellationslabService.readAll().subscribe(
      resp=>{
      this.cancellationslabs=resp.data;
      }
    );
    this.busContactService.readAll().subscribe(
      resp=>{
      this.busContacts=resp.data;
      }
    );
    this.seatlayoutService.readAll().subscribe(
      resp=>{
      this.seatLayouts=resp.data;
      }
    );
    // this.locationService.readAll().subscribe(
    //   records=>{
    //     this.locations=records.data;
    //   }
    // );
    // NG_SELECT IMPLEMENATION STARTED///
    this.locationService.readAll().subscribe(
      records=>{
      this.locations=records.data;
      
      }
    );

    
  }
  ResetAttributes()
  {
    this.allDurations=Array();
    this.allDeductions=Array();
    this.operators=Array();
    this.busTypes=Array();
    this.busSeatingTypes=Array();
    this.amenities=Array();
    this.cancellationslabs=Array();
    this.busContacts=Array();
    this.seatLayouts=Array();
    this.locations=Array();
    this.busForm = this.fb.group({
      id:[null],
      bus_operator_id: [null, Validators.compose([Validators.required])],
      name: [null, Validators.compose([Validators.required])],
      via: [null, Validators.compose([Validators.required])],
      bus_description:[null],
      bus_type_id: [null, Validators.compose([Validators.required])],
      bus_sitting_id: [null, Validators.compose([Validators.required])],
      cancellationslabs_id: [null, Validators.compose([Validators.required])],
      cancelation_points: [null],
      amenities:[null, Validators.compose([Validators.required])],
      safety:[null],
      bus_seat_layout_id: [null, Validators.compose([Validators.required])],
      bus_seat_layout_data:this.fb.array([

      ]),
      busRoutes: this.fb.array([
        this.fb.group({
          source_id: [null, Validators.compose([Validators.required])], 
          sourceBoarding: this.fb.array([])
        })
      ]),
      busRoutesInfo:this.fb.array([
        this.fb.group({
          from_location:[null],
          to_location:[null],
          arr_days:[null],
          dep_days:[null],
          seater_fare:[null],
          sleeper_fare:[null]
        })
      ]),
      bus_number: [null,Validators.compose([Validators.required,Validators.minLength(5),Validators.maxLength(15)])], 
      conductor_no: [null, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.required,Validators.minLength(10),Validators.maxLength(10)])], 
      c_sms_ticket: ["true"], 
      c_sms_cancel: ["true"], 
      manager_no: [null, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.required,Validators.minLength(10),Validators.maxLength(10)])], 
      m_sms_ticket: ["true"], 
      m_sms_cancel: ["true"],
      owner_no: [null, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.required,Validators.minLength(10),Validators.maxLength(10)])], 
      o_sms_ticket: ["true"], 
      o_sms_cancel: ["true"]
    });
    this.ModalHeading = "Add New Bus";
    this.ModalBtn = "Save";
    this.selectedLocation=[];
    
  }
 
  public sourceLocationRecord:any; 
  public newselectedLocation=[];
  getSource(sourceId: any , parentKey:any){

    this.selectedLocations[parentKey]=[{id:sourceId.id,location_name:sourceId.name}];
    
    this.sourceLocationRecord = (<FormArray>this.busForm.controls['busRoutes']).at(parentKey).get('sourceBoarding') as FormArray;
    this.sourceLocationRecord.clear();
    this.boardingdropingService.get(sourceId.id).subscribe(
      records=>{
        this.boardings=records.data;  
        for(let stoppage of this.boardings)
        {
          let arraylen = this.sourceLocationRecord.length;
          let newSourcegroup: FormGroup = this.fb.group({
            sourceLocation: [stoppage.boarding_point],
            boarding_dropping_id: [stoppage.id],
            sourcechecked:[null],
            sourceTime:[null]
          })
          this.sourceLocationRecord.insert(arraylen, newSourcegroup);
        }
        
      }
    ); 
  }
  updateGeneralInfo()
  {
    const data ={
      id:this.busRecord.id,
      bus_operator_id:this.busForm.value.bus_operator_id,
      user_id :'1',
      amenities:this.busForm.value.amenities,
      safety:this.busForm.value.safety,
      bus_sitting_id:this.busForm.value.bus_sitting_id,
      bus_type_id:this.busForm.value.bus_type_id,
      cancelation_points:this.busForm.value.cancelation_points,
      cancellationslabs_id:this.busForm.value.cancellationslabs_id,
      name:this.busForm.value.name,
      bus_number:this.busRecord.bus_number,
      bus_seat_layout_id:this.busRecord.bus_seat_layout_id,
      via:this.busForm.value.via,
      ticket_cancelation_id:'1', 
      bus_description:this.busForm.value.bus_description,
      created_by:'Admin',
    };
    if(data.id!=null)
    {
      this.busService.update(data.id,data).subscribe(
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
  }
  updateContactinfo()
  {
    //here
    const data={
      id:this.busForm.value.id,
      created_by:'Admin',
      bus_number:this.busForm.value.bus_number,
      conductor_no:this.busForm.value.conductor_no,
      c_sms_ticket:this.busForm.value.c_sms_ticket,
      c_sms_cancel:this.busForm.value.c_sms_cancel,
      manager_no:this.busForm.value.manager_no,
      m_sms_ticket:this.busForm.value.m_sms_ticket,
      m_sms_cancel:this.busForm.value.m_sms_cancel,
      owner_no:this.busForm.value.owner_no,
      o_sms_ticket:this.busForm.value.o_sms_ticket,
      o_sms_cancel:this.busForm.value.o_sms_cancel,
    };
    if(data.id!=null)
    {
      this.busService.updateContactinfo(data.id,data).subscribe(
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

  }

  getCancellationRule($event:any)
  {
    let item=$event.id;
    if(item==null)
    {
      item=$event;
    }
    this.cancellationslabService.getByID(item).subscribe(
      resp=>{
        
        this.selectedcSlabRecord=resp.data;
        this.selectSlab = resp.data;
            
        for(let items of this.selectSlab)
        {
          this.selectedcSlabRecord=items;
          let durationData=this.selectedcSlabRecord.duration;
          durationData=durationData.replace("#$0-","#$Below ");
          durationData=durationData.replace(/-/g," to ");
          durationData=durationData.replace(/#/g," Hrs #");
          durationData=durationData.replace("Hrs #"," Hrs and Above #");
          durationData=durationData.concat(" Hrs");
         
          this.allDurations=durationData.split("#$");
          this.allDeductions=this.selectedcSlabRecord.deduction.split("#$");

        }

      }
    );
  }
  addBus()
  {
   
    const data ={
      id:this.busForm.value.id,
      bus_operator_id:this.busForm.value.bus_operator_id,
      user_id :'1',
      amenities:this.busForm.value.amenities,
      safety:this.busForm.value.safety,
      bus_seat_layout_id:this.busForm.value.bus_seat_layout_id,
      bus_sitting_id:this.busForm.value.bus_sitting_id,
      bus_type_id:this.busForm.value.bus_type_id,
      cancelation_points:this.busForm.value.cancelation_points,
      bus_seat_layout_data:this.busForm.value.bus_seat_layout_data,
      cancellationslabs_id:this.busForm.value.cancellationslabs_id,
      name:this.busForm.value.name,
      via:this.busForm.value.via,
      ticket_cancelation_id:'1', 
      created_by:'Admin',
      bus_number:this.busForm.value.bus_number,
      conductor_no:this.busForm.value.conductor_no,
      c_sms_ticket:this.busForm.value.c_sms_ticket,
      c_sms_cancel:this.busForm.value.c_sms_cancel,
      manager_no:this.busForm.value.manager_no,
      m_sms_ticket:this.busForm.value.m_sms_ticket,
      m_sms_cancel:this.busForm.value.m_sms_cancel,
      owner_no:this.busForm.value.owner_no,
      o_sms_ticket:this.busForm.value.o_sms_ticket,
      o_sms_cancel:this.busForm.value.o_sms_cancel,
      //BELOW ELEMENTS ARE ARRAY
      bus_description:this.busForm.value.bus_description,
      businfo:this.busForm.value.businfo,
      busRoutes:this.busForm.value.busRoutes,
      busRoutesInfo:this.busForm.value.busRoutesInfo
      
    };
    console.log(data);
    return false;
    if(data.id==null)
    {
      this.busService.create(data).subscribe(
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
    else{
      this.busService.update(data.id,data).subscribe(
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
  }
  deleteBus(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });    
  }

  editContact(event : Event, id : any)
  {
    this.busContactService.readAll().subscribe(
      resp=>{
      this.busContacts=resp.data;
      }
    );
    this.ModalHeading = "Update Contact info";
    this.ModalBtn = "Update";
    this.busRecord=this.buses[id];
    
    this.busService.fetchBusContact(this.busRecord.id).subscribe(
      resp => {
        if(resp.status==1)
        {
            this.busContacts=resp.data;
            this.data_conductor_no=this.busContacts[0]['phone'];
            this.data_c_sms_ticket=this.busContacts[0]['booking_sms_send'];
            this.data_c_sms_cancel=this.busContacts[0]['cancel_sms_send'];         
            this.data_manager_no=this.busContacts[1]['phone'];
            this.data_m_sms_ticket=this.busContacts[1]['booking_sms_send'];
            this.data_m_sms_cancel=this.busContacts[1]['cancel_sms_send'];
            this.data_owner_no=this.busContacts[2]['phone'];
            this.data_o_sms_ticket=this.busContacts[2]['booking_sms_send'];
            this.data_o_sms_cancel=this.busContacts[2]['cancel_sms_send'];
            
            this.busForm = this.fb.group({
              id:[this.busRecord.id],
              bus_number: [this.busRecord.bus_number, Validators.compose([Validators.required])], 
              conductor_no: [this.data_conductor_no, Validators.compose([Validators.required])], 
              c_sms_ticket: [this.data_c_sms_ticket], 
              c_sms_cancel: [this.data_c_sms_cancel], 
              manager_no: [this.data_manager_no, Validators.compose([Validators.required])], 
              m_sms_ticket: [this.data_m_sms_ticket], 
              m_sms_cancel: [this.data_m_sms_cancel],
              owner_no: [this.data_owner_no, Validators.compose([Validators.required])], 
              o_sms_ticket: [this.data_o_sms_ticket], 
              o_sms_cancel: [this.data_o_sms_cancel]
            });
        }
        else{
        }
      }
    );
    
  }
  public busRoutesRecords:any;
  public busRoutesInfoRecords:any;
  public busRouteInfo:any;
  editRoutes(event:Event,id:any)
  {
    this.locationService.readAll().subscribe(
      records=>{
      this.locations=records.data;
      
      }
    );
    this.ModalHeading = "Update Routes";
    this.ModalBtn = "Update";
    this.busRecord=this.buses[id] ;
    this.busForm = this.fb.group({
      id:[this.busRecord.id],
      bus_operator_id:[this.busRecord.bus_operator_id],
      busRoutes: this.fb.array([]),
      busRoutesInfo:this.fb.array([
        this.fb.group({
          from_location:[null],
          to_location:[null],
          arr_days:[null],
          dep_days:[null],
          seater_fare:[null],
          sleeper_fare:[null]
        })
      ])
    });
    this.busService.fetchBusTime(this.busRecord.id).subscribe(
      timing=>{
        if(timing.status==1)
        {
          
          this.busRoutesRecords=this.busForm.get('busRoutes') as FormArray;
          let stoppages=timing.data.stoppage_timing;
          //this.sourceLocationRecord.length=0;
          for(let items of timing.data.routes)
          {
            let arraylen = this.busRoutesRecords.length;
            let new_BusRoute_group : FormGroup=this.fb.group({
              source_id: [items['location_id'], Validators.compose([Validators.required])], 
              sourceBoarding: this.fb.array([]),
            });
            this.busRoutesRecords.insert(arraylen, new_BusRoute_group);

           
           
           
            this.boardingdropingService.get(items['location_id']).subscribe(
              records=>{
                this.sourceLocationRecord = (<FormArray>this.busForm.controls['busRoutes']).at(arraylen).get('sourceBoarding') as FormArray;     
                let spoints="";
                this.boardings=records.data;      
                for(let items of this.boardings)
                {
                  this.boardingRecord=items;
                  spoints=this.boardingRecord.boarding_point.split("#$");
                }
                let sourceLocations= spoints;
                
                
                for(let SourceLoop of sourceLocations)
                {
                  let arraylen_child = this.sourceLocationRecord.length;
                  foundValue=Array()
                  if(stoppages.find(obj=>obj.stoppage_name===SourceLoop))
                  {
                    var foundValue = stoppages.find(obj=>obj.stoppage_name===SourceLoop).stoppage_time;
                    let newSourcegroup: FormGroup = this.fb.group({
                      sourceLocation: [SourceLoop],
                      sourcechecked:["true"],
                      sourceTime:[foundValue]
                    });
                    this.sourceLocationRecord.insert(arraylen_child,newSourcegroup);
                  }
                  else
                  {
                    let newSourcegroup: FormGroup = this.fb.group({
                      sourceLocation: [SourceLoop],
                      sourcechecked:[null],
                      sourceTime:[null]
                    });
                    this.sourceLocationRecord.insert(arraylen_child,newSourcegroup);
                  }
                }
              }
            ); 
          }

        }
      }
    )
    this.busService.fetchBusRoutes(this.busRecord.id).subscribe(
      resp => {
        if(resp.status==1)
        {
          
          

          this.busRoutesInfoRecords=this.busForm.get('busRoutesInfo') as FormArray;
          this.busRoutesInfoRecords.clear();
          
          for(let singleRoute of resp.data)
          {
            
            
            let arrayroutelen = this.busRoutesInfoRecords.length;

            let new_busRoutesInfo_group : FormGroup=this.fb.group({
              from_location:[singleRoute.source_id],
              to_location:[singleRoute.destination_id],
              arr_days:[singleRoute.start_j_days],
              dep_days:[singleRoute.j_day],
              seater_fare:[singleRoute.base_seat_fare],
              sleeper_fare:[singleRoute.base_sleeper_fare]
            });
            this.selectedLocations[arrayroutelen]=[{id:singleRoute.source_id,location_name:singleRoute.source_id}];
            this.busRoutesInfoRecords.insert(arrayroutelen, new_busRoutesInfo_group);

           
            let stoppages=singleRoute['stoppage'];



          }
          
        }
      }
    );
    

    
  }

  UpdateRoutes()
  {
    const data ={
      id:this.busForm.value.id,
      bus_operator_id:this.busForm.value.bus_operator_id,
      user_id :'1',
      created_by:'Admin',
      busRoutes:this.busForm.value.busRoutes,
      busRoutesInfo:this.busForm.value.busRoutesInfo
    };

    if(data.id!=null)
    {
      this.busService.updateRoutes(data.id,data).subscribe(
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
  }
  BusCopy(event : Event, id : any)
  {
    this.ModalHeading = "Bus Copied";
    this.ModalBtn = "Add New";
    this.busRecord=this.buses[id] ;
    
    
    this.busForm = this.fb.group({
      id:[null],
      bus_operator_id: [this.busRecord.bus_operator_id, Validators.compose([Validators.required])],
      name: [this.busRecord.name, Validators.compose([Validators.required])],
      via: [this.busRecord.via, Validators.compose([Validators.required])],
      bus_description:[this.busRecord.bus_description],
      bus_type_id: [this.busRecord.bus_type_id, Validators.compose([Validators.required])],
      bus_sitting_id: [this.busRecord.bus_sitting_id, Validators.compose([Validators.required])],
      cancellationslabs_id: [this.busRecord.cancellationslabs_id, Validators.compose([Validators.required])],
      cancelation_points: [this.busRecord.cancelation_points],
      amenities:[null],
      safety:[null],
      bus_seat_layout_id: [this.busRecord.bus_seat_layout_id, Validators.compose([Validators.required])],
      bus_seat_layout_data:this.fb.array([
        this.fb.group({
          upperBerth:this.fb.array([]),//Upper Berth Items Will be Added Here
          lowerBerth:this.fb.array([])//Lower Berth Items will be added Here
        })
      ]),
      busRoutes: this.fb.array([]),
      busRoutesInfo:this.fb.array([]),
      bus_number: [this.busRecord.bus_number,Validators.compose([Validators.required,Validators.minLength(5),Validators.maxLength(15)])], 
      conductor_no: [null, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.required])], 
      c_sms_ticket: [null], 
      c_sms_cancel: [null], 
      manager_no: [null, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.required])], 
      m_sms_ticket: [null], 
      m_sms_cancel: [null],
      owner_no: [null, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.required])], 
      o_sms_ticket: [null], 
      o_sms_cancel: [null]
    });

    this.getCancellationRule(this.busRecord.cancellationslabs_id);

    this.busService.getSelectedSeat(this.busRecord.id).subscribe(
      seatData=>{
        this.selectedSeats=seatData.data;
      }
    );
   
    this.seatlayoutService.getByID(this.busRecord.bus_seat_layout_id).subscribe(
      resp=>{
        let counter=0;
        this.seatLayoutData = (<FormArray>this.busForm.controls['bus_seat_layout_data']) as FormArray;
        
        if(resp.data.lowerBerth!=undefined)
        {
          for(let lowerData of resp.data.lowerBerth)
          {
            let arraylen=this.seatLayoutData.length;
            let berthData: FormGroup = this.fb.group({ 
              lowerBerth: this.fb.array([
              ]),
              upperBerth: this.fb.array([
              ])
            });
            this.seatLayoutData.insert(arraylen, berthData); //PUSH BLANK LOWER BETH ARRAY TO seatLayoutData
            this.seatLayoutCol = (<FormArray>this.busForm.controls['bus_seat_layout_data']).at(counter).get('lowerBerth') as FormArray;
            for(let seatData of lowerData)
            {
              let checkedval="";
              let seatId="";
              for(let selectedSeat of this.selectedSeats)
              {
                if(selectedSeat.berth_type==seatData.berthType && selectedSeat.seat_type==seatData.seatType && selectedSeat.seat_number==seatData.seatText)
                {
                  checkedval="true";
                  seatId=selectedSeat.id;
                }
              }
              let collen=this.seatLayoutCol.length;
              let columnData: FormGroup = this.fb.group({ 
                seatText:[seatData.seatText],
                seatType:[seatData.seatType],
                berthType:[seatData.berthType],
                seatChecked:[checkedval],
                category:['0'],
                seatId:[seatId],
                busId:[this.busRecord.id]
              });
              this.seatLayoutCol.insert(collen, columnData);
              
            }
            counter++;
          }
          
        }
        if(resp.data.upperBerth!=undefined)
        {
          for(let upperData of resp.data.upperBerth)
          {
            let arraylen=this.seatLayoutData.length;
            let berthData: FormGroup = this.fb.group({ 
              lowerBerth: this.fb.array([
              ]),
              upperBerth: this.fb.array([
              ])
            });
            this.seatLayoutData.insert(arraylen, berthData); //PUSH BLANK LOWER BETH ARRAY TO seatLayoutData
            this.seatLayoutCol = (<FormArray>this.busForm.controls['bus_seat_layout_data']).at(counter).get('upperBerth') as FormArray;
            for(let seatData of upperData)
            {
              let checkedval="";
              let seatId="";
              for(let selectedSeat of this.selectedSeats)
              {
                if(selectedSeat.berth_type==seatData.berthType && selectedSeat.seat_type==seatData.seatType && selectedSeat.seat_number==seatData.seatText)
                {
                  checkedval="true";
                  seatId=selectedSeat.id;
                }
              }
              let collen=this.seatLayoutCol.length;
              let columnData: FormGroup = this.fb.group({ 
                seatText:[seatData.seatText],
                seatType:[seatData.seatType],
                berthType:[seatData.berthType],
                seatChecked:[checkedval],
                category:['0'],
                seatId:[seatId],
                busId:[this.busRecord.id]
              });
              this.seatLayoutCol.insert(collen, columnData);
            }
            counter++;
          }
        }
      }
    ); 

    this.busService.fetchBusContact(this.busRecord.id).subscribe(
      resp => {
        if(resp.status==1)
        {
            this.busContacts=resp.data;
            this.data_conductor_no=this.busContacts[0]['phone'];
            this.data_c_sms_ticket=this.busContacts[0]['booking_sms_send'];
            this.data_c_sms_cancel=this.busContacts[0]['cancel_sms_send'];         
            this.data_manager_no=this.busContacts[1]['phone'];
            this.data_m_sms_ticket=this.busContacts[1]['booking_sms_send'];
            this.data_m_sms_cancel=this.busContacts[1]['cancel_sms_send'];
            this.data_owner_no=this.busContacts[2]['phone'];
            this.data_o_sms_ticket=this.busContacts[2]['booking_sms_send'];
            this.data_o_sms_cancel=this.busContacts[2]['cancel_sms_send'];
            
            this.busForm.controls.conductor_no.setValue(this.data_conductor_no);
            this.busForm.controls.c_sms_ticket.setValue(this.data_c_sms_ticket);
            this.busForm.controls.c_sms_cancel.setValue(this.data_c_sms_cancel);
            
            this.busForm.controls.manager_no.setValue(this.data_manager_no);
            this.busForm.controls.m_sms_ticket.setValue(this.data_m_sms_ticket);
            this.busForm.controls.m_sms_cancel.setValue(this.data_m_sms_cancel);

            this.busForm.controls.owner_no.setValue(this.data_owner_no);
            this.busForm.controls.o_sms_ticket.setValue(this.data_o_sms_ticket);
            this.busForm.controls.o_sms_cancel.setValue(this.data_o_sms_cancel);
        }
      }
    );

    this.busService.fetchBusTime(this.busRecord.id).subscribe(
      timing=>{
        if(timing.status==1)
        {
          
          this.busRoutesRecords=this.busForm.get('busRoutes') as FormArray;
          let stoppages=timing.data.stoppage_timing;
          //this.busRoutesRecords.clear();
          for(let items of timing.data.routes)
          {
            let arraylen = this.busRoutesRecords.length;
            let new_BusRoute_group : FormGroup=this.fb.group({
              source_id: [items['location_id'], Validators.compose([Validators.required])], 
              sourceBoarding: this.fb.array([]),
            });
            this.busRoutesRecords.insert(arraylen, new_BusRoute_group);

           
           
           
            this.boardingdropingService.get(items['location_id']).subscribe(
              records=>{
                this.sourceLocationRecord = (<FormArray>this.busForm.controls['busRoutes']).at(arraylen).get('sourceBoarding') as FormArray;     
                let spoints="";
                this.boardings=records.data;     

                for(let SourceLoop of this.boardings)
                {
                  let arraylen_child = this.sourceLocationRecord.length;
                  foundValue=Array()
                  if(stoppages.find(obj=>obj.stoppage_name===SourceLoop.boarding_point))
                  {
                    var foundValue = stoppages.find(obj=>obj.stoppage_name===SourceLoop.boarding_point).stoppage_time;
                    let newSourcegroup: FormGroup = this.fb.group({
                      sourceLocation: [SourceLoop.boarding_point],
                      sourcechecked:["true"],
                      sourceTime:[foundValue]
                    });
                    this.sourceLocationRecord.insert(arraylen_child,newSourcegroup);
                  }
                  else
                  {
                    let newSourcegroup: FormGroup = this.fb.group({
                      sourceLocation: [SourceLoop.boarding_point],
                      sourcechecked:[null],
                      sourceTime:[null]
                    });
                    this.sourceLocationRecord.insert(arraylen_child,newSourcegroup);
                  }
                }
              }
            ); 
          }

        }
      }
    )
    this.busService.fetchBusRoutes(this.busRecord.id).subscribe(
      resp => {
        if(resp.status==1)
        {
          this.busRoutesInfoRecords=this.busForm.get('busRoutesInfo') as FormArray;
          this.busRoutesInfoRecords.clear();
          for(let singleRoute of resp.data)
          {
            
            
            let arrayroutelen = this.busRoutesInfoRecords.length;

            let new_busRoutesInfo_group : FormGroup=this.fb.group({
              from_location:[singleRoute.source_id],
              to_location:[singleRoute.destination_id],
              arr_days:[singleRoute.start_j_days],
              dep_days:[singleRoute.j_day],
              seater_fare:[singleRoute.base_seat_fare],
              sleeper_fare:[singleRoute.base_sleeper_fare]
            });
            this.selectedLocations[arrayroutelen]=[{id:singleRoute.source_id,location_name:singleRoute.source_id}];
            this.busRoutesInfoRecords.insert(arrayroutelen, new_busRoutesInfo_group);

           
            let stoppages=singleRoute['stoppage'];



          }
          
        }
      }
    );
    


  }
  BusClone(event : Event, id : any)
  {
    this.ModalHeading = "Bus Cloned";
    this.ModalBtn = "Add New";
    this.busRecord=this.buses[id] ;
    
    this.busForm = this.fb.group({
      id:[null],
      bus_operator_id: [this.busRecord.bus_operator_id, Validators.compose([Validators.required])],
      name: [this.busRecord.name, Validators.compose([Validators.required])],
      via: [this.busRecord.via, Validators.compose([Validators.required])],
      bus_description:[this.busRecord.bus_description],
      bus_type_id: [this.busRecord.bus_type_id, Validators.compose([Validators.required])],
      bus_sitting_id: [this.busRecord.bus_sitting_id, Validators.compose([Validators.required])],
      cancellationslabs_id: [this.busRecord.cancellationslabs_id, Validators.compose([Validators.required])],
      cancelation_points: [this.busRecord.cancelation_points],
      amenities:[null],
      safety:[null],
      bus_seat_layout_id: [this.busRecord.bus_seat_layout_id, Validators.compose([Validators.required])],
      bus_seat_layout_data:this.fb.array([
        this.fb.group({
          upperBerth:this.fb.array([]),//Upper Berth Items Will be Added Here
          lowerBerth:this.fb.array([])//Lower Berth Items will be added Here
        })
      ]),
      busRoutes: this.fb.array([]),
      busRoutesInfo:this.fb.array([]),
      bus_number: [this.busRecord.bus_number,Validators.compose([Validators.required,Validators.minLength(5),Validators.maxLength(15)])], 
      conductor_no: [this.data_conductor_no, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.required])], 
      c_sms_ticket: [this.data_c_sms_ticket], 
      c_sms_cancel: [this.data_c_sms_cancel], 
      manager_no: [this.data_manager_no, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.required])], 
      m_sms_ticket: [this.data_m_sms_ticket], 
      m_sms_cancel: [this.data_m_sms_cancel],
      owner_no: [this.data_owner_no, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.required])], 
      o_sms_ticket: [this.data_o_sms_ticket], 
      o_sms_cancel: [this.data_o_sms_cancel]
    });

    this.getCancellationRule(this.busRecord.cancellationslabs_id);

    this.busService.getSelectedSeat(this.busRecord.id).subscribe(
      seatData=>{
        this.selectedSeats=seatData.data;
      }
    );
   
    this.seatlayoutService.getByID(this.busRecord.bus_seat_layout_id).subscribe(
      resp=>{
        let counter=0;
        this.seatLayoutData = (<FormArray>this.busForm.controls['bus_seat_layout_data']) as FormArray;
        
        if(resp.data.lowerBerth!=undefined)
        {
          for(let lowerData of resp.data.lowerBerth)
          {
            let arraylen=this.seatLayoutData.length;
            let berthData: FormGroup = this.fb.group({ 
              lowerBerth: this.fb.array([
              ]),
              upperBerth: this.fb.array([
              ])
            });
            this.seatLayoutData.insert(arraylen, berthData); //PUSH BLANK LOWER BETH ARRAY TO seatLayoutData
            this.seatLayoutCol = (<FormArray>this.busForm.controls['bus_seat_layout_data']).at(counter).get('lowerBerth') as FormArray;
            for(let seatData of lowerData)
            {
              let checkedval="";
              let seatId="";
              for(let selectedSeat of this.selectedSeats)
              {
                if(selectedSeat.berth_type==seatData.berthType && selectedSeat.seat_type==seatData.seatType && selectedSeat.seat_number==seatData.seatText)
                {
                  checkedval="true";
                  seatId=selectedSeat.id;
                }
              }
              let collen=this.seatLayoutCol.length;
              let columnData: FormGroup = this.fb.group({ 
                seatText:[seatData.seatText],
                seatType:[seatData.seatType],
                berthType:[seatData.berthType],
                seatChecked:[checkedval],
                category:['0'],
                seatId:[seatId],
                busId:[this.busRecord.id]
              });
              this.seatLayoutCol.insert(collen, columnData);
              
            }
            counter++;
          }
          
        }
        if(resp.data.upperBerth!=undefined)
        {
          for(let upperData of resp.data.upperBerth)
          {
            let arraylen=this.seatLayoutData.length;
            let berthData: FormGroup = this.fb.group({ 
              lowerBerth: this.fb.array([
              ]),
              upperBerth: this.fb.array([
              ])
            });
            this.seatLayoutData.insert(arraylen, berthData); //PUSH BLANK LOWER BETH ARRAY TO seatLayoutData
            this.seatLayoutCol = (<FormArray>this.busForm.controls['bus_seat_layout_data']).at(counter).get('upperBerth') as FormArray;
            for(let seatData of upperData)
            {
              let checkedval="";
              let seatId="";
              for(let selectedSeat of this.selectedSeats)
              {
                if(selectedSeat.berth_type==seatData.berthType && selectedSeat.seat_type==seatData.seatType && selectedSeat.seat_number==seatData.seatText)
                {
                  checkedval="true";
                  seatId=selectedSeat.id;
                }
              }
              let collen=this.seatLayoutCol.length;
              let columnData: FormGroup = this.fb.group({ 
                seatText:[seatData.seatText],
                seatType:[seatData.seatType],
                berthType:[seatData.berthType],
                seatChecked:[checkedval],
                category:['0'],
                seatId:[seatId],
                busId:[this.busRecord.id]
              });
              this.seatLayoutCol.insert(collen, columnData);
            }
            counter++;
          }
        }
      }
    ); 

    this.busService.fetchBusContact(this.busRecord.id).subscribe(
      resp => {
        if(resp.status==1)
        {
            this.busContacts=resp.data;
            this.data_conductor_no=this.busContacts[0]['phone'];
            this.data_c_sms_ticket=this.busContacts[0]['booking_sms_send'];
            this.data_c_sms_cancel=this.busContacts[0]['cancel_sms_send'];         
            this.data_manager_no=this.busContacts[1]['phone'];
            this.data_m_sms_ticket=this.busContacts[1]['booking_sms_send'];
            this.data_m_sms_cancel=this.busContacts[1]['cancel_sms_send'];
            this.data_owner_no=this.busContacts[2]['phone'];
            this.data_o_sms_ticket=this.busContacts[2]['booking_sms_send'];
            this.data_o_sms_cancel=this.busContacts[2]['cancel_sms_send'];
            
            this.busForm.controls.conductor_no.setValue([this.data_conductor_no]);
            this.busForm.controls.c_sms_ticket.setValue([this.data_c_sms_ticket]);
            this.busForm.controls.c_sms_cancel.setValue([this.data_c_sms_cancel]);
            
            this.busForm.controls.manager_no.setValue([this.data_manager_no]);
            this.busForm.controls.m_sms_ticket.setValue([this.data_m_sms_ticket]);
            this.busForm.controls.m_sms_cancel.setValue([this.data_m_sms_cancel]);

            this.busForm.controls.owner_no.setValue([this.data_owner_no]);
            this.busForm.controls.o_sms_ticket.setValue([this.data_o_sms_ticket]);
            this.busForm.controls.o_sms_cancel.setValue([this.data_o_sms_cancel]);
        }
      }
    );

    this.busService.fetchBusTime(this.busRecord.id).subscribe(
      timing=>{
        if(timing.status==1)
        {
          
          this.busRoutesRecords=this.busForm.get('busRoutes') as FormArray;
          let stoppages=timing.data.stoppage_timing;
          //this.busRoutesRecords.clear();
          for(let items of timing.data.routes)
          {
            let arraylen = this.busRoutesRecords.length;
            let new_BusRoute_group : FormGroup=this.fb.group({
              source_id: [items['location_id'], Validators.compose([Validators.required])], 
              sourceBoarding: this.fb.array([]),
            });
            this.busRoutesRecords.insert(arraylen, new_BusRoute_group);
            this.boardingdropingService.get(items['location_id']).subscribe(
              records=>{
                this.sourceLocationRecord = (<FormArray>this.busForm.controls['busRoutes']).at(arraylen).get('sourceBoarding') as FormArray;     
                let spoints="";
                this.boardings=records.data;      
                for(let items of this.boardings)
                {
                  this.boardingRecord=items;
                  spoints=this.boardingRecord.boarding_point.split("#$");
                }
                let sourceLocations= spoints;
                
                for(let SourceLoop of this.boardings)
                {
                  let arraylen_child = this.sourceLocationRecord.length;
                  
                    let newSourcegroup: FormGroup = this.fb.group({
                      sourceLocation: [SourceLoop.boarding_point],
                      sourcechecked:[null],
                      sourceTime:[null]
                    });
                    this.sourceLocationRecord.insert(arraylen_child,newSourcegroup);
                  
                }
              }
            ); 
          }

        }
      }
    )
    this.busService.fetchBusRoutes(this.busRecord.id).subscribe(
      resp => {
        if(resp.status==1)
        {
          this.busRoutesInfoRecords=this.busForm.get('busRoutesInfo') as FormArray;
          this.busRoutesInfoRecords.clear();
          for(let singleRoute of resp.data)
          {
            
            
            let arrayroutelen = this.busRoutesInfoRecords.length;

            let new_busRoutesInfo_group : FormGroup=this.fb.group({
              from_location:[singleRoute.destination_id],
              to_location:[singleRoute.source_id],
              arr_days:[singleRoute.j_day],
              dep_days:[singleRoute.start_j_days],
              seater_fare:[singleRoute.base_seat_fare],
              sleeper_fare:[singleRoute.base_sleeper_fare]
            });
            this.selectedLocations[arrayroutelen]=[{id:singleRoute.source_id,location_name:singleRoute.source_id}];
            this.busRoutesInfoRecords.insert(arrayroutelen, new_busRoutesInfo_group);

           
            let stoppages=singleRoute['stoppage'];



          }
          
        }
      }
    );
  }
  updateExtraSeatLayout()
  {
    const data ={
      id:this.busRecord.id,
      user_id :'1',
      bus_id:this.busRecord.id,
      duration:this.busForm.value.duration_minuties,
      bus_seat_layout_data:this.busForm.value.bus_seat_layout_data,
      created_by:'Admin',
    };
    if(data.id!=null)
    {
      this.busService.updateExtraSeat(data.id,data).subscribe(
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
  }
  updateSeatLayout()
  {
    const data ={
      id:this.busRecord.id,
      user_id :'1',
      bus_id:this.busRecord.id,
      bus_seat_layout_data:this.busForm.value.bus_seat_layout_data,
      created_by:'Admin',
    };
    if(data.id!=null)
    {
      this.busService.updateSelectedData(data.id,data).subscribe(
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
  }
  public selectedSeats:any;
  editSeatLayout(event : Event, id : any)
  {
    this.busRecord=this.buses[id] ;
    this.busForm = this.fb.group({
      id:[this.busRecord.id],
      bus_description:[this.busRecord.bus_description],
      bus_operator_id: [this.busRecord.bus_operator_id, Validators.compose([Validators.required])],
      name: [this.busRecord.name, Validators.compose([Validators.required])],
      via: [this.busRecord.via, Validators.compose([Validators.required])],
      bus_type_id: [this.busRecord.bus_type_id, Validators.compose([Validators.required])],
      bus_sitting_id: [this.busRecord.bus_sitting_id, Validators.compose([Validators.required])],
      cancellationslabs_id: [this.busRecord.cancellationslabs_id, Validators.compose([Validators.required])],
      cancelation_points: [this.busRecord.cancelation_points],
      bus_seat_layout_id: [this.busRecord.bus_seat_layout_id, Validators.compose([Validators.required])],
      bus_seat_layout_data:this.fb.array([
        this.fb.group({
          upperBerth:this.fb.array([
          ]),//Upper Berth Items Will be Added Here
          lowerBerth:this.fb.array([
          ])//Lower Berth Items will be added Here
        })
      ]),
      // destinationDroppings: this.fb.array([]) 
    });
    this.ModalHeading = "Update Seat Layout";
    this.ModalBtn = "Update";
    

    this.seatlayoutService.readAll().subscribe(
      resp=>{
      this.seatLayouts=resp.data;
      }
    );
    this.busService.getSelectedSeat(this.busRecord.id).subscribe(
      seatData=>{
        this.selectedSeats=seatData.data;
      }
    );
   
    this.seatlayoutService.getByID(this.busRecord.bus_seat_layout_id).subscribe(
      resp=>{
        let counter=0;
        this.seatLayoutData = (<FormArray>this.busForm.controls['bus_seat_layout_data']) as FormArray;
        
        if(resp.data.lowerBerth!=undefined)
        {
          for(let lowerData of resp.data.lowerBerth)
          {
            let arraylen=this.seatLayoutData.length;
            let berthData: FormGroup = this.fb.group({ 
              lowerBerth: this.fb.array([
              ]),
              upperBerth: this.fb.array([
              ])
            });
            this.seatLayoutData.insert(arraylen, berthData); //PUSH BLANK LOWER BETH ARRAY TO seatLayoutData
            this.seatLayoutCol = (<FormArray>this.busForm.controls['bus_seat_layout_data']).at(counter).get('lowerBerth') as FormArray;
            for(let seatData of lowerData)
            {
              let checkedval="";
              let seatId="";
              for(let selectedSeat of this.selectedSeats)
              {
                if(selectedSeat.berth_type==seatData.berthType && selectedSeat.seat_type==seatData.seatType && selectedSeat.seat_number==seatData.seatText)
                {
                  checkedval="true";
                  seatId=selectedSeat.id;
                }
              }
              let collen=this.seatLayoutCol.length;
              let columnData: FormGroup = this.fb.group({ 
                seatText:[seatData.seatText],
                seatType:[seatData.seatType],
                berthType:[seatData.berthType],
                seatChecked:[checkedval],
                category:['0'],
                seatId:[seatId],
                busId:[this.busRecord.id]
              });
              this.seatLayoutCol.insert(collen, columnData);
              
            }
            counter++;
          }
          
        }
        if(resp.data.upperBerth!=undefined)
        {
          for(let upperData of resp.data.upperBerth)
          {
            let arraylen=this.seatLayoutData.length;
            let berthData: FormGroup = this.fb.group({ 
              lowerBerth: this.fb.array([
              ]),
              upperBerth: this.fb.array([
              ])
            });
            this.seatLayoutData.insert(arraylen, berthData); //PUSH BLANK LOWER BETH ARRAY TO seatLayoutData
            this.seatLayoutCol = (<FormArray>this.busForm.controls['bus_seat_layout_data']).at(counter).get('upperBerth') as FormArray;
            for(let seatData of upperData)
            {
              let checkedval="";
              let seatId="";
              for(let selectedSeat of this.selectedSeats)
              {
                if(selectedSeat.berth_type==seatData.berthType && selectedSeat.seat_type==seatData.seatType && selectedSeat.seat_number==seatData.seatText)
                {
                  checkedval="true";
                  seatId=selectedSeat.id;
                }
              }
              let collen=this.seatLayoutCol.length;
              let columnData: FormGroup = this.fb.group({ 
                seatText:[seatData.seatText],
                seatType:[seatData.seatType],
                berthType:[seatData.berthType],
                seatChecked:[checkedval],
                category:['0'],
                seatId:[seatId],
                busId:[this.busRecord.id]
              });
              this.seatLayoutCol.insert(collen, columnData);
            }
            counter++;
          }
        }
      }
    );    
  }

  editExtraSeat(event : Event, id : any)
  {
    this.busRecord=this.buses[id] ;
    this.busForm = this.fb.group({
      id:[this.busRecord.id],
      bus_description:[this.busRecord.bus_description],
      bus_operator_id: [this.busRecord.bus_operator_id, Validators.compose([Validators.required])],
      name: [this.busRecord.name, Validators.compose([Validators.required])],
      via: [this.busRecord.via, Validators.compose([Validators.required])],
      bus_type_id: [this.busRecord.bus_type_id, Validators.compose([Validators.required])],
      bus_sitting_id: [this.busRecord.bus_sitting_id, Validators.compose([Validators.required])],
      cancellationslabs_id: [this.busRecord.cancellationslabs_id, Validators.compose([Validators.required])],
      cancelation_points: [this.busRecord.cancelation_points],
      bus_seat_layout_id: [{value:this.busRecord.bus_seat_layout_id,disabled:true}, Validators.compose([Validators.required])],
      duration_minuties:[null,Validators.compose([Validators.required])],
      bus_seat_layout_data:this.fb.array([
        this.fb.group({
          upperBerth:this.fb.array([
          ]),//Upper Berth Items Will be Added Here
          lowerBerth:this.fb.array([
          ])//Lower Berth Items will be added Here
        })
      ]),
      // destinationDroppings: this.fb.array([]) 
    });
    this.ModalHeading = "Update Seat Layout";
    this.ModalBtn = "Update";
    

    this.seatlayoutService.readAll().subscribe(
      resp=>{
      this.seatLayouts=resp.data;
      }
    );
    this.busService.getSelectedSeat(this.busRecord.id).subscribe(
      seatData=>{
        this.selectedSeats=seatData.data;
      }
    );
   
    this.seatlayoutService.getByID(this.busRecord.bus_seat_layout_id).subscribe(
      resp=>{
        let counter=0;
        this.seatLayoutData = (<FormArray>this.busForm.controls['bus_seat_layout_data']) as FormArray;
        
        if(resp.data.lowerBerth!=undefined)
        {
          for(let lowerData of resp.data.lowerBerth)
          {
            let arraylen=this.seatLayoutData.length;
            let berthData: FormGroup = this.fb.group({ 
              lowerBerth: this.fb.array([
              ]),
              upperBerth: this.fb.array([
              ])
            });
            this.seatLayoutData.insert(arraylen, berthData); //PUSH BLANK LOWER BETH ARRAY TO seatLayoutData
            this.seatLayoutCol = (<FormArray>this.busForm.controls['bus_seat_layout_data']).at(counter).get('lowerBerth') as FormArray;
            for(let seatData of lowerData)
            {
              let checkedval="";
              let seatId="";
              let durationCheck=0;
              for(let selectedSeat of this.selectedSeats)
              {
                if(selectedSeat.berth_type==seatData.berthType && selectedSeat.seat_type==seatData.seatType && selectedSeat.seat_number==seatData.seatText)
                {
                  checkedval="1";
                  seatId=selectedSeat.id;
                  durationCheck=selectedSeat.duration;
                }
              }
              let collen=this.seatLayoutCol.length;
              
              if(checkedval=="1")
              {
                if(durationCheck==0)
                {
                  let columnData: FormGroup = this.fb.group({ 
                    seatText:[seatData.seatText],
                    seatType:[seatData.seatType],
                    berthType:[seatData.berthType],
                    seatChecked:[{value:true,disabled:true}],
                    category:['0'],
                    seatId:[seatId],
                    busId:[this.busRecord.id],
                    extraSeat:[durationCheck]
                  });
                  this.seatLayoutCol.insert(collen, columnData);
                }
                else
                {
                  let columnData: FormGroup = this.fb.group({ 
                    seatText:[seatData.seatText],
                    seatType:[seatData.seatType],
                    berthType:[seatData.berthType],
                    seatChecked:["true"],
                    category:['0'],
                    seatId:[seatId],
                    busId:[this.busRecord.id],
                    extraSeat:[durationCheck]
                  });
                  this.seatLayoutCol.insert(collen, columnData);
                }
                
              }
              else
              {
                let columnData: FormGroup = this.fb.group({ 
                  seatText:[seatData.seatText],
                  seatType:[seatData.seatType],
                  berthType:[seatData.berthType],
                  seatChecked:[checkedval],
                  category:['0'],
                  seatId:[seatId],
                  busId:[this.busRecord.id],
                  extraSeat:[durationCheck]
                });
                this.seatLayoutCol.insert(collen, columnData);
              }
              
              
              
            }
            counter++;
          }
          
        }
        if(resp.data.upperBerth!=undefined)
        {
          for(let upperData of resp.data.upperBerth)
          {
            let arraylen=this.seatLayoutData.length;
            let berthData: FormGroup = this.fb.group({ 
              lowerBerth: this.fb.array([
              ]),
              upperBerth: this.fb.array([
              ])
            });
            this.seatLayoutData.insert(arraylen, berthData); //PUSH BLANK LOWER BETH ARRAY TO seatLayoutData
            this.seatLayoutCol = (<FormArray>this.busForm.controls['bus_seat_layout_data']).at(counter).get('upperBerth') as FormArray;
            for(let seatData of upperData)
            {
              let checkedval="";
              let seatId="";
              let durationCheck=0;
              for(let selectedSeat of this.selectedSeats)
              {
                if(selectedSeat.berth_type==seatData.berthType && selectedSeat.seat_type==seatData.seatType && selectedSeat.seat_number==seatData.seatText)
                {
                  checkedval="1";
                  seatId=selectedSeat.id;
                  durationCheck=selectedSeat.duration;
                }
              }
              let collen=this.seatLayoutCol.length;
              
              if(checkedval=="1")
              {
                if(durationCheck==0)
                {
                  let columnData: FormGroup = this.fb.group({ 
                    seatText:[seatData.seatText],
                    seatType:[seatData.seatType],
                    berthType:[seatData.berthType],
                    seatChecked:[{value:true,disabled:true}],
                    category:['0'],
                    seatId:[seatId],
                    busId:[this.busRecord.id],
                    extraSeat:[durationCheck]
                  });
                  this.seatLayoutCol.insert(collen, columnData);
                }
                else
                {
                  let columnData: FormGroup = this.fb.group({ 
                    seatText:[seatData.seatText],
                    seatType:[seatData.seatType],
                    berthType:[seatData.berthType],
                    seatChecked:["true"],
                    category:['0'],
                    seatId:[seatId],
                    busId:[this.busRecord.id],
                    extraSeat:[durationCheck]
                  });
                  this.seatLayoutCol.insert(collen, columnData);
                }
                
              }
              else
              {
                let columnData: FormGroup = this.fb.group({ 
                  seatText:[seatData.seatText],
                  seatType:[seatData.seatType],
                  berthType:[seatData.berthType],
                  seatChecked:[checkedval],
                  category:['0'],
                  seatId:[seatId],
                  busId:[this.busRecord.id],
                  extraSeat:[durationCheck]
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
  editBus(event : Event, id : any)
  {
    this.busOperartorService.readAll().subscribe(
      record=>{
      this.operators=record.data;
      }
    );
    this.busTypeService.readAll().subscribe(
      rec=>{
      this.busTypes=rec.data;
      }
    );
    this.seatingtypeService.readAll().subscribe(
      records=>{
      this.busSeatingTypes=records.data;
      }
    );
    //Amenities Commented as Work Ongoing by PD Sir
    this.amenitiesService.all().subscribe(
      res=>{
        this.amenities=res.data;
      }
    );
    this.safetyService.readAll().subscribe(res=>{
      this.safetyies=res.data;
    });
    this.cancellationslabService.readAll().subscribe(
      resp=>{
      this.cancellationslabs=resp.data;
      }
    );
    
    this.ModalHeading = "Update Bus";
    this.ModalBtn = "Update";
    this.busRecord=this.buses[id] ;
    this.selectedAmenities=[
      {id:"426",name:"Water Bottle"},
      {id:"428",name:"Charging Point"},
      {id:"434",name:"Music System"}
    ];
    // this.busService.fetchBusAmenities(this.busRecord.id).subscribe(
    //   response=>{
    //     console.log(response);
    //     this.selectedAmenities=response.data;
    //   }
    // );
    this.cancellationslabService.getByID(this.busRecord.cancellationslabs_id).subscribe(
      resp=>{
        this.selectedcSlabRecord=resp.data;
        this.selectSlab = resp.data;
            
        for(let items of this.selectSlab)
        {
          this.selectedcSlabRecord=items;
          let durationData=this.selectedcSlabRecord.duration;
          durationData=durationData.replace("#$0-","#$Below ");
          durationData=durationData.replace(/-/g," to ");
          durationData=durationData.replace(/#/g," Hrs #");
          durationData=durationData.replace("Hrs #"," Hrs and Above #");
          durationData=durationData.concat(" Hrs");
         
          this.allDurations=durationData.split("#$");
          this.allDeductions=this.selectedcSlabRecord.deduction.split("#$");

        }

      }
    );
    this.busForm = this.fb.group({
      id:[this.busRecord.id],
      bus_description:[this.busRecord.bus_description],
      bus_operator_id: [this.busRecord.bus_operator_id, Validators.compose([Validators.required])],
      name: [this.busRecord.name, Validators.compose([Validators.required])],
      via: [this.busRecord.via, Validators.compose([Validators.required])],
      bus_type_id: [this.busRecord.bus_type_id, Validators.compose([Validators.required])],
      bus_sitting_id: [this.busRecord.bus_sitting_id, Validators.compose([Validators.required])],
      cancellationslabs_id: [this.busRecord.cancellationslabs_id, Validators.compose([Validators.required])],
      cancelation_points: [this.busRecord.cancelation_points],
      amenities:[this.amenities],
      safety:[this.busRecord.safety]
      // destinationDroppings: this.fb.array([]) 
    });
  }
  deleteBoardingDropping(event : Event, delitem:any)
  {
    this.busService.delete(delitem).subscribe(
      resp => {
        if(resp.status==1)
        {
            this.closebutton.nativeElement.click();
            this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
            this.rerender();
        }
        else{
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
        }
      }
    );    
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.busService.chngsts(stsitem).subscribe(
      resp => {
        if(resp.status==1)
        {
            //this.closebutton.nativeElement.click();
            this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
            this.rerender();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
      }
    );
  }

}
