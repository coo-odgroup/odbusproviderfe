import { Component, OnInit, ViewChild } from '@angular/core';
import {Constants} from '../../constant/constant';
import { BusSequenceService} from '../../services/bus-sequence.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusSquence} from '../../model/bussequence';
import { DataTablesResponse} from '../../model/datatable';
import { NotificationService } from '../../services/notification.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormArray,FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bussequence',
  templateUrl: './bussequence.component.html',
  styleUrls: ['./bussequence.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class BussequenceComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  
  dtElement: DataTableDirective;

  position = 'bottom-right';
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  dtOptionbSeqence: any = {};
  dtSeatTypesOptions: any = {};
  dtSeatTypesOptionsData: any = {};
  busSequences: BusSquence[];
  busSquenceRecord: BusSquence;
  
  public isSubmit: boolean;
  public mesgdata:any;
  public searchForm: FormGroup;
  pagination: any;

  constructor(private http: HttpClient, private BusSequenceService:BusSequenceService, private fb: FormBuilder,  private notificationService: NotificationService, config: NgbModalConfig, private modalService: NgbModal) { 
    this.isSubmit = false;
    config.backdrop = 'static';
    config.keyboard = false;
    this.busSquenceRecord= {} as BusSquence;
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
  updateSequence(busId,sequence)
  {
    const data ={
      id:busId,
      sequence:sequence
    }
    if(data.id!=null)
    {
      this.BusSequenceService.update(data.id,data).subscribe(
        resp => {
          // console.log(resp);
          if(resp.status==1)
          {
            this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:'success'});
              this.refresh();
          }
          else{
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
          }
        }
      )}
  }
  
  ngOnInit() {
    // this.dtOptionbSeqence = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   serverSide: true,
    //   processing: true,
    //   dom: 'lBfrtip',  
    //   order:["0","desc"], 
    //   aLengthMenu:[10, 25, 50, 100, "All"],
    //   language: {
    //     searchPlaceholder: "Find Bus",
    //     processing: "<img src='assets/images/loading.gif' width='30'>"
    //   },
        
    //   buttons: [
    //     { 
    //       extend: 'copy', className: 'btn btn-sm btn-primary',init: function(api, node, config) {
    //         $(node).removeClass('dt-button')
    //       } 
    //     },
    //     { 
    //         extend: 'print', className: 'btn btn-sm btn-danger',init: function(api, node, config) 
    //         {
    //           $(node).removeClass('dt-button')
    //         } 
    //     },
    //     { 
    //         extend: 'excel', className: 'btn btn-sm btn-info',init: function(api, node, config) {
    //           $(node).removeClass('dt-button')
    //         } 
    //       }
    // ],
    //   ajax: (dataTablesParameters: any, callback) => {
    //     this.http
    //       .post<DataTablesResponse>(
    //         Constants.BASE_URL+'/busDT',
    //         dataTablesParameters, {}
    //       ).subscribe(resp => {
    //        // console.log(resp.data.aaData);
    //         this.busSequences = resp.data.aaData;
    //         callback({
    //           recordsTotal: resp.data.iTotalRecords,
    //           recordsFiltered: resp.data.iTotalDisplayRecords,
    //           data: resp.data.aaData
    //         });
    //       });
    //   },
    //   columns: [{ data: 'id' }, { data: 'name' }, { data: 'via' }, { data: 'bus_number' },{ data: 'sequence' }]      
      
    // }; 
  
  
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
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.BusSequenceService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.busSequences= res.data.data.data;
          this.pagination= res.data.data;
          // console.log( this.BusOperators);
        }
      );
    }
    else
    {
      this.BusSequenceService.getAllData(data).subscribe(
        res => {
          this.busSequences= res.data.data.data;
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
  fileName= 'Bus-Sequence.xlsx';

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


}
