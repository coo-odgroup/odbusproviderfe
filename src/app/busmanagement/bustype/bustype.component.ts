import { Component, OnInit,ViewChild } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { BusTypeService } from '../../services/bus-type.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Bustype} from '../../model/bustype';
import { DataTablesResponse} from '../../model/datatable';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import{Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-bustype',
  templateUrl: './bustype.component.html',
  styleUrls: ['./bustype.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class BustypeComponent implements OnInit {  

  public form: FormGroup;
  public formConfirm: FormGroup;
  //@ViewChild('closebutton') closebutton;
  @ViewChild("addnew") addnew;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  position = 'bottom-right'; 
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionsSeatType: any = {};
  dtSeatTypesOptions: any = {};
  dtSeatTypesOptionsData: any = {};
  busTypes: Bustype[];
  busTypeRecord: Bustype;
  public isSubmit: boolean;

  public ModalHeading:any;
  public ModalBtn:any;
  
  constructor(private busTypeService: BusTypeService,private http: HttpClient,private notificationService: NotificationService,private fb: FormBuilder,private modalService: NgbModal,config: NgbModalConfig) {
    this.isSubmit = false;
    this.busTypeRecord= {} as Bustype;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Bus Type";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
   
   loadBusType(){
    this.dtOptionsSeatType = {
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
      { extend: 'csv', className: 'btn btn-sm btn-success',init: function(api, node, config) {
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
      searchPlaceholder: "Find BusTypes",
      processing: "<img src='assets/images/loading.gif' width='30'>"
    },
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            Constants.BASE_URL+'/BusTypeDT',
            dataTablesParameters, {}
          ).subscribe(resp => {           
            this.busTypes = resp.data.aaData;
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: resp.data.aaData
            });
          });
      },
      columns: [{ data: 'id' }, 
      { 
        title: 'Type',
        data: 'type',
        render:function(data)
        {
          return (data=="1")?"AC":"NON AC";
        }
      }, 
      { title: 'Name',data: 'name' },{ title: 'Created By',data: 'created_by' },{ title: 'Created At',data: 'created_at' },{ title: 'Updated At',data: 'updated_at' }, { 
        title: 'Status',
        data: 'status',
        render:function(data)
        {
          return (data=="1")?"Active":"Pending"
        }
       }, 
      {  
        title:'Action',data: null, orderable:false,className: "noExport" }]      
    };
   }
 
   ngOnInit() { 
    this.form = this.fb.group({
      id:[null],
      name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      type: [null, Validators.compose([Validators.required])],
    });  
    this.formConfirm=this.fb.group({
      id:[null]
    });
     this.loadBusType(); 
    
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
  ResetAttributes()
  {
    this.busTypeRecord = {
      name:''
    } as Bustype;
    this.form = this.fb.group({
      id:[null],
      name: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])],
      type: ['0', Validators.compose([Validators.required])],
    });
    this.ModalHeading = "Add Bus Type";
    this.ModalBtn = "Save";
  }
  
  addBusTypes(){  

    let id:any=this.busTypeRecord.id;  
    const data = {
      type:this.form.value.type,
      name:this.form.value.name  
    };

    if(id==null)
    {
      this.busTypeService.create(data).subscribe(
        resp => {
          if(resp.status==1)
       {
          this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
          this.modalReference.close();
          //this.closebutton.nativeElement.click();
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
     
      this.busTypeService.update(id,data).subscribe(
        resp => {
          if(resp.status==1)
            {
                this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
                //this.closebutton.nativeElement.click();
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
  editBusTypes(event : Event, id : any)
  {
    this.busTypeRecord=this.busTypes[id] ;
    this.form = this.fb.group({
      id:[this.busTypeRecord.id],
      name: [this.busTypeRecord.name, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])],
      type: [this.busTypeRecord.type,Validators.compose([Validators.required])]
    });
    this.ModalHeading = "Edit Bus Type";
    this.ModalBtn = "Update";
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }

  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
     this.busTypeService.delete(delitem).subscribe(
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
  deleteBusType(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.busTypeService.chngsts(stsitem).subscribe(
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
