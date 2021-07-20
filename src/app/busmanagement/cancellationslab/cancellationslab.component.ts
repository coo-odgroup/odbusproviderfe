import { Component, OnInit, ViewChild } from '@angular/core';
import { CancellationslabService} from '../../services/cancellationslab.service';
import {Constants} from '../../constant/constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Cancellationslab} from '../../model/cancellationslab';
import { DataTablesResponse} from '../../model/datatable';
import { NotificationService } from '../../services/notification.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cancellationslab',
  templateUrl: './cancellationslab.component.html',
  styleUrls: ['./cancellationslab.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class CancellationslabComponent implements OnInit {
  
  public form: FormGroup;
  public formConfirm: FormGroup;
  public CancelationSlabList: FormArray;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  @ViewChild("addnew") addnew;
  //@ViewChild("closebutton") closebutton;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  
  position = 'bottom-right';
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtOptioncSlab: any = {};
  dtSeatTypesOptions: any = {};
  dtSeatTypesOptionsData: any = {};
  cancellationSlabs: Cancellationslab[];
  cancellationSlabRecord: Cancellationslab;

  //durationPattern = "^[0-9--][0-9_-]{3,7}$";
  durationPattern = "^[0-9]{1,3}-[0-9]{1,3}"
  deductionPattern = /^(\d{0,2}(\.[0-9]{1,2})?|100)$/;
  //deductionPattern = /^(\d{0,2}(\.\d{1,2})?|100(\.00?)?)$/;
  
  
 
  public isSubmit: boolean;
  public mesgdata:any;
  public allDurations:string;
  public allDeductions:string;
  public ModalHeading:any;
  public ModalBtn:any;
  // returns all form groups under Cancellation Slab
  get slabFormGroup() {
    return this.form.get('slabs') as FormArray;
  }
  constructor(private http: HttpClient, private cSlabService:CancellationslabService, private notificationService: NotificationService,private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal) {
    this.isSubmit = false;
    this.cancellationSlabRecord= {} as Cancellationslab;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add CancelationSlab";
    this.ModalBtn = "Save";
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'lg' });
  }
 
  loadcSlab()
  {
    this.dtOptioncSlab = {
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
      searchPlaceholder: "Find CancellationSlab",
      processing: "<img src='assets/images/loading.gif' width='30'>"
    },
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            Constants.BASE_URL+'/cancellationslabsDT',
            dataTablesParameters, {}
          ).subscribe(resp => {
            this.cancellationSlabs = resp.data.aaData;
            console.log(this.cancellationSlabs);
            for(let items of this.cancellationSlabs)
            {
              this.cancellationSlabRecord=items;
              this.cancellationSlabRecord.duration="";
              this.cancellationSlabRecord.deduction="";
            }
            
            //this.cancellationSlabs.duration;
            callback({
              recordsTotal: resp.data.iTotalRecords,
              recordsFiltered: resp.data.iTotalDisplayRecords,
              data: resp.data.aaData
            });
          });
      },
      columns: [{ data: 'id' }, { data: 'api_id' }, { data: 'rule_name' },{ 
        title:'Duration (Hour)',
        data: 'duration',
        render:function(data){
          let bdata="";
          for(let ditems of data)
          {
            bdata+=(bdata=="")?ditems:", <br />"+ditems;
          }
          return bdata;
        }
      },
        { 
          title:"Deduction (%)",data: 'deduction',
        render:function(data){
        let bdata="";
        for(let ditems of data)
        {
          bdata+=(bdata=="")?ditems:", <br />"+ditems;
        }
        return bdata;
      }
        }, 
        {
           data: 'status',
           render:function(data)
        {
          return (data=="1")?"Active":"Pending"
        } 
           },{ title:'Action',data: null, orderable:false,className: "noExport" }]      
      
    }; 
    
  }
  ngOnInit(){
    this.loadcSlab();
    this.form = this.fb.group({
      id:[null],
      api_id: [null, Validators.compose([Validators.required,Validators.minLength(2)])],
      rule_name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])],
      slabs: this.fb.array([this.createSlab()]),
    });
     // set CancellationSlablist to this field
  this.CancelationSlabList = this.form.get('slabs') as FormArray;
  this.formConfirm=this.fb.group({
    id:[null]
  });

  }
  // CanclationSlab formgroup
  createSlab(): FormGroup {
    return this.fb.group({ 
      duration: ['', [Validators.required, Validators.pattern(this.durationPattern)]],
      deduction: ['', [Validators.required, Validators.pattern(this.deductionPattern)]],
    });
  }
  // add a CancelationSlab form group
  addSlabs() {
    this.CancelationSlabList.push(this.createSlab());
  }
  // remove cancelationSlab from group
  removeSlab(index) {  
    this.CancelationSlabList.removeAt(index);
  }
  // get the formgroup under form array
  getSlabsFormGroup(index): FormGroup {
    const formGroup = this.CancelationSlabList.controls[index] as FormGroup;
    return formGroup;
  }
  ResetAttributes()
  {
    this.cancellationSlabRecord = {
      rule_name:''
    } as Cancellationslab;

    this.form = this.fb.group({
      id:[null],
      api_id: [null, Validators.compose([Validators.required,Validators.minLength(2)])],
      rule_name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])],
      slabs: this.fb.array([this.createSlab()]),
    });
    this.CancelationSlabList = this.form.get('slabs') as FormArray;
    this.ModalHeading = "Add CancelationSlab";
    this.ModalBtn = "Save";
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
  addCancellationSlab()
  {
    this.allDurations="";
    this.allDeductions="";
    let id:any=this.cancellationSlabRecord.id; 
    const data ={
      api_id:this.form.value.api_id,
      rule_name:this.form.value.rule_name,
      slabs:this.form.value.slabs
    };

    if(id==null)
    {
      this.cSlabService.create(data).subscribe(
        resp => {
          if(resp.status==1)
          {
              //this.closebutton.nativeElement.click();
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.ResetAttributes();
              this.rerender();
          }
          else{
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
          }
        }
      );
    }
    else{
      this.cSlabService.update(id,data).subscribe(
        resp => {
          if(resp.status==1)
          {
              //this.closebutton.nativeElement.click();
              this.notificationService.addToast({title:Constants.RecordUpdateTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.ResetAttributes();
              this.rerender();
          }
          else{
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
          }
        }
      );
    }  
  }
  editcSlabs(event : Event, id : any)
  {
    this.cancellationSlabRecord=this.cancellationSlabs[id] ; 
    this.form = this.fb.group({
      id:[this.cancellationSlabRecord.id],
      api_id: [this.cancellationSlabRecord.api_id, Validators.compose([Validators.required,Validators.minLength(2)])],
      rule_name: [this.cancellationSlabRecord.rule_name, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      slabs: this.fb.array([this.createSlab()]),
    });
    this.CancelationSlabList = this.form.get('slabs') as FormArray;
    let editSlab=[];
    //let editDuration=[];
    //let editDeduction=[];
    this.CancelationSlabList.removeAt(0);
    let cCount=0;
    for(let items of this.cancellationSlabRecord.slab_info)
    {
      this.CancelationSlabList.push(this.fb.group({ 
        duration: [items.duration, Validators.compose([Validators.required,Validators.minLength(2)])],
        deduction: [items.deduction, Validators.compose([Validators.required,Validators.minLength(2)])]
      }));
      cCount++;
    }
    
    this.form.value.slabs=editSlab; 
     //this.form.value.slabs=editDuration;  
     //this.form.value.slabs=editDeduction; 
     this.ModalHeading = "Edit CancelationSlab";
     this.ModalBtn = "Update";
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'sm' });
  }
  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
     this.cSlabService.delete(delitem).subscribe(
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
  deleteSlab(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.cSlabService.chngsts(stsitem).subscribe(
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
