import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BoardingDropping} from '../../model/boardingdropping';
import { Location} from '../../model/location';
import {Constants} from '../../constant/constant';

import { Subject } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import {BoardingdropingService} from '../../services/boardingdroping.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LocationService} from '../../services/location.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-boardingdroping',
  templateUrl: './boardingdroping.component.html',
  styleUrls: ['./boardingdroping.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class BoardingdropingComponent implements OnInit {
  public form: FormGroup;
  public formConfirm: FormGroup;  
  public searchForm: FormGroup;
  pagination: any;




  userType:any;
  public boardingList: FormArray;
  public droppingList: FormArray;
  @ViewChild("addnew") addnew;
  //@ViewChild("closebutton") closebutton;
 
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;


  endpoint = Constants.BASE_URL;
  BoardingDroppings: BoardingDropping[];
  BoardingDroppingRecord: BoardingDropping;
  boardings: any = {};
  droppings: any = {};
  boards: any;
  drops: any;
  
  locations: Location[];
  public isSubmit: boolean;
  public mesgdata:any;
  public allBoarding:string;
  public allDropping:string;

  public ModalHeading:any;
  public ModalBtn:any;

  // returns all form groups under BoardingDroppings
  get boardingFormGroup() {
    return this.form.get('boards') as FormArray;
  }
  get droppingFormGroup() {
    return this.form.get('drops') as FormArray;
  }
  constructor(private http: HttpClient, private BoardDropService:BoardingdropingService,  private notificationService: NotificationService,private locationService:LocationService,private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal) {

    this.isSubmit = false;
    this.BoardingDroppingRecord= {} as BoardingDropping;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Boarding Dropping";
    this.ModalBtn = "Save";
    this.userType=localStorage.getItem('ROLE_ID');
    
   }
   OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'lg' });
  }
   
  // loadBoardDrop() : void
  // {
  //   this.dtOptionBoardingDropping = {
  //     pagingType: 'full_numbers',
  //     pageLength: 10,
  //     serverSide: true,
  //     processing: true,
  //     dom: 'lBfrtip',
  //     order:["0","desc"], 
  //     aLengthMenu:[10, 25, 50, 100, "All"],      
  //     buttons: [
  //       { extend: 'copy', className: 'btn btn-sm btn-primary',init: function(api, node, config) {
  //       $(node).removeClass('dt-button')
  //    },
  //    exportOptions: {
  //     columns: "thead th:not(.noExport)"
  //    } 
  //   },
  //     { extend: 'print', className: 'btn btn-sm btn-danger',init: function(api, node, config) {
  //       $(node).removeClass('dt-button')
  //    },
  //    exportOptions: {
  //     columns: "thead th:not(.noExport)"
  //    } 
  //    },
  //     { extend: 'excel', className: 'btn btn-sm btn-info',init: function(api, node, config) {
  //       $(node).removeClass('dt-button')
  //    },
  //    exportOptions: {
  //     columns: "thead th:not(.noExport)"
  //    } 
  //    },

  //    {
  //     text:"Add",
  //     className: 'btn btn-sm btn-warning',init: function(api, node, config) {
  //       $(node).removeClass('dt-button')
  //     },
  //     action:() => {
  //      this.addnew.nativeElement.click();
  //     }
  //   }
  //   ],
  //   language: {
  //     searchPlaceholder: "Find Stoppage",
  //     processing: "<img src='assets/images/loading.gif' width='30'>"
  //   },
  //     ajax: (dataTablesParameters: any, callback) => {
  //       this.http
  //         .post<DataTablesResponse>(
  //           Constants.BASE_URL+'/boardingDT',
  //           dataTablesParameters, {}
  //         ).subscribe(resp => {
            
  //           this.BoardingDroppings = resp.data.aaData;
  //           // for(let items of this.BoardingDroppings)
  //           // {
  //           //   this.BoardingDroppingRecord=items;
  //           //   //this.BoardingDroppingRecord.boarding_point=this.BoardingDroppingRecord.boarding_point.split("#$");
  //           // }
            
  //           callback({
  //             recordsTotal: resp.data.iTotalRecords,
  //             recordsFiltered: resp.data.iTotalDisplayRecords,
  //             data: resp.data.aaData
  //           });
  //         });   
  //     },
  //     columns: [{ data: 'id' }, { data: 'location_name' }, { 
  //       title:'Stoppage',
  //       //data:'location_name'
  //      data: 'boarding_dropping',
  //       render:function(data){
  //         let bdata="";
  //         for(let ditems of data)
  //         {
            
  //           bdata+=(bdata=="")?ditems.boarding_point:", <br />"+ditems.boarding_point;
  //         }
  //         return bdata;
  //       }
  //    }, 
  //    { title:'Created At',data: 'created_at' }, { title:'Created By',data: 'created_by'}, { 
  //      data: 'status', 
  //      render:function(data)
  //       {
  //         return (data=="1")?"Active":"Pending"
  //       }
  //     },{ title:'Action',data: null, orderable:false, className: "noExport" }]      
      
  //   }; 
  //   this.locationService.readAll().subscribe(
  //     res=>{
  //       this.locations=res.data;
  //     }
  //   );

  // }
  ngOnInit() {
    this.form = this.fb.group({
      id:[null],
      location_id: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(15)])],
      boards: this.fb.array([this.createBoard()])
    });
    
    this.boardingList = this.form.get('boards') as FormArray;

    this.formConfirm=this.fb.group({
      id:[null]
    });

    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });

    this.search();

    // this.loadBoardDrop();
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
      this.BoardDropService.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.BoardingDroppings= res.data.data.data;
          this.pagination= res.data.data;
          // console.log( this.BusOperators);
        }
      );
    }
    else
    {
      this.BoardDropService.getAllData(data).subscribe(
        res => {
          this.BoardingDroppings= res.data.data.data;
          this.pagination= res.data.data;
          console.log( this.BoardingDroppings);
        }
      );
    }

    this.locationService.readAll().subscribe(
          res=>{
            this.locations=res.data;
          }
        );
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
  fileName= 'Boarding-Droping.xlsx';

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







  // boardingDropping formgroup
  createBoard(): FormGroup {
    return this.fb.group({ 
      boarding_point: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])]
    });
  }
  createDrop(): FormGroup {
    return this.fb.group({ 
      dropping_point: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])]
    });
  }
  // add a boardingDroping form group
  addBoard() {
    this.boardingList.push(this.createBoard());
  }
  addDrop() {
    this.droppingList.push(this.createDrop());
  }
  
  // remove boardingDropping from group
  removeBoard(index1) {  
    this.boardingList.removeAt(index1);
  }
  removeDrop(index) {   
    this.droppingList.removeAt(index);
  }


  // get the formgroup under form array
  getBoardsFormGroup(index1): FormGroup {
    const formGroup1 = this.boardingList.controls[index1] as FormGroup;
    return formGroup1;
  }


  ResetAttributes()
  {
    this.BoardingDroppingRecord= {} as BoardingDropping;

    this.form = this.fb.group({
      id:[null],
      location_id: [null, Validators.compose([Validators.required])],
      boards: this.fb.array([this.createBoard()])
    });

    this.boardingList = this.form.get('boards') as FormArray;

    this.ModalHeading = "Add Boarding Dropping";
    this.ModalBtn = "Save";
  }

  

  
  
  addBoardingDropping()
  {
    const data ={
      id:this.BoardingDroppingRecord.id,
      location_id :this.form.value.location_id,
      created_by:localStorage.getItem('USERNAME'),
      boarding_point:this.form.value.boards
    };

    if(data.id==null)
    {
      this.BoardDropService.create(data).subscribe(
        resp => {
          if(resp.status==1)
          {   
              //this.closebutton.nativeElement.click();
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.ResetAttributes();
              this.refresh();
          }
          else{
              this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
          }
        }
      );
    }
    else{
      this.BoardDropService.update(data.id,data).subscribe(
        resp => {
          if(resp.status==1)
          {
              //this.closebutton.nativeElement.click();
              this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
              this.modalReference.close();
              this.ResetAttributes();
              this.refresh();
          }
          else{
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
          }
        }
      );
    }
  }
  editBoardingDropping(event : Event, id : any)
  {
    this.BoardingDroppingRecord=this.BoardingDroppings[id];

    this.form = this.fb.group({
      id:[this.BoardingDroppingRecord.id],
      location_id: [this.BoardingDroppingRecord.id, Validators.compose([Validators.required])],
      created_by:localStorage.getItem('USERNAME'),
      boards: this.fb.array([this.createBoard()])
    });
    this.boardingList = this.form.get('boards') as FormArray;

    let editBoarding=[];
    this.boardingList.removeAt(0);
    
    for(let items of this.BoardingDroppingRecord.boarding_dropping)
    {
      this.boardingList.push(this.fb.group({ 
        boarding_point: [items.boarding_point, Validators.compose([Validators.required,Validators.minLength(2),Validators.required,Validators.maxLength(50)])]
      }));
     // editBoarding.push({value:''+items+''});
    }

    
    this.form.value.boards=editBoarding;

    this.ModalHeading = "Edit Boarding Dropping";
    this.ModalBtn = "Update";
  }

  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'lgx' });
  }
  deleteRecord()
  {
    let delitem=this.BoardingDroppingRecord.id;
     this.BoardDropService.delete(delitem).subscribe(
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
  deleteBoardingDropping(content, delitem:any)
  {
    this.BoardingDroppingRecord=this.BoardingDroppings[delitem];
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    
  }

  changeStatus(event : Event, stsitem:any)
  {
    this.BoardDropService.chngsts(stsitem).subscribe(
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
