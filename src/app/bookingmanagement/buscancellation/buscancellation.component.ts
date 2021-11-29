
import { Component, OnInit, ViewChild,} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Buscancellation } from '../../model/buscancellation';
import { BusOperatorService } from './../../services/bus-operator.service';
import { BusService} from '../../services/bus.service';
import { NotificationService } from '../../services/notification.service';
import { BuscancellationService } from '../../services/buscancellation.service';
import { FormArray,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-buscancellation',
  templateUrl: './buscancellation.component.html',
  styleUrls: ['./buscancellation.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class BuscancellationComponent implements OnInit{

  @ViewChild("addnew") addnew;
  public busCancellationForm: FormGroup;
  isCitiesControlVisible = true;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  pagination: any;

  public selectedCancelBus:Array<any> = [];
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  busCancellations: Buscancellation[];
  busCancellationRecord: Buscancellation;
  buses: any;
  operators: any;
  busDatas:any;
  //selectedBus:any;
  cancelledDates:any;
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
  public months:any;
  public years:any;
  public reasons:any;
  public showdates:any;
  all: any;
  //getter for form array buses
  get busesFormGroup() {
    return this.busCancellationForm.get('buses') as FormArray;
  }
  constructor(private buscanCellationService: BuscancellationService,private http: HttpClient,private notificationService: NotificationService,private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private busOperatorService:BusOperatorService,private busService:BusService,) {
    this.isSubmit = false;
    this.busCancellationRecord= {} as Buscancellation;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Bus Cancellation";
    this.ModalBtn = "Save";
    var d = new Date();
    this.months= [
      {id:'01',name:'January'},{id:'02',name:'February'},{id:'03',name:'March'},{id:'04',name:'April'},
      {id:'05',name:'May'},{id:'06',name:'June'},{id:'07',name:'July'},{id:'08',name:'August'},
      {id:'09',name:'September'},{id:'10',name:'October'},{id:'11',name:'November'},{id:'12',name:'December'}   
      ];
     
    this.years=[
     {id:'1',name:d.getFullYear()},{id:'2',name:d.getFullYear()+1},
     {id:'3',name:d.getFullYear()+2},{id:'4',name:d.getFullYear()+3}
    ];
    this.reasons= [{id:'01',reason:'request from Owner'},{id:'02',reason:'request from Manager'},{id:'03',reason:'request from Conductor'}, {id:'04',reason:'request from Association'},{id:'05',reason:'bus breakdown'},{id:'06',reason:'others'}]; 
     }
   OpenModal(content) {
    
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }

  ngOnInit(): void {    
    // this.loadBusCancellationData();
    this.createBusCancellationForm();
    this.loadServices();

    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });

    this.search();

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
      this.buscanCellationService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.busCancellations= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;
          // console.log( this.BusOperators);
        }
      );
    }
    else
    {
      this.buscanCellationService.getAllData(data).subscribe(
        res => {
          this.busCancellations= res.data.data.data;
          this.pagination= res.data.data;
          this.all= res.data;
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
  fileName= 'Bus-Cancellation.xlsx';

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




  createBusCancellationForm()
  {
    this.busCancellationForm = this.fb.group({
      bus_operator_id: '',
      //busOperatorname:'',
      busLists:'',
      month: '',
      year: '',
      reason: '',
      buses: this.fb.array([
        this.fb.group({ 
          bus_id: [null],
          busName: [null],
          dateLists: this.fb.array([
            this.fb.group({ 
              //busScheduleId: [null],
              entryDates: [null],
              datechecked: [null],
              
            })
          ]),
       }),
      ]),
     
    });
  }

  
  ResetAttributes()
  {
    this.showdates='0';
    this.busCancellationRecord = {} as Buscancellation;
    this.busCancellationForm = this.fb.group({
      bus_operator_id: [null],
      //busOperatorname: [null],
      month: [null],
      year: [null],
      reason: [null],
      busLists:[null],
      buses: this.fb.array([
        this.fb.group({ 
          bus_id: [null],
          busName: [null],
          dateLists: this.fb.array([
            this.fb.group({ 
              //busScheduleId: [null],
              entryDates: [null],
              datechecked: [''],
            })
          ]),
       }),
      ]), 
    });
    this.ModalHeading = "Add Bus Cancellation";
    this.ModalBtn = "Save"; 
    //reset the selected values
    const arr = <FormArray>this.busCancellationForm.controls.buses;
      arr.controls = [];
  }
  showCancelledDates(event : Event, id : any)
  {
    this.showdates='1';
    this.busCancellationRecord=this.busCancellations[id];
  }
  getBusbyOperator()
  {   
    //alert("getBusbyOperator: "+event.value);
    if(this.busCancellationForm.get('bus_operator_id').value!="")
    {
    this.busOperatorService.getBusbyOperator(this.busCancellationForm.get('bus_operator_id').value).subscribe(
      resp=>{
      this.buses=resp.data;
      }); 
    }
  }

  public busesRecord:any;
  public DatesRecord:any;
  getBusScheduleEntryDatesFilter()
  {  
      if(this.busCancellationForm.value.month == null|| this.busCancellationForm.value.year==null)
        return false;
      const arr = <FormArray>this.busCancellationForm.controls.buses;
      arr.controls = [];
      //console.log(this.busCancellationForm.value);
      this.busService.getBusScheduleEntryDatesFilter(this.busCancellationForm.value).subscribe(
      response=>{
        console.log(response);
      this.busDatas=response.data.busDatas;
      let counter = 0;
      for(let bData of this.busDatas)
      {
        
        this.busesRecord = (<FormArray>this.busCancellationForm.controls['buses']) as FormArray;
        let busesGroup: FormGroup = this.fb.group({
          bus_id: [bData.bus_id], 
          busName: [bData.busName],
          dateLists: this.fb.array([
          ]),
        })
        this.busesRecord.insert(counter, busesGroup); 
        this.DatesRecord = (<FormArray>this.busCancellationForm.controls['buses']).at(counter).get('dateLists') as FormArray;

        let arraylen = this.DatesRecord.length;
        for(let eDate of bData.entryDates)
        {
          //console.log(eDate.entry_date);
          let newDatesgroup: FormGroup = this.fb.group({
            entryDates: [eDate.entry_date],
           // busScheduleId:[eDate.busScheduleId],
            datechecked:[null],
          })
          this.DatesRecord.insert(arraylen, newDatesgroup); 
        }
        counter++;
      }
      response=[];
      }
    );  
  }
  
  loadServices(){
    this.loadOperators();
    
  }
  loadOperators()
  {
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
  addBusCancellation()
  {
    let id:any=this.busCancellationRecord.id;
    const data ={
      bus_operator_id:this.busCancellationForm.value.bus_operator_id,
      cancelled_by:localStorage.getItem('USERNAME'),
      month:this.busCancellationForm.value.month,
      year:this.busCancellationForm.value.year,
      reason:this.busCancellationForm.value.reason,
      //BELOW ELEMENTS ARE ARRAY
      buses:this.busCancellationForm.value.buses,
    };
   
    if(id==null)
    {
      this.buscanCellationService.create(data).subscribe(
        resp => {
          if(resp.status==1)
       {  
          this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message,
             type:Constants.SuccessType});
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
    else{     
     
      this.buscanCellationService.update(id,data).subscribe(
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
  
  editBusCancellation(event : Event, id : any)
  {    
    this.showdates='0';
    this.busCancellationRecord=this.busCancellations[id] ;
     //console.log(this.busCancellationRecord);  
  //  console.log(this.selectedCancelBus);
    
    this.selectedCancelBus.push(JSON.parse(this.busCancellationRecord.bus_id));
    this.busCancellationForm.patchValue({
      bus_operator_id:this.busCancellationRecord.bus_operator_id,
      month:this.busCancellationRecord.month,
      year:this.busCancellationRecord.year,
      reason:this.busCancellationRecord.reason,
    
      busLists : this.selectedCancelBus
    });
    this.getBusbyOperator();
    
    // setTimeout(() => { 
    //   this.busCancellationForm.get('bus_operator_id').patchValue(this.busCancellationRecord.operatorId); 
    //   console.log("formControl value updated"); 
    // }, 3000); 
  
    // call the change event's function after initialized the component. 
    // setTimeout(() => { 
    //   this.onChange(); 
    // }, 3500); 
    this.ModalHeading = "Edit Bus Cancellation";
    this.ModalBtn = "Update";  
    //reset the selected values
    const arr = <FormArray>this.busCancellationForm.controls.buses;
    arr.controls = [];
    this.getBusScheduleEntryDatesFilter();
  }
  // onChange()
  // {
  //   //alert('Hello'+this.busCancellationForm.get('bus_operator_id').value);
  // }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
     this.buscanCellationService.delete(delitem).subscribe(
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
  deleteBusCancellation(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
  }
  changeStatus(event : Event, stsitem:any)
  {
    this.buscanCellationService.chngsts(stsitem).subscribe(
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


