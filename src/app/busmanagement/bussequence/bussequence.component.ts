import { Component, OnInit, ViewChild } from '@angular/core';
import {Constants} from '../../constant/constant';
import { BusSequenceService} from '../../services/bus-sequence.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusSquence} from '../../model/bussequence';
import { NotificationService } from '../../services/notification.service';
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

  busSequences: BusSquence[];
  busSquenceRecord: BusSquence;
  
  public isSubmit: boolean;
  public mesgdata:any;
  public searchForm: FormGroup;
  pagination: any;
  all: any;

  constructor(private http: HttpClient, private BusSequenceService:BusSequenceService, private fb: FormBuilder,  private notificationService: NotificationService, config: NgbModalConfig, private modalService: NgbModal) { 
    this.isSubmit = false;
    config.backdrop = 'static';
    config.keyboard = false;
    this.busSquenceRecord= {} as BusSquence;
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
