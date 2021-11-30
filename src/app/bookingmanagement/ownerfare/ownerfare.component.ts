import { BusOperatorService } from './../../services/bus-operator.service';
import { Busoperator } from './../../model/busoperator';
import { BusstoppageService } from '../../services/busstoppage.service';
import { Busstoppage } from '../../model/busstoppage';
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Ownerfare } from '../../model/ownerfare';
import { NotificationService } from '../../services/notification.service';
import { OwnerfareService } from '../../services/ownerfare.service';
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
  public searchBy:any;


  public searchForm: FormGroup;
  pagination: any;
  all: any;


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
    // this.loadOwnerFareData();

    
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
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.ownerfareService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.ownerFares= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;
          // console.log( this.BusOperators);
        }
      );
    }
    else
    {
      this.ownerfareService.getAllData(data).subscribe(
        res => {
          this.ownerFares= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;

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
        this.buses.map((i:any) => { i.testing = i.name + ' - ' + i.bus_number +'  ('+i.from_location[0].name +' >> '+i.to_location[0].name+')' ; return i; });
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

// findSource(event:Event)
// {
//   let source_id=this.ownerFareForm.controls.source_id.value;
//   let destination_id=this.ownerFareForm.controls.destination_id.value;

//   if(source_id!="" && destination_id!="")
//   {
//     this.busService.findSource(source_id,destination_id).subscribe(
//       res=>{
//         this.buses=res.data;
//       }
//     );
//   }
//   else
//   {
//     this.busService.all().subscribe(
//       res=>{
//         this.buses=res.data;
//       }
//     );
//   }
// }

findSource()
{
  let source_id=this.ownerFareForm.controls.source_id.value;
  let destination_id=this.ownerFareForm.controls.destination_id.value;


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
      created_by:localStorage.getItem('USERNAME'),
      bus_id:this.ownerFareForm.value.bus_id,
    };
  //  console.log(data);
  //  return false;

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
          this.refresh();
        
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
              this.refresh();
            }
            else
            {                
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
            }
      });         
    }    
  }

  editOwnerFare(event : Event, id : any)
  {
    //this.loadServices();
    this.ownerFareRecord=this.ownerFares[id] ;

    // console.log(this.ownerFareRecord);

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

    if(this.ownerFareRecord.bus_operator_id!=null)
    {
      this.searchBy="operator";
      this.busService.getByOperaor(this.ownerFareRecord.bus_operator_id).subscribe(
        res=>{
          this.buses=res.data;
        }
      );
    }
    else if(this.ownerFareRecord.source_id!=null && this.ownerFareRecord.destination_id!=null)
    {
      
      this.searchBy="routes";
      // console.log(this.ownerFareRecord.source_id);
      // console.log(this.ownerFareRecord.destination_id);

      this.busService.findSource(this.ownerFareRecord.source_id,this.ownerFareRecord.destination_id).subscribe(
        res=>{
          this.buses=res.data;
        }
      );
      // console.log(this.buses);
    }
    else
    {
      this.busService.all().subscribe(
        res=>{
          this.buses=res.data;
        }
      );
    }

    var d = new Date(this.ownerFareRecord.date);
    let date = [d.getFullYear(),('0' + (d.getMonth() + 1)).slice(-2),('0' + d.getDate()).slice(-2)].join('-');

    this.ownerFareForm = this.fb.group({

      id:[this.ownerFareRecord.id],
      bus_id: [null],
      date: [date],
      seater_price: [this.ownerFareRecord.seater_price],
      sleeper_price: [this.ownerFareRecord.sleeper_price],
      reason: [this.ownerFareRecord.reason],
      source_id: [this.ownerFareRecord.source_id],
      destination_id: [this.ownerFareRecord.destination_id],
      bus_operator_id: [this.ownerFareRecord.bus_operator_id],
      searchBy: [this.searchBy],
    });
    let selBusses=[];
    for(let busData of this.ownerFareRecord.bus)
    {
      selBusses.push(JSON.parse(busData.id));
    }
    
    this.ownerFareForm.controls.bus_id.setValue(selBusses);

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

                this.refresh();
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
            this.refresh();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
      }
    );
  }
}
