
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Busschedule } from '../../model/Busschedule';
import { Bus} from '../../model/bus';
import { NotificationService } from '../../services/notification.service';
import { BusscheduleService } from '../../services/busschedule.service';
import { BusOperatorService } from './../../services/bus-operator.service';
import { BusService } from './../../services/bus.service';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

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
  public searchForm: FormGroup;



  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  viewEntryDates: NgbModalRef;
 
  busSchedules: Busschedule[];
  busScheduleRecord: Busschedule;
  operators: any;
  buses: any;
  eDates: any;
  scheduleRecord:any;
  runningCycles= ['1', '2','3', '4','5','6','7'];
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
public showdates:any;
public selectedCar: number;

FormOne: FormGroup;
  pagination: any;
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
    this.busScheduleForm = this.fb.group({
      bus_id: '',
      bus_operator_id: '',
      running_cycle: '',
      entry_date: '',
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    // this.loadBusScheduleData();

    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });

    this.search();
    this.loadServices();
  }


  page(label:any){
    return label;
   }

   
  search(pageurl="")
  {      
    const data = { 
      name: this.searchForm.value.name,
      rows_number:this.searchForm.value.rows_number, 
      USER_BUS_OPERATOR_ID:localStorage.getItem('USER_BUS_OPERATOR_ID')
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.busscheduleService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.busSchedules= res.data.data.data;
          this.pagination= res.data.data;
          // console.log( this.busSchedules);
        }
      );
    }
    else
    {
      this.busscheduleService.getAllData(data).subscribe(
        res => {
          this.busSchedules= res.data.data.data;
          this.pagination= res.data.data;
          // console.log( res.data);
        }
      );
    }
  }


  refresh()
   {
    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });

     this.search();
    
   }


   title = 'angular-app';
  fileName= 'Bus-Schedule.xlsx';

  exportexcel(): void
  {
    
    /* pass here the table id */
    let element = document.getElementById('print-section');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
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



    const BusOperator={
      USER_BUS_OPERATOR_ID:localStorage.getItem("USER_BUS_OPERATOR_ID")
    };
    if(BusOperator.USER_BUS_OPERATOR_ID=="")
    {
      this.busOperatorService.readAll().subscribe(
        record=>{
        this.operators=record.data;
        }
      );
    }
    else
    {
      this.busOperatorService.readOne(BusOperator.USER_BUS_OPERATOR_ID).subscribe(
        record=>{
        this.operators=record.data;
        }
      );
    }
  }
  addBusSchedule()
  {
    let id:any=this.busScheduleRecord.id
  
    const data ={
      bus_id:this.busScheduleForm.value.bus_id,
      bus_operator_id:this.busScheduleForm.value.bus_operator_id,
      entry_date:this.busScheduleForm.value.entry_date,
      running_cycle:this.busScheduleForm.value.running_cycle,
      created_by:localStorage.getItem('USERNAME')
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
          this.refresh();  
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
              this.refresh();
            }
            else
            {                
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
            }
      });         
    }    
  }
  
  
  editBusSchedule(event : Event, id : any)
  {
    this.showdates='0';
    this.loadServices();

    this.busScheduleRecord=this.busSchedules[id];
    this.scheduleRecord=this.busScheduleRecord;
    console.log(this.scheduleRecord);
    // this.busScheduleForm.patchValue({
    //   //bus_id:this.busScheduleRecord.bus_id,
    //   bus_operator_id:this.busScheduleRecord.bus_operator_id,
    //   entry_date:this.busScheduleRecord.entry_date,
    //   running_cycle:this.busScheduleRecord.running_cycle,
    // });

    this.busScheduleForm = this.fb.group({
      id:this.busScheduleRecord.id,
      bus_id: [this.scheduleRecord.bus_id, Validators.compose([Validators.required])],
      bus_operator_id:this.scheduleRecord.bus.bus_operator_id,
      entry_date:this.scheduleRecord.bus_schedule_date[0].entry_date,
      cancelled_by:'Admin', 
      running_cycle:this.busScheduleForm.value.running_cycle,
    });
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
    // console.log(this.busScheduleRecord);
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

                this.refresh();
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
            this.refresh();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
      }
    );
  }
  
}