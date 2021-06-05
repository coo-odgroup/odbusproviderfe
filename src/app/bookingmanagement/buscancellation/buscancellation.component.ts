
import { Component, OnInit, ViewChild,} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Buscancellation } from '../../model/buscancellation';
import { BusOperatorService } from './../../services/bus-operator.service';
import { BusService} from '../../services/bus.service';
import { DataTablesResponse} from '../../model/datatable';
import { NotificationService } from '../../services/notification.service';
import { BuscancellationService } from '../../services/buscancellation.service';
import { FormArray,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
 @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  position = 'bottom-right'; 
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionsBusCancellation: any = {};
  dtBusCancellationOptions: any = {};
  dtBusCancellationOptionsData: any = {};
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
    this.loadServices();
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }

  ngOnInit(): void {    
    this.loadBusCancellationData();
    this.createBusCancellationForm();
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

  loadBusCancellationData()
  {
    
    this.dtOptionsBusCancellation = {
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
      searchPlaceholder: "Find Cancelled Bus",
      processing: "<img src='assets/images/loading.gif'>"
    },
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            Constants.BASE_URL+'/busCancelledDT',
            dataTablesParameters, {}
          ).subscribe(resp => {
            //console.log(resp.data);
            this.busCancellations = resp.data.aaData;
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: resp.data.aaData
            });
          });
      },
      columns: [ { data: 'id' },{ data: 'operatorName' },{ data: 'name' },{ data: 'routes' },{ data: 'reason' },{ title:"Cancelled By",data: 'cancelled_by' },{ 
         data: 'status', 
         render:function(data)
         {
           return (data=="1")?"Active":"Pending"
         }   }
      ,{ title:'Action',data: null,orderable:false,className: "noExport"  }]            
    }; 
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.busCancellationForm.get('bus_operator_id').setValue(this.busCancellationRecord.operatorId);
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
    //console.log(this.busCancellationRecord);
    //console.log(this.busCancellationRecord.cancelledDates); 
  }
  // getBusbyOperator(event)
  // {  
  //   if(event.value!="")
  //   {
  //   this.busOperatorService.getBusbyOperator(event.value).subscribe(
  //     resp=>{
  //     this.buses=resp.data;
  //     });  
  //   }
  // }


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
     //reset the selected values
      const arr = <FormArray>this.busCancellationForm.controls.buses;
      arr.controls = [];
    this.busService.getBusScheduleEntryDatesFilter(this.busCancellationForm.value).subscribe(
      resp=>{
      this.busDatas=resp.data.busDatas;
      //console.log(this.busDatas);
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
        //this.cancellationDateRecord.removeAt(0);
      //console.log(this.busDatas);
        let arraylen = this.DatesRecord.length;
        for(let eDate of bData.entryDates)
        {
          let newDatesgroup: FormGroup = this.fb.group({
            entryDates: [eDate.entry_date],
           // busScheduleId:[eDate.busScheduleId],
            datechecked:[null],
          })
          this.DatesRecord.insert(arraylen, newDatesgroup); 
        }
        counter++;
        //console.log(this.DatesRecord);
      }
       
      }
    );  
  }
  
  loadServices(){
    this.loadOperators();
    
  }
  loadOperators()
  {
    this.busOperatorService.readAll().subscribe(
      resp=>{
        this.operators=resp.data;
        //console.log(this.operators);
      }
    );
  }
  addBusCancellation()
  {
    let id:any=this.busCancellationForm.value.id;
    const data ={
      //busOperatorname:this.busCancellationForm.value.busOperatorname,
      bus_operator_id:this.busCancellationForm.value.bus_operator_id,
      cancelled_by:'Admin',
      month:this.busCancellationForm.value.month,
      year:this.busCancellationForm.value.year,
      reason:this.busCancellationForm.value.reason,
      //BELOW ELEMENTS ARE ARRAY
      buses:this.busCancellationForm.value.buses,
    };console.log(data);
   
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
          this.rerender();
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
              this.rerender();
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
     console.log(this.busCancellationRecord);  
    //  this.busCancellationForm.get('bus_operator_id').setValue(this.busCancellationRecord.operatorId);
    this.busCancellationForm.patchValue({
    bus_operator_id:this.busCancellationRecord.operatorId,
    month:this.busCancellationRecord.month,
    year:this.busCancellationRecord.year,
    reason:this.busCancellationRecord.reason,
    //buses:this.fb.array([])
    busLists : this.busCancellationRecord.name
  });

  setTimeout(() => { 
    this.busCancellationForm.get('bus_operator_id').patchValue(this.busCancellationRecord.operatorId); 
    console.log("formControl value updated"); 
  }, 3000); 
 
  // call the change event's function after initialized the component. 
  setTimeout(() => { 
    this.onChange(); 
  }, 3500); 
    this.ModalHeading = "Edit Bus Cancellation";
    this.ModalBtn = "Update";  
    //reset the selected values
    const arr = <FormArray>this.busCancellationForm.controls.buses;
    arr.controls = [];
  }
  onChange()
  {
    //alert('Hello'+this.busCancellationForm.get('bus_operator_id').value);
  }
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
                this.rerender();
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
            this.rerender();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
        }
      }
    );
  }

}


