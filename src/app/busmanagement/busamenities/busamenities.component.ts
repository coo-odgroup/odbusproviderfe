import { Component, OnInit , ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Busamenities} from '../../model/busamenities';
import {DataTablesResponse} from '../../model/datatable';
import {BusAmenitiesService} from '../../services/bus-amenities.service';
import { NotificationService } from '../../services/notification.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import {Amenities} from '../../model/amenities';
import {AmenitiesService} from '../../services/amenities.service';
import {Bus} from '../../model/bus';
import {BusService} from '../../services/bus.service';
import {Constants} from '../../constant/constant';
@Component({
  selector: 'app-busamenities',
  templateUrl: './busamenities.component.html',
  styleUrls: ['./busamenities.component.scss']
})
export class BusamenitiesComponent implements OnInit {
  @ViewChild("closebutton") closebutton;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  
  position = 'bottom-right';
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionBusAmenities: DataTables.Settings = {};
  dtSeatTypesOptions: any = {};
  dtSeatTypesOptionsData: any = {};
  endpoint = 'http://127.0.0.1:8000/api';
  BusAmenities: Busamenities[];
  BusAmenitiesRecord: Busamenities;

  amenities: Amenities[];
  amenitiesRecord: Amenities;

  bus: Bus[];
  busRecord: Bus;


  public isSubmit: boolean;
  public mesgdata:any;
  
  constructor(private http: HttpClient,private BusAmenitiesService:BusAmenitiesService, private notificationService: NotificationService,private AmenitiesService:AmenitiesService,private BusService:BusService) {
    this.isSubmit = false;
    this.BusAmenitiesRecord= {} as Busamenities;    
  }
  ngOnInit() {
    this.dtOptionBusAmenities = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: 'lBfrtip',   
      //buttons: ['copy','print','csv'],
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            Constants.BASE_URL+'/busAmenitiesDT',
            dataTablesParameters, {}
          ).subscribe(resp => {
           // console.log(resp.data.aaData);
            this.BusAmenities = resp.data.aaData;
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: []
            });
          });

          // this.http
          // .get<any>(
          //   'http://127.0.0.1:8000/api/Amenities',
          // ).subscribe(res => {
          //   this.amenities = res.result;
          //   // console.log( this.amenities);
            
          // });


      },
      columns: [{ data: 'id' }, { data: 'bus_id' }, { data: 'amenities_id' },{ data: 'created_at' },{ data: 'created_by' }, { data: 'status' },{ data: 'actions' }]      
      
    }; 
    this.AmenitiesService.all().subscribe(
      res => {
        this.amenities = res.result;
      });

    this.BusService.all().subscribe(
      res => {
        this.bus = res.data;
        // console.log(this.bus);
      });
  }
  ResetAttributes()
  {
    this.BusAmenitiesRecord={} as Busamenities;
    
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
  addBusAmenities()
  {
    const data ={
      id:this.BusAmenitiesRecord.id,
      bus_id:this.BusAmenitiesRecord.bus_id,
      amenities_id:this.BusAmenitiesRecord.amenities_id,
      status:'1',
      created_by:'Admin',
    };
    if(data.id==null)
    {

      this.BusAmenitiesService.create(data).subscribe(
        resp => {
          if(resp.status==1)
          {
              this.closebutton.nativeElement.click();
              this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
              this.rerender();
          }
          else{
              this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
          }
        }
      );
    }
    else{
      
      this.BusAmenitiesService.update(data.id,data).subscribe(
        resp => {
          if(resp.status==1)
          {
              this.closebutton.nativeElement.click();
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
  editBusAmenities(event : Event, id : any)
  {
    this.BusAmenitiesRecord=this.BusAmenities[id] ;
    //console.log(this.cancellationSlabs);
  }
  deleteBusAmenities(event : Event, delitem:any)
  {
    
    this.BusAmenitiesService.delete(delitem).subscribe(
      resp => {
        if(resp.status==1)
        {
            this.closebutton.nativeElement.click();
            //info, success, wait, error, warning.
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
