
import { BusOperatorService } from './../../services/bus-operator.service';
import { Busoperator } from './../../model/busoperator';
import { BusstoppageService } from '../../services/busstoppage.service';
import { Busstoppage } from '../../model/busstoppage';
import { Component, OnInit,ViewChild,AfterViewInit} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Specialfare } from '../../model/specialfare';
import { SpecialfareWithBus } from '../../model/specialfarewithbus';
import { DataTablesResponse} from '../../model/datatable';
import { NotificationService } from '../../services/notification.service';
import { SpecialfareService } from '../../services/specialfare.service';
import { Bus} from '../../model/bus';``
import { BusService} from '../../services/bus.service';
import { FormArray,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../services/location.service';
import { Location } from '../../model/location';
//import {IOption} from 'ng-select';
@Component({
  selector: 'app-specialfare',
  templateUrl: './specialfare.component.html',
  styleUrls: ['./specialfare.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})

export class SpecialfareComponent implements OnInit {

  @ViewChild("addnew") addnew;
  public specialFareForm: FormGroup;
  public formConfirm: FormGroup;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  position = 'bottom-right'; 
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionsSpecialFare: any = {};
  dtSpecialFareOptions: any = {};
  dtSpecialFareOptionsData: any = {};
  specialfareWithBus: SpecialfareWithBus[];
  specialFares: Specialfare[];
  specialFareRecord: Specialfare;
  busstoppageRecord: Busstoppage;
  busoperators: any;
  buses:Bus[];
  locations: any;
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
  public searchBy:any;


  //simpleOption: Array<IOption>;
  selectedOperator: Array<string>;
  pricePattern = "^-?[0-9]*$";
  constructor(private specialfareService: SpecialfareService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private busService:BusService,private busOperatorService:BusOperatorService,private locationService:LocationService,private busstoppageService:BusstoppageService) { 
    this.isSubmit = false;
    this.specialFareRecord= {} as Specialfare;
    this.busstoppageRecord= {} as Busstoppage;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Special Fare";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    this.specialFareForm = this.fb.group({
      searchBy: ["operator"],
      id:[null],
      bus_operator_id: [null],
      source_id: [null],
      destination_id: [null],
      bus_id:[null],
      date: [null],
      seater_price: [null],
      sleeper_price: [null],
      reason: [null],
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    var currentTimeInSeconds=Math.floor(Date.now()/1000);
    console.log("Start Time loadSpecialFareData: "+currentTimeInSeconds);
    this.loadSpecialFareData();
     
  }
  loadSpecialFareData()
  {
    this.dtOptionsSpecialFare = {
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
      searchPlaceholder: "Find Special Fare",
      processing: "<img src='assets/images/loading.gif' width='30'>"
    },
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            Constants.BASE_URL+'/busSpecialFareDT',
            dataTablesParameters, {}
          ).subscribe(resp => {
            //console.log(resp.data);
            this.specialFares = resp.data.aaData;
            for(let items of this.specialFares)
            {
              this.specialFareRecord=items;
              
              this.specialFareRecord.name=this.specialFareRecord.name.split(",");
            }
            var currentTimeInSeconds=Math.floor(Date.now()/1000);
            console.log("End Time loadSpecialFareData: "+currentTimeInSeconds);
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
     
  }

  ResetAttributes()
  {
    this.specialFareRecord = {} as Specialfare;
    this.busstoppageRecord= {} as Busstoppage;
    this.specialFareForm = this.fb.group({
      searchBy: ["operator"],
      id:[null],
      bus_id:[null],
      bus_operator_id: [null],
      source_id: [null],
      destination_id: [null],
      date:[null],
      seater_price:['', Validators.compose([Validators.required, Validators.pattern(this.pricePattern),Validators.maxLength(10)])],
      sleeper_price:['', Validators.compose([Validators.required,Validators.pattern(this.pricePattern), Validators.maxLength(10)])],
      reason:['', Validators.compose([Validators.required,Validators.minLength(5),Validators.required,Validators.maxLength(50)])],
      
    });
    this.ModalHeading = "Add Special Fare";
    this.ModalBtn = "Save";
  }
  findSource()
  {
    let source_id=this.specialFareForm.controls.source_id.value;
    let destination_id=this.specialFareForm.controls.destination_id.value;

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
  addSpecialFare()
  {
    
    let id:any=this.specialFareForm.value.id;
    const data ={
     
      date:this.specialFareForm.value.date,
      seater_price:this.specialFareForm.value.seater_price,
      sleeper_price:this.specialFareForm.value.sleeper_price,
      reason:this.specialFareForm.value.reason,
      created_by:'Admin',
      bus_id:this.specialFareForm.value.bus_id,
      bus_operator_id:this.specialFareForm.value.bus_operator_id,
      source_id:this.specialFareForm.value.source_id,
      destination_id:this.specialFareForm.value.destination_id,
      searchBy: [this.searchBy],
    };
    //console.log(data);
    if(id==null)
    {
      this.specialfareService.create(data).subscribe(
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
     
      this.specialfareService.update(id,data).subscribe(
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
  editSpecialFare(event : Event, id : any)
  {
   
    this.specialFareRecord=this.specialFares[id] ;
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
    if(this.specialFareRecord.bus_operator_id!=null)
    {
      this.searchBy="operator";
      this.busService.getByOperaor(this.specialFareRecord.bus_operator_id).subscribe(
        res=>{
          this.buses=res.data;
        }
      );
    }
    else if(this.specialFareRecord.source_id!=null && this.specialFareRecord.destination_id!=null)
    {
      
      this.searchBy="routes";
      this.busService.findSource(this.specialFareRecord.source_id,this.specialFareRecord.destination_id).subscribe(
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
    
    
    var d = new Date(this.specialFareRecord.date);
    let date = [d.getFullYear(),('0' + (d.getMonth() + 1)).slice(-2),('0' + d.getDate()).slice(-2)].join('-');


   

   
    this.specialFareForm = this.fb.group({
    
      id:[this.specialFareRecord.id],
      bus_id: [this.specialFareRecord.bus_id],
      date: [date],
      seater_price: [this.specialFareRecord.seater_price],
      sleeper_price: [this.specialFareRecord.sleeper_price],
      reason: [this.specialFareRecord.reason],
      source_id: [this.specialFareRecord.source_id],
      destination_id: [this.specialFareRecord.destination_id],
      bus_operator_id: [this.specialFareRecord.bus_operator_id],
      searchBy: [this.searchBy],

    });
    if(this.specialFareRecord.bus_operator_id != null)
    {
      $("#operator").prop("checked","true");
      $("#routes").prop("checked","false");
    }
    else
    {
      $("#operator").prop("checked","false");
      $("#routes").prop("checked","true");
    }
    //console.log(this.specialFareForm);
    console.log(this.specialFareForm.value);

    this.ModalHeading = "Edit Special Fare";
    this.ModalBtn = "Update";
    
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
     this.specialfareService.delete(delitem).subscribe(
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
  deleteSpecialFare(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
    
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.specialfareService.chngsts(stsitem).subscribe(
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

