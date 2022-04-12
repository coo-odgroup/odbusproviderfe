
import { BusOperatorService } from './../../services/bus-operator.service';
import { Busoperator } from './../../model/busoperator';
import { BusstoppageService } from '../../services/busstoppage.service';
import { Busstoppage } from '../../model/busstoppage';
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Festivalfare } from '../../model/festivalfare';
import { NotificationService } from '../../services/notification.service';
import { FestivalfareService } from '../../services/festivalfare.service';
import { Bus} from '../../model/bus';
import { BusService} from '../../services/bus.service';
import { FormArray,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../services/location.service';
import { Location } from '../../model/location';
import {IOption} from 'ng-select';
import * as XLSX from 'xlsx';
import { debounceTime, map } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import {Input,Output,EventEmitter} from '@angular/core';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';



const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;


@Component({
  selector: 'app-festivalfare',
  templateUrl: './festivalfare.component.html',
  styleUrls: ['./festivalfare.component.scss'],
  providers: [NgbModalConfig, NgbModal],
  styles: [`
  .custom-day {
    text-align: center;
    padding: 0.185rem 0.25rem;
    display: inline-block;
    height: 2rem;
    width: 2rem;
  }
  .custom-day.range, .custom-day:hover {
    background-color: rgb(2, 117, 216);
    color: white;
  }
  .custom-day.faded {
    background-color: rgba(2, 117, 216, 0.5);
  }
  .custom-day.selected{  
    background-color: rgba(255, 255, 0, .5);
      
  }
`]

})
export class FestivalfareComponent implements OnInit {
  @ViewChild("addnew") addnew;
  public festivalFareForm: FormGroup;
  public editfestivalFareForm: FormGroup;
  public formConfirm: FormGroup;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;


  public searchForm: FormGroup;
  pagination: any;

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
  all: any;
  

  constructor(private festivalfareService: FestivalfareService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private busService:BusService,private busOperatorService:BusOperatorService,private locationService:LocationService , private spinner: NgxSpinnerService,) { 
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
    this.spinner.show();
    this.editfestivalFareForm = this.fb.group({
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
    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
      fromDate:[null],
      toDate:[null],
      bus_operator_id:[null],
    });


    this.search();
    this.loadServices();

    // this.loadFestivalFareData();
  }

  page(label:any){
    return label;
   }

   
  search(pageurl="")
  {     
      this.spinner.show(); 
    const data = { 
      name: this.searchForm.value.name,
      rows_number: this.searchForm.value.rows_number,
      fromDate:this.searchForm.value.fromDate,
      toDate:this.searchForm.value.toDate,
      bus_operator_id:this.searchForm.value.bus_operator_id,
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.festivalfareService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.festivalFares= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;
          // console.log( this.BusOperators);
          this.spinner.hide();
        }
      );
    }
    else
    {
      this.festivalfareService.getAllData(data).subscribe(
        res => {
          this.festivalFares= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;
          // console.log( res.data);
          this.spinner.hide();
        }
      );
    }
  }


  refresh()
   {
    this.spinner.show();
    this.searchForm = this.fb.group({
      name: [null],
      rows_number: Constants.RecordLimit,
      fromDate:[null],
      toDate:[null],
      bus_operator_id:[null],
    });

     this.search();

    
   }


  title = 'angular-app';
  fileName= 'Owner-Fare.xlsx';

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
    this.datesSelected=[];
    this.festivalFareRecord = {} as Festivalfare;
    //this.busstoppageRecord= {} as Busstoppage;
    this.editfestivalFareForm = this.fb.group({
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
        // console.log(this.buses);
        this.buses.map((i:any) => { i.testing = i.name + ' - ' + i.bus_number +'('+i.from_location[0].name +'>>'+i.to_location[0].name+')' ; return i; });
      }
    );
    this.busOperatorService.readAll().subscribe(
    res=>{
      this.busoperators=res.data;
      this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });

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
    this.spinner.show();
    this.busService.getByOperaor(operatorId).subscribe(
      res=>{
        this.buses=res.data;        
        this.buses.map((i:any) => { i.testing = i.name + ' - ' + i.bus_number +'('+i.from_location[0].name +'>>'+i.to_location[0].name+')' ; return i; });
        this.spinner.hide();
      }
    );
  }
  
}

findSource()
{
  let source_id=this.festivalFareForm.controls.source_id.value;
  let destination_id=this.festivalFareForm.controls.destination_id.value;


  if(source_id!=null && destination_id!=null)
  {
    this.spinner.show();
    this.busService.findSource(source_id,destination_id).subscribe(
      res=>{
        this.buses=res.data;
        this.buses.map((i:any) => { i.testing = i.name + ' - ' + i.bus_number +'('+i.from_location[0].name +'>>'+i.to_location[0].name+')' ; return i; });
        this.spinner.hide();
      }
    );
  }
  else
  {
    this.busService.all().subscribe(
      res=>{
        this.buses=res.data;
        this.buses.map((i:any) => { i.testing = i.name + ' - ' + i.bus_number +'('+i.from_location[0].name +'>>'+i.to_location[0].name+')' ; return i; });

      }
    );
  }
}

addfestivalFare()
  {
    this.spinner.show();
    let id:any=this.editfestivalFareForm.value.id;
   
  //  return false;

      if(id==null)
      {
        if(this.festivalFareForm.value.date == null){
          this.notificationService.addToast({ title: 'Error', msg: 'Please Select Date', type: 'error' });
          this.spinner.hide();
          return;
        }
        else{
          const data ={     
            date:this.festivalFareForm.value.date,
            seater_price:this.festivalFareForm.value.seater_price,
            sleeper_price:this.festivalFareForm.value.sleeper_price,
            reason:this.festivalFareForm.value.reason,
            bus_operator_id:this.festivalFareForm.value.bus_operator_id,
            source_id:this.festivalFareForm.value.source_id,
            destination_id:this.festivalFareForm.value.destination_id,
            created_by:localStorage.getItem('USERNAME'),
            bus_id:this.festivalFareForm.value.bus_id,
          };
          this.festivalfareService.create(data).subscribe(
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
            this.spinner.hide();
          }
          });  

        }          
      }
      else{    
          const data ={     
            date:this.editfestivalFareForm.value.date,
            seater_price:this.editfestivalFareForm.value.seater_price,
            sleeper_price:this.editfestivalFareForm.value.sleeper_price,
            reason:this.editfestivalFareForm.value.reason,
            bus_operator_id:this.editfestivalFareForm.value.bus_operator_id,
            source_id:this.editfestivalFareForm.value.source_id,
            destination_id:this.editfestivalFareForm.value.destination_id,
            created_by:localStorage.getItem('USERNAME'),
            bus_id:this.editfestivalFareForm.value.bus_id,
          };
         
      
        this.festivalfareService.update(id,data).subscribe(
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
                this.spinner.hide();
              }
        });         
      }    
    
  }

  

  editfestivalFare(event : Event, id : any)
  {
    this.spinner.show();
    this.festivalFareRecord=this.festivalFares[id] ;
    this.busOperatorService.readAll().subscribe(
      res=>{
        this.busoperators=res.data;
      this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });

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
        this.buses.map((i:any) => { i.testing = i.name + ' - ' + i.bus_number +'('+i.from_location[0].name +'>>'+i.to_location[0].name+')' ; return i; });
        this.spinner.hide();
        }
      );
    }
    else if(this.festivalFareRecord.source_id!=null && this.festivalFareRecord.destination_id!=null)
    {
      
      this.searchBy="routes";
      this.busService.findSource(this.festivalFareRecord.source_id,this.festivalFareRecord.destination_id).subscribe(
        res=>{
          this.buses=res.data;
        this.buses.map((i:any) => { i.testing = i.name + ' - ' + i.bus_number +'('+i.from_location[0].name +'>>'+i.to_location[0].name+')' ; return i; });
        this.spinner.hide();
        }
      );
    }
    else
    {
      this.busService.all().subscribe(
        res=>{
          this.buses=res.data;
        this.buses.map((i:any) => { i.testing = i.name + ' - ' + i.bus_number +'('+i.from_location[0].name +'>>'+i.to_location[0].name+')' ; return i; });
        this.spinner.hide();
        }
      );
    }
    
    
    var d = new Date(this.festivalFareRecord.date);
    let date = [d.getFullYear(),('0' + (d.getMonth() + 1)).slice(-2),('0' + d.getDate()).slice(-2)].join('-');
    // console.log((this.festivalFareRecord.bus));
    this.editfestivalFareForm = this.fb.group({

      id:[this.festivalFareRecord.id],
      bus_id: [null],
      date: [date],
      seater_price: [this.festivalFareRecord.seater_price],
      sleeper_price: [this.festivalFareRecord.sleeper_price],
      reason: [this.festivalFareRecord.reason],
      source_id: [this.festivalFareRecord.source_id],
      destination_id: [this.festivalFareRecord.destination_id],
      bus_operator_id: [this.festivalFareRecord.bus_operator_id],
      searchBy: [this.searchBy],
    });
    let selBusses=[];
    for(let busData of this.festivalFareRecord.bus)
    {
      selBusses.push(JSON.parse(busData.id));
    }
    
    this.editfestivalFareForm.controls.bus_id.setValue(selBusses);

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

                this.refresh();
            }
            else{
               
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
              this.spinner.hide();
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
    this.spinner.show();
    this.festivalfareService.chngsts(stsitem).subscribe(
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

  hoveredDate: NgbDateStruct;

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;

  _datesSelected:NgbDateStruct[]=[]; 

  @Input()
  set datesSelected(value:NgbDateStruct[])  
  {
     this._datesSelected=value;
     
  }
  get datesSelected():NgbDateStruct[]
  {
    
    return this._datesSelected?this._datesSelected:[];
  }

  @Output() datesSelectedChange=new EventEmitter<NgbDateStruct[]>();

 

  onDateSelection(event:any,date: NgbDateStruct) {

    event.target.parentElement.blur();  //make that not appear the outline
    if (!this.fromDate && !this.toDate) {
      if (event.ctrlKey==true)  //If is CrtlKey pressed
        this.fromDate = date;
      else
        this.addDate(date);

      this.datesSelectedChange.emit(this.datesSelected);

    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
      this.addRangeDate(this.fromDate,this.toDate);
      this.fromDate=null;
      this.toDate=null;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  addDate(date:NgbDateStruct)
  {
      let index=this.datesSelected.findIndex(f=>f.day==date.day && f.month==date.month && f.year==date.year);
      if (index>=0)       //If exist, remove the date
        this.datesSelected.splice(index,1);
      else   //a simple push
        this.datesSelected.push(date);
  
        this.festivalFareForm.controls['date'].setValue(this.datesSelected);
    }
    addRangeDate(fromDate:NgbDateStruct,toDate:NgbDateStruct)
    {
        //We get the getTime() of the dates from and to
        let from=new Date(fromDate.year+"-"+fromDate.month+"-"+fromDate.day).getTime();
        let to=new Date(toDate.year+"-"+toDate.month+"-"+toDate.day).getTime();
        for (let time=from;time<=to;time+=(24*60*60*1000)) //add one day
        {
            let date=new Date(time);
            //javascript getMonth give 0 to January, 1, to February...
            this.addDate({year:date.getFullYear(),month:date.getMonth()+1,day:date.getDate()});
        }   
        this.datesSelectedChange.emit(this.datesSelected);
    }
    //return true if is selected
    isDateSelected(date:NgbDateStruct)
    {
        return (this.datesSelected.findIndex(f=>f.day==date.day && f.month==date.month && f.year==date.year)>=0);
    }
  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);



}
