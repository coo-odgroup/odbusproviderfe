import { BusOperatorService } from './../../services/bus-operator.service';
import { Busoperator } from './../../model/busoperator';
import { BusstoppageService } from '../../services/busstoppage.service';
import { Busstoppage } from '../../model/busstoppage';
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Ownerfare } from '../../model/ownerfare';
import { DataTablesResponse} from '../../model/datatable';
import { NotificationService } from '../../services/notification.service';
import { OwnerpaymentService } from '../../services/ownerpayment.service';
import { Ownerpayment} from '../../model/ownerpayment';
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
  selector: 'app-ownerpayment',
  templateUrl: './ownerpayment.component.html',
  styleUrls: ['./ownerpayment.component.scss']
})
export class OwnerpaymentComponent implements OnInit {

  @ViewChild("addnew") addnew;
  public ownerpaymentForm: FormGroup;
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
  
  ownerpayments: Ownerpayment[];
  ownerpaymentRecord: Ownerpayment;
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

  constructor(private ownerpaymentservice: OwnerpaymentService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal,private busService:BusService,private busOperatorService:BusOperatorService,private locationService:LocationService) { 
    this.isSubmit = false;
    this.ownerpaymentRecord= {} as Ownerpayment;
    //this.busstoppageRecord= {} as Busstoppage;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Owner Payment";
    this.ModalBtn = "Save";
  }

  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
  ngOnInit(): void {
    this.ownerpaymentForm = this.fb.group({     
      bus_operator_id: [null],
      transaction_id:[null],      
      date: [null],
      amount: [null],
      remark: [null]
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
            Constants.BASE_URL+'/getownerpaymentDT',
            dataTablesParameters, {}
          ).subscribe(resp => {

            this.ownerpayments = resp.data.aaData;
            console.log(this.ownerpayments);

            for(let items of this.ownerpayments)
            {
              this.ownerpaymentRecord=items;
              // this.ownerpaymentRecord.name=this.ownerpaymentRecord.name.split(",");
            }
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: resp.data.aaData
            });
          });
      },
      columns: [{ data: 'id' },
      { data: 'bus_operator.operator_name' },
      { data: 'payment_date' },
      { data: 'amount' },
      { data: 'transaction_id' },
      { data: 'remark' },
      { data: 'created_at' }]            
    };

    this.busService.readAll().subscribe(
      res=>{
        this.buses=res.data;
      }
    );
  }
  ResetAttributes()
  {
    this.ownerpaymentRecord = {} as Ownerpayment;
    //this.busstoppageRecord= {} as Busstoppage;
    this.ownerpaymentForm = this.fb.group({
      bus_operator_id: [null],      
      date: [null],
      transaction_id:[null],
      amount: [null],
      remark: [null]
      
    });
    this.ModalHeading = "Add Owner Payment";
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

// findSource(event:Event)
// {
//   let source_id=this.ownerpaymentForm.controls.source_id.value;
//   let destination_id=this.ownerpaymentForm.controls.destination_id.value;

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
  let source_id=this.ownerpaymentForm.controls.source_id.value;
  let destination_id=this.ownerpaymentForm.controls.destination_id.value;


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
    const data ={
      bus_operator_id: this.ownerpaymentForm.value.bus_operator_id,      
      date: this.ownerpaymentForm.value.date,
      transaction_id:this.ownerpaymentForm.value.transaction_id,
      amount: this.ownerpaymentForm.value.amount,
      remark: this.ownerpaymentForm.value.remark,
      created_by:'Admin',
    };
  //  console.log(data);
  //  return false;
   this.ownerpaymentservice.create(data).subscribe(
     resp => {
      if(resp.status==1)
         { 
      this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
          this.modalReference.close();
          this.ResetAttributes();
          this.loadServices();
          this.rerender();
         }
     }
   )    
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
 
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  // deleteRecord()
  // {
  //   let delitem=this.formConfirm.value.id;
  //    this.ownerfareService.delete(delitem).subscribe(
  //     resp => {
  //       if(resp.status==1)
  //           {
  //               this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
  //               this.confirmDialogReference.close();

  //               this.rerender();
  //           }
  //           else{
               
  //             this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
  //           }
  //     }); 
  // }
  deleteOwnerFare(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
    
  }

  // changeStatus(event : Event, stsitem:any)
  // {
  //   this.ownerfareService.chngsts(stsitem).subscribe(
  //     resp => {
        
  //       if(resp.status==1)
  //       {
  //           this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
  //           this.rerender();
  //       }
  //       else{
  //           this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
  //       }
  //     }
  //   );
  // }

}

