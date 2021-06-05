import { BusOperatorService } from './../../services/bus-operator.service';
import { Busoperator } from './../../model/busoperator';
import { BusstoppageService } from '../../services/busstoppage.service';
import { Busstoppage } from '../../model/busstoppage';
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Ownerfare } from '../../model/ownerfare';
import { DataTablesResponse} from '../../model/datatable';
import { NotificationService } from '../../services/notification.service';
import { OwnerfareService } from '../../services/ownerfare.service';
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
  selector: 'app-ownerfare',
  templateUrl: './ownerfare.component.html',
  styleUrls: ['./ownerfare.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class OwnerfareComponent implements OnInit {
  @ViewChild("addnew") addnew;
  public ownerFareForm: FormGroup;
  public formConfirm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  position = 'bottom-right'; 
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionsOwnerFare: any = {};
  dtOwnerFareOptions: any = {};
  dtOwnerFareOptionsData: any = {};
  ownerFares: Ownerfare[];
  ownerFareRecord: Ownerfare;
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

  constructor(private ownerfareService: OwnerfareService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private busService:BusService,private busOperatorService:BusOperatorService,private locationService:LocationService) { 
    this.isSubmit = false;
    this.ownerFareRecord= {} as Ownerfare;
    //this.busstoppageRecord= {} as Busstoppage;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Owner Fare";
    this.ModalBtn = "Save";
  }

  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    this.ownerFareForm = this.fb.group({
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
    this.loadOwnerFareData();
  }
  loadOwnerFareData()
  {
    this.dtOptionsOwnerFare = {
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
            Constants.BASE_URL+'/busOwnerFareDT',
            dataTablesParameters, {}
          ).subscribe(resp => {

            this.ownerFares = resp.data.aaData;
            for(let items of this.ownerFares)
            {
              this.ownerFareRecord=items;
              this.ownerFareRecord.name=this.ownerFareRecord.name.split(",");
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
    this.ownerFareRecord = {} as Ownerfare;
    //this.busstoppageRecord= {} as Busstoppage;
    this.ownerFareForm = this.fb.group({
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
    this.ModalHeading = "Add Owner Fare";
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
  addOwnerFare()
  {
    let id:any=this.ownerFareForm.value.id;
    const data ={
     
      date:this.ownerFareForm.value.date,
      seater_price:this.ownerFareForm.value.seater_price,
      sleeper_price:this.ownerFareForm.value.sleeper_price,
      reason:this.ownerFareForm.value.reason,
      bus_operator_id:this.ownerFareForm.value.bus_operator_id,
      source_id:this.ownerFareForm.value.source_id,
      destination_id:this.ownerFareForm.value.destination_id,
      created_by:'Admin',
      bus_id:this.ownerFareForm.value.bus_id,
    };
   // console.log(data);

    if(id==null)
    {
      this.ownerfareService.create(data).subscribe(
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
     
      this.ownerfareService.update(id,data).subscribe(
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
  editOwnerFare(event : Event, id : any)
  {
    this.loadServices();
    this.ownerFareRecord=this.ownerFares[id] ;
    this.ownerFareForm = this.fb.group({

      id:[this.ownerFareRecord.id],
      bus_id: [this.ownerFareRecord.bus_id],
      date: [this.ownerFareRecord.date],
      seater_price: [this.ownerFareRecord.seater_price],
      sleeper_price: [this.ownerFareRecord.sleeper_price],
      reason: [this.ownerFareRecord.reason],
      source_id: [this.ownerFareRecord.source_id],
      destination_id: [this.ownerFareRecord.destination_id],
      bus_operator_id: [this.ownerFareRecord.bus_operator_id],
      searchBy: [this.ownerFareRecord.searchBy],
    });
    this.ModalHeading = "Edit Owner Fare";
    this.ModalBtn = "Update";
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
     this.ownerfareService.delete(delitem).subscribe(
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
  deleteOwnerFare(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
    
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.ownerfareService.chngsts(stsitem).subscribe(
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
