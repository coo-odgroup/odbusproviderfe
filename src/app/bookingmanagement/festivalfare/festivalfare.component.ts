
import { BusOperatorService } from './../../services/bus-operator.service';
import { Busoperator } from './../../model/busoperator';
import { BusstoppageService } from '../../services/busstoppage.service';
import { Busstoppage } from '../../model/busstoppage';
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Festivalfare } from '../../model/festivalfare';
import { DataTablesResponse} from '../../model/datatable';
import { NotificationService } from '../../services/notification.service';
import { FestivalfareService } from '../../services/festivalfare.service';
import { Bus} from '../../model/bus';
import { BusService} from '../../services/bus.service';
import { FormArray,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../services/location.service';
import { Location } from '../../model/location';
import {IOption} from 'ng-select';

@Component({
  selector: 'app-festivalfare',
  templateUrl: './festivalfare.component.html',
  styleUrls: ['./festivalfare.component.scss'],
  providers: [NgbModalConfig, NgbModal]

})
export class FestivalfareComponent implements OnInit {
  @ViewChild("addnew") addnew;
  public festivalFareForm: FormGroup;
  public formConfirm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  position = 'bottom-right'; 
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionsFestivalFare: any = {};
  dtFestivalFareOptions: any = {};
  dtFestivalFareOptionsData: any = {};
  festivalFares: Festivalfare[];
  festivalFareRecord: Festivalfare;
  //buses: Bus[];
  //busoperators: Busoperator[];
  //locations: Location[];
  //busstoppages: Busstoppage[];
  //busstoppageRecord: Busstoppage;
  buses :any;
  busoperators: any;
  locations: any;
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
  public searchBy:any;
  

  constructor(private festivalfareService: FestivalfareService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private busService:BusService,private busOperatorService:BusOperatorService,private locationService:LocationService) { 
    this.isSubmit = false;
    this.festivalFareRecord= {} as Festivalfare;
    //this.busstoppageRecord= {} as Busstoppage;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Festival Fare";
    this.ModalBtn = "Save";
    
  }

  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    this.festivalFareForm = this.fb.group({
      searchBy: ['operator'],
      bus_operator_id: [null],
      source_id: [null],
      destination_id: [null],
      id:[null],
      bus_id:[null],
      date: [null],
      seater_price: [null],
      sleeper_price: [null],
      reason: [null],
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    this.loadFestivalFareData();
  }
  loadFestivalFareData()
  {
    this.dtOptionsFestivalFare = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: 'lBfrtip',  
      order:["0","desc"], 
      aLengthMenu:[10, 25, 50, 100, "All"],  
      buttons: [
        { extend: 'copy', className: 'btn btn-sm btn-primary',init: function(api, node, config) {
            $(node).removeClass('dt-button')
          },
          exportOptions: {
            columns: "thead th:not(.noExport)"
           } 
        },
        { extend: 'print', className: 'btn btn-sm btn-danger',init: function(api, node, config) {
            $(node).removeClass('dt-button')
          },
          exportOptions: {
          columns: "thead th:not(.noExport)"
          } 
        },
        { extend: 'excel', className: 'btn btn-sm btn-info',init: function(api, node, config) {
          $(node).removeClass('dt-button')
          },
          exportOptions: {
          columns: "thead th:not(.noExport)"
          } 
        },
        { 
          extend: 'csv', className: 'btn btn-sm btn-success',init: function(api, node, config) {
            $(node).removeClass('dt-button')
          },
          exportOptions: {
          columns: "thead th:not(.noExport)"
          } 
        },
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
    language: {
      searchPlaceholder: "Find Owner Fare",
      processing: "<img src='assets/images/loading.gif' width='30'>"
    },
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            Constants.BASE_URL+'/festivalFareDT',
            dataTablesParameters, {}
          ).subscribe(resp => {

            this.festivalFares = resp.data.aaData;
            for(let items of this.festivalFares)
            {
              this.festivalFareRecord=items;
              this.festivalFareRecord.name=this.festivalFareRecord.name.split(",");
            }
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: resp.data.aaData
            });
          });
      },
      columns: [{ data: 'id' },{ data: 'name' },{ data: 'date' },{ data: 'seater_price' },{ data: 'sleeper_price' },{ title:"Created On",data: 'created_at' },{ 
        data: 'status',
        render:function(data)
        {
          return (data=="1")?"Active":"Pending"
        }  

      },{ title:'Action',data: null,orderable:false,className: "noExport"  }]            
    };

    this.busService.readAll().subscribe(
      res=>{
        this.buses=res.data;
      }
    );
  }
  ResetAttributes()
  {
    this.festivalFareRecord = {} as Festivalfare;
    //this.busstoppageRecord= {} as Busstoppage;
    this.festivalFareForm = this.fb.group({
      searchBy: ["operator"],
      bus_operator_id: [null],
      source_id: [null],
      destination_id: [null],
      id:[null],
      bus_id:[null],
      date:[null],
      seater_price:[null],
      sleeper_price:[null],
      reason:[null],
      
    });
    this.ModalHeading = "Add Festival Fare";
    this.ModalBtn = "Save";
  }

  loadServices(){
    this.busService.all().subscribe(
      res=>{
        this.buses=res.data;
      }
    );
    this.busOperatorService.readAll().subscribe(
    res=>{
      this.busoperators=res.data;
    }
    );
    this.locationService.readAll().subscribe(
      records=>{
        this.locations=records.data;
      }
    );
  }

findOperator(event:any)
{
  let operatorId=event.id;
  if(operatorId)
  {
    this.busService.getByOperaor(operatorId).subscribe(
      res=>{
        this.buses=res.data;
      }
    );
  }
  
}

findSource()
{
  let source_id=this.festivalFareForm.controls.source_id.value;
  let destination_id=this.festivalFareForm.controls.destination_id.value;


  if(source_id!="" && destination_id!="")
  {
    this.busService.findSource(source_id,destination_id).subscribe(
      res=>{
        this.buses=res.data;
      }
    );
  }
  else
  {
    this.busService.all().subscribe(
      res=>{
        this.buses=res.data;
      }
    );
  }
}

addfestivalFare()
  {
    let id:any=this.festivalFareForm.value.id;
    const data ={
     
      date:this.festivalFareForm.value.date,
      seater_price:this.festivalFareForm.value.seater_price,
      sleeper_price:this.festivalFareForm.value.sleeper_price,
      reason:this.festivalFareForm.value.reason,
      bus_operator_id:this.festivalFareForm.value.bus_operator_id,
      source_id:this.festivalFareForm.value.source_id,
      destination_id:this.festivalFareForm.value.destination_id,
      created_by:'Admin',
      bus_id:this.festivalFareForm.value.bus_id,
    };
  //  return false;

    if(id==null)
    {
      this.festivalfareService.create(data).subscribe(
        resp => {
      if(resp.status==1)
       {       
          
          this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
          this.modalReference.close();
          this.ResetAttributes();
          this.loadServices();
          this.rerender();
        
       }
       else
       {
          
        this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
       }
      });    
    }
    else{     
     
      this.festivalfareService.update(id,data).subscribe(
        resp => {
          if(resp.status==1)
            {                
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.ResetAttributes();
              this.rerender();
            }
            else
            {                
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
            }
      });         
    }    
    
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
  editfestivalFare(event : Event, id : any)
  {
    this.festivalFareRecord=this.festivalFares[id] ;
    this.busOperatorService.readAll().subscribe(
      res=>{
        this.busoperators=res.data;
      }
      );
    this.locationService.readAll().subscribe(
      records=>{
        this.locations=records.data;
      }
    );
    // return false;
    if(this.festivalFareRecord.bus_operator_id!=null)
    {
      this.searchBy="operator";
      this.busService.getByOperaor(this.festivalFareRecord.bus_operator_id).subscribe(
        res=>{
          this.buses=res.data;
        }
      );
    }
    else if(this.festivalFareRecord.source_id!=null && this.festivalFareRecord.destination_id!=null)
    {
      
      this.searchBy="routes";
      this.busService.findSource(this.festivalFareRecord.source_id,this.festivalFareRecord.destination_id).subscribe(
        res=>{
          this.buses=res.data;
        }
      );
    }
    else
    {
      this.busService.all().subscribe(
        res=>{
          this.buses=res.data;
        }
      );
    }
    
    
    var d = new Date(this.festivalFareRecord.date);
    let date = [d.getFullYear(),('0' + (d.getMonth() + 1)).slice(-2),('0' + d.getDate()).slice(-2)].join('-');
    this.festivalFareForm = this.fb.group({

      id:[this.festivalFareRecord.id],
      bus_id: [this.festivalFareRecord.bus_id],
      date: [date],
      seater_price: [this.festivalFareRecord.seater_price],
      sleeper_price: [this.festivalFareRecord.sleeper_price],
      reason: [this.festivalFareRecord.reason],
      source_id: [this.festivalFareRecord.source_id],
      destination_id: [this.festivalFareRecord.destination_id],
      bus_operator_id: [this.festivalFareRecord.bus_operator_id],
      searchBy: [this.searchBy],
    });
    

    this.ModalHeading = "Edit Festival Fare";
    this.ModalBtn = "Update";
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
     this.festivalfareService.delete(delitem).subscribe(
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
  deletefestivalFare(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
    
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.festivalfareService.chngsts(stsitem).subscribe(
      resp => {
        
        if(resp.status==1)
        {
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
