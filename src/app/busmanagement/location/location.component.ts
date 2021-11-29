import { Component, OnInit,ViewChild } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Location, LocationCode } from '../../model/location';
import { NotificationService } from '../../services/notification.service';
import {LocationService} from '../../services/location.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import {Constants} from '../../constant/constant';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class LocationComponent implements OnInit {  

  public form: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  pagination: any;

  userType:any;

  //@ViewChild('closebutton') closebutton;
  @ViewChild("addnew") addnew;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  locations: Location[];
  locationRecord: Location;
  locationCodes: LocationCode[];
  locationcodeRecord: LocationCode;
 
  public isSubmit: boolean;
  public ModalHeading:any;
  public ModalBtn:any;
  all: any;
 
  constructor(private http: HttpClient, private notificationService: NotificationService, private LocationService: LocationService,  private fb: FormBuilder,private modalService: NgbModal,config: NgbModalConfig) {
    this.isSubmit = false;
    this.locationRecord= {} as Location;
    this.locationcodeRecord= {} as LocationCode;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Location";
    this.ModalBtn = "Save"; 
    this.userType=localStorage.getItem('ROLE_ID');
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  // loadLocationData(){
  //   this.dtOptionsLocation = {
  //     pagingType: 'full_numbers',
  //     pageLength: 10,
  //     serverSide: true,
  //     processing: true,
  //     deferRender: true,
  //     dom: 'lBfrtip', 
  //     order:["0","desc"],  
  //     aLengthMenu:[10, 25, 50, 100, "All"], 
      
  //     buttons: [
  //       { extend: 'copy', className: 'btn btn-sm btn-primary',init: function(api, node, config) {
  //           $(node).removeClass('dt-button')
  //         },
  //         exportOptions: {
  //           columns: "thead th:not(.noExport)"
  //          } 
  //       },
  //       { extend: 'print', className: 'btn btn-sm btn-danger',init: function(api, node, config) {
  //         $(node).removeClass('dt-button')
  //      },
  //      exportOptions: {
  //        columns: "thead th:not(.noExport)"
  //       } 
  //     },
  //       { extend: 'excel', className: 'btn btn-sm btn-info',init: function(api, node, config) {
  //         $(node).removeClass('dt-button')
  //      },
  //      exportOptions: {
  //        columns: "thead th:not(.noExport)"
  //       }
  //      },
  //       { extend: 'csv', className: 'btn btn-sm btn-success',init: function(api, node, config) {
  //         $(node).removeClass('dt-button')
  //      },
  //      exportOptions: {
  //        columns: "thead th:not(.noExport)"
  //       } 
  //     },
  //       {
  //         text:"Add",
  //         className: 'btn btn-sm btn-warning',init: function(api, node, config) {
  //           $(node).removeClass('dt-button')
  //         },
  //         action:() => {
  //          this.addnew.nativeElement.click();
  //         }
  //       }
  //     ],
  //     language: {
  //       searchPlaceholder: "Find Location",
  //       processing: "<img src='assets/images/loading.gif' width='30'>"
  //     },
  //     ajax: (dataTablesParameters: any, callback) => {
  //       this.http
  //         .post<DataTablesResponse>(
  //           Constants.BASE_URL+'/locationsDT',
  //           dataTablesParameters, {}
  //         ).subscribe(resp => {
  //           this.locations = resp.data.aaData;
            
  //           callback({
  //             recordsTotal: resp.data.iTotalRecords,
  //             recordsFiltered: resp.data.iTotalDisplayRecords,
  //             //data: resp.data.aaData
  //             data: resp.data.aaData
  //           });
  //         });
          
  //     },
  //     columns: [ {data: 'id'},{ data: 'name'}, { data: 'synonym' },{ data: 'created_at' },{ data: 'updated_at' }, { 
  //       data: 'status',
  //       render:function(data)
  //       {
  //         return (data=="1")?"Active":"Pending"
  //       }
  //      }, 
  //     {
  //       title:'Action',data:null, orderable:false, className: "noExport" 
  //     }]      
      
  //   };
  // }
  ngOnInit() {
    this.form = this.fb.group({
      id:[null],
      name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      synonym: [null, Validators.compose([Validators.maxLength(15)])]
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });
    // this.loadLocationData();

    
    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: 50,
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
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.LocationService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.locations= res.data.data.data;
          this.pagination= res.data.data;
          this.all =res.data;
          // console.log( this.BusOperators);
        }
      );
    }
    else
    {
      this.LocationService.getAllData(data).subscribe(
        res => {
          this.locations= res.data.data.data;
          this.pagination= res.data.data;
          this.all =res.data;
          // console.log( this.locations);
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
  fileName= 'Location.xlsx';

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
    this.locationRecord = {} as Location;
    this.form = this.fb.group({
      id:[null],
      name: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])],
      synonym: [null, Validators.compose([Validators.maxLength(50)])]
    });
    this.ModalHeading = "Add Location";
    this.ModalBtn = "Save";
  }
  addLocation()
  {
    let id:any=this.form.value.id; 
    const data ={
      id:this.form.value.id,
      name:this.form.value.name,
      synonym:this.form.value.synonym,
      status:'1',
      created_by:localStorage.getItem('USERNAME') 
    };
    if(id==null)
    {
      this.LocationService.create(data).subscribe(
        resp => {
          if(resp.status==1)
          {
              //this.closebutton.nativeElement.click();
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:'success'});
              this.modalReference.close();
              this.ResetAttributes();
              this.refresh();
          }
          else{
              this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
          }
        }
      );
    }
    else{     
      this.LocationService.update(id,data).subscribe(
        resp => {
          if(resp.status==1)
          {
              //this.closebutton.nativeElement.click();
              this.modalReference.close();
              this.notificationService.addToast({title:'Success',msg:resp.message, type:'success'});
              this.ResetAttributes();
              this.refresh();
          }
          else{
              this.notificationService.addToast({title:'Error',msg:resp.message, type:'error'});
          }
        }
      );
    }    
  }

  editLocation(event : Event, id : any)
  {
    this.locationRecord=this.locations[id] ;
    this.form = this.fb.group({
      id:[this.locationRecord.id],
      name: [this.locationRecord.name, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])],
      synonym: [this.locationRecord.synonym, Validators.compose([Validators.maxLength(50)])]
    });
    this.ModalHeading = "Edit Location";
    this.ModalBtn = "Update";
  }
  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'lg' });
  }

  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
     this.LocationService.delete(delitem).subscribe(
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
  deleteLocation(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.LocationService.chngsts(stsitem).subscribe(
      resp => {
        if(resp.status==1)
        {
            //this.closebutton.nativeElement.click();
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