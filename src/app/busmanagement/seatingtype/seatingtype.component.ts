import { Component, OnInit,ViewChild } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Seatingtype } from '../../model/seatingtype';
import { DataTablesResponse} from '../../model/datatable';
import { NotificationService } from '../../services/notification.service';
import { SeatingtypeService } from '../../services/seatingtype.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Constants } from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-seatingtype',
  templateUrl: './seatingtype.component.html',
  styleUrls: ['./seatingtype.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class SeatingtypeComponent implements OnInit {  

  @ViewChild("addnew") addnew;
  public form: FormGroup;
  public formConfirm: FormGroup;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
 
  
  position = 'bottom-right'; 
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptionsSeatingType: any = {};
  dtSeatTypesOptions: any = {};
  dtSeatTypesOptionsData: any = {};
  seatingTypes: Seatingtype[];
  seatingTypeRecord: Seatingtype;
 
  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;
  constructor(private seatingTypeService: SeatingtypeService,private http: HttpClient,private notificationService: NotificationService, private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal)
   {
    this.isSubmit = false;
    this.seatingTypeRecord= {} as Seatingtype;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Seating Type";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  
  ngOnInit() {
    this.form = this.fb.group({
      id:[null],
      name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    this.loadSeatData();
  }
  loadSeatData()
  {
    
    this.dtOptionsSeatingType = {
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
      searchPlaceholder: "Find Seating Type",
      processing: "<img src='assets/images/loading.gif' width='30'>"
    },
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            Constants.BASE_URL+'/BusSittingDT',
            dataTablesParameters, {}
          ).subscribe(resp => {
           // console.log(resp.data.aaData);
            this.seatingTypes = resp.data.aaData;
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: resp.data.aaData
            });
          });
      },
      columns: [ { data: 'id' },{ data: 'name' },{ title:"Created By",data: 'created_by' },{ data: 'created_at' },{ data: 'updated_at' },{ 
        data: 'status',
        render:function(data)
        {
          return (data=="1")?"Active":"Pending"
        }  

      },{ title:'Action',data: null,orderable:false,className: "noExport"  }]            
    }; 
  }
  ResetAttriutes()
  {
    
    this.seatingTypeRecord = {} as Seatingtype;
    this.form = this.fb.group({
      id:[null],
      name: ['',Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])]
      //name: ['',Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50),seatingTypeValidator.cannotContainSpace])]
    });
    this.ModalHeading = "Add Seating Type";
    this.ModalBtn = "Save";
    
  }
  formatText(event:Event)
  {
    this.form.value.name=this.form.value.name.trim();
    this.form = this.fb.group({
      id:[this.form.value.id],
      name: [this.form.value.name]
    });
  }
  addSeatingType()
  {

    let id:any=this.form.value.id;
    const data ={
      name:this.form.value.name
      
    };
    if(id==null)
    {
      this.seatingTypeService.create(data).subscribe(
        resp => {
          if(resp.status==1)
       {
          
          this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
          this.modalReference.close();
          this.ResetAttriutes();
          this.rerender();
         
       }
       else
       {
          
        this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
       }
      });    
    }
    else{     
     
      this.seatingTypeService.update(id,data).subscribe(
        resp => {
          if(resp.status==1)
            {                
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.ResetAttriutes();
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
  editSeatingType(event : Event, id : any)
  {
    this.seatingTypeRecord=this.seatingTypes[id] ;
    this.form = this.fb.group({
      id:[this.seatingTypeRecord.id],
      name: [this.seatingTypeRecord.name, Validators.compose([Validators.required,Validators.minLength(2)])],
    });
    this.ModalHeading = "Edit Seating Type";
    this.ModalBtn = "Update";
    
    //console.log(this.seatingTypes);
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
     this.seatingTypeService.delete(delitem).subscribe(
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
  deleteSeatingType(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
    
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.seatingTypeService.chngsts(stsitem).subscribe(
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