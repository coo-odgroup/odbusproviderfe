
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Busschedule } from '../../model/Busschedule';
import { DataTablesResponse} from '../../model/datatable';
import { Bus} from '../../model/bus';
import { NotificationService } from '../../services/notification.service';
import { BusscheduleService } from '../../services/busschedule.service';
import { BusOperatorService } from './../../services/bus-operator.service';
import { BusService } from './../../services/bus.service';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-busschedule',
  templateUrl: './busschedule.component.html',
  styleUrls: ['./busschedule.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class BusscheduleComponent implements OnInit {  

  @ViewChild("addnew") addnew;
  public busScheduleForm: FormGroup;
  public formConfirm: FormGroup;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  viewEntryDates: NgbModalRef;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
 
  
  position = 'bottom-right'; 
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionsBusSchedule: any = {};
  dtBusSchedulesOptions: any = {};
  dtBusSchedulesOptionsData: any = {};
  busSchedules: Busschedule[];
  busScheduleRecord: Busschedule;
  operators: any;
  buses: any;
  eDates: any;
  runningCycles= ['1', '2','3', '4','5','6','7'];
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
public showdates:any;
public selectedCar: number;

// cars = [
//     { id: 1, name: 'Volvo' },
//     { id: 2, name: 'Saab' },
//     { id: 3, name: 'Opel' },
//     { id: 4, name: 'Audi' },
// ];
// options: any[] = [{_id: '1', status: 'waiting'},
// {_id: '2', status: 'open'},
// {_id: '3', status: 'in_progress'},
// {_id: '4', status: 'close'}];
FormOne: FormGroup;
  constructor(private busscheduleService: BusscheduleService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private busOperatorService:BusOperatorService,private busService:BusService)
   {
   // this.selectedCar = 1;
   
    this.isSubmit = false;
    this.busScheduleRecord= {} as Busschedule;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Bus Schedule";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ngOnInit() {


    /*this.FormOne = new FormGroup({
      status: new FormControl(null, Validators.required),
  });*/

  // let set_status = {_id: '2', status: 'open'};

  // setTimeout(() => {
  //   this.busScheduleForm.controls['status']
  //     this.busScheduleForm.controls['status'].setValue(set_status);
  //     console.log(this.busScheduleForm.controls['status'].value)
  // }, 1000);

    this.busScheduleForm = this.fb.group({
      bus_id: '',
      bus_operator_id: '',
      running_cycle: '',
      entry_date: '',
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    this.loadBusScheduleData();

    //console.log("***************"+ this.busScheduleForm.controls['carChoices']);
    /*setTimeout(() => {
      let selectedCar = {id: '2', name: 'Volvo'};
     this.busScheduleForm.controls['carChoices'].setValue(selectedCar);
  }, 1000);*/


  }
  loadBusScheduleData()
  {
    this.dtOptionsBusSchedule = {
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
      searchPlaceholder: "Find bus",
      processing: "<img src='assets/images/loading.gif' width='30'>"
    },
    ajax: (dataTablesParameters: any, callback) => {
      this.http
        .post<DataTablesResponse>(
          Constants.BASE_URL+'/busScheduleDT',
          dataTablesParameters, {}
        ).subscribe(resp => {
         // console.log(resp.data.aaData);
          this.busSchedules = resp.data.aaData;
          callback({
            recordsTotal: resp.data.iTotalRecords,
            recordsFiltered: resp.data.iTotalDisplayRecords,
            data: resp.data.aaData
          });
        });
    },
      columns: [ { data: 'id' },{ data: 'operatorName' },{ title:"Routes",data: 'routes' },{ data: 'name' },{ 
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
    this.showdates='0';
    this.busScheduleRecord= {} as Busschedule;
    this.busScheduleForm = this.fb.group({
      bus_id: ['',Validators.compose([Validators.required,])],
      bus_operator_id: ['',Validators.compose([Validators.required,])],
      running_cycle: ['',Validators.compose([Validators.required,])],
      entry_date: ['',Validators.compose([Validators.required,])],
    });
    this.ModalHeading = "Add BusSchedule";
    this.ModalBtn = "Save"; 
  }
  // getBusbyOperator(event)
  // { 
  //   if(event.value!="")
  //   {
  //   this.busOperatorService.getBusbyOperator(event.value).subscribe(
  //     resp=>{
  //     this.buses=resp.data;
  //     console.log(resp.data);
  //     });  
  //   }
  // }
  getBusbyOperator()
  {   
    //alert("getBusbyOperator: "+event.value);

    if(this.busScheduleForm.get('bus_operator_id').value!="")
    {
    this.busOperatorService.getBusbyOperator(this.busScheduleForm.get('bus_operator_id').value).subscribe(
      resp=>{
      this.buses=resp.data;
      }); 
    }
  }
  getBusScheduleEntryDatesByBusId(event)
  { 
    if(event.id!="")
    {
    this.busService.getBusScheduleEntryDates(event.id).subscribe(
      resp=>{
      this.eDates=resp.data;
      }); 
    }
  }

  loadServices(){

    this.busOperatorService.readAll().subscribe(
      resp=>{
        this.operators=resp.data;
      }
    );
  }
  addBusSchedule()
  {
    let id:any=this.busScheduleForm.value.id;
  
    const data ={
      bus_id:this.busScheduleForm.value.bus_id,
      bus_operator_id:this.busScheduleForm.value.bus_operator_id,
      entry_date:this.busScheduleForm.value.entry_date,
      running_cycle:this.busScheduleForm.value.running_cycle,
      created_by:'Admin',
    };
    if(id==null)
    {
      this.busscheduleService.create(data).subscribe(
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
      this.busscheduleService.update(id,data).subscribe(
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
   // console.log("xxxxxxxxxxxxxx"+ this.busScheduleForm.controls['carChoices']);
    
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
  editBusSchedule(event : Event, id : any)
  {
    this.showdates='0';
    this.loadServices();
    this.busScheduleRecord=this.busSchedules[id];

    this.busScheduleForm.patchValue({
      //bus_id:this.busScheduleRecord.bus_id,
      bus_operator_id:this.busScheduleRecord.bus_operator_id,
      entry_date:this.busScheduleRecord.entry_date,
      running_cycle:this.busScheduleRecord.running_cycle,
    });

    // this.busScheduleForm = this.fb.group({
    //   id:this.busScheduleRecord.id,
    //   bus_id: [this.busScheduleRecord.bus_id, Validators.compose([Validators.required])],
    //   bus_operator_id:this.busScheduleRecord.bus_operator_id,
    //   entry_date:this.busScheduleRecord.entry_date,
    //   cancelled_by:'Admin', 
    //   running_cycle:this.busScheduleForm.value.running_cycle,
    // });
    this.ModalHeading = "Edit Bus Schedule";
    this.ModalBtn = "Update";
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
 
  // openModalViewDates(content)
  // {
  //   this.viewEntryDates=this.modalService.open(content,{ scrollable: true, size: 'md' });
  // }
  showEntryDates(event : Event, id : any)
  {
    this.showdates='1';
    this.busScheduleRecord=this.busSchedules[id];
    // this.busScheduleForm = this.fb.group({
    //   entryDates:this.busScheduleForm.value.entryDates,
    // });
    this.ModalHeading = "Entry Dates";
  }

  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
     this.busscheduleService.delete(delitem).subscribe(
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
  deleteBusSchdule(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
    
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.busscheduleService.chngsts(stsitem).subscribe(
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