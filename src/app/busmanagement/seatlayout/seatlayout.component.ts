import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SeatLayout} from '../../model/seatlayout';
import {SeatlayoutService} from '../../services/seatlayout.service';
import { NotificationService } from '../../services/notification.service';
import { Subject, Subscription } from 'rxjs';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgForm} from '@angular/forms';
import{Constants} from '../../constant/constant';
import { DragulaService, DragulaDirective  } from 'ng2-dragula';
import * as dragula from 'dragula';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { BusOperatorService } from '../../services/bus-operator.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";

interface SeatBlock{
  rowNumber?:any;
  colNumber?:any;
  seatType?:any;
  berthType?:any;
  seatText?:any;
}
@Component({
  selector: 'app-seatlayout',
  templateUrl: './seatlayout.component.html',
  styleUrls: ['./seatlayout.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class SeatlayoutComponent implements OnInit {

  seatBlock:SeatBlock;
  seatBlocks:SeatBlock[]=[];

  public dropElement:[];
  subs = new Subscription();
  @ViewChild("addnew") addnew;

  public SeatLayoutForm: FormGroup;
  public formConfirm: FormGroup;
  public searchForm: FormGroup;


  busoperators: any;
  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;
  SeatLayouts: SeatLayout[];
  SeatLayoutRecord: SeatLayout;

  public seatLayoutrows=Array();
  public sleeperLayoutrows=Array();

  public isSubmit: boolean;
  public mesgdata:any;
  public ModalHeading:any;
  public ModalBtn:any;

  public seatRecords:any;
  left = ['seater','sleeper','blank'];
  left_1 = ['sleeper','vertical','blank'];
  lowerBerthArray=[];
  upperBerthArray=[];
  seatText=[];
  pagination: any;
  all: any;

 
  constructor(private spinner: NgxSpinnerService,private http: HttpClient, private notificationService: NotificationService, private sLayout: SeatlayoutService,private fb: FormBuilder,config: NgbModalConfig, private modalService: NgbModal, private busOperatorService: BusOperatorService,private dragulaService: DragulaService) {
    dragulaService.createGroup('COPYABLE', {
      copy: (el, source) => {
        return source.id === 'left';
      },
      copyItem: (item) => {
        return item;
      },
      accepts: (el, target, source, sibling) => {
        return target.id !== 'left';
      }
    });

    dragulaService.createGroup('SLEEPERCOPYABLE', {
      copy: (el, source) => {
        return source.id === 'left_1';
      },
      copyItem: (item) => {
        return item;
      },
      accepts: (el, target, source, sibling) => {
        return target.id !== 'left_1';
      }
    });
    this.isSubmit = false;
    this.SeatLayoutRecord= {} as SeatLayout;
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add Seat Layout";
    this.ModalBtn = "Save";
  }  
  layoutData:any;
  layoutName:any;
  sLayoutData=[];
  lowerBerthSeats=[];
  upperBerthSeats=[];
  Rows=[];
  sleeperRows=[];
  seats=[];
  public editLayout:FormGroup;
  sLayoutRecord:any;
  sLayoutRecordCols:any;
  get layoutInfo() {
    return this.editLayout.get('seatRows') as FormArray;
  }
  row_arr=[];
  sleeper_row_arr=[];
  viewSeatLayout(event : Event, id : any)
  {
    this.SeatLayoutRecord=this.SeatLayouts[id] ;

    this.row_arr=[];
    this.sleeper_row_arr=[];
    this.editLayout = this.fb.group({
      seatRows: this.fb.array([])
    });
    this.layoutData=[];
    this.ModalHeading = "View Seat Layout";
    this.SeatLayoutRecord=this.SeatLayouts[id];

    delete this.seatBlocks;
    this.sLayout.getByID(this.SeatLayoutRecord.id).subscribe(
      resp => {

        this.seatBlocks=[];
        this.lowerBerthBasketText=[];
        this.upperBerthBasketText=[];
        let rowArray=new Array();
        let upperrowArray=new Array();
        this.lowerBerthSeats=[];
        this.upperBerthSeats=[];
        
        if(resp.data.lowerBerth)
        {
          this.lowerBerthSeats=resp.data.lowerBerth;
          let rowCounter=0;
          for(var items of this.lowerBerthSeats)
          {
            let cellData=new Array();
            
            let counterItem=0;
            rowArray=new Array();
            for(var coldata of items)
            {
              cellData[coldata.rowNumber]=[coldata.rowNumber,coldata.colNumber,coldata.seatType,1];
              rowArray.push(cellData);
              counterItem++;
              var seatData: SeatBlock = {rowNumber: coldata.rowNumber, colNumber:coldata.colNumber, seatType: coldata.seatType, berthType:1, seatText:''};
              this.seatBlocks.push(seatData); //Value Pushed to Interface
            }
            this.lowerBerthBasketText[rowCounter]=rowArray; //Value Pushed to Array
            rowCounter++;
          }
          //console.log(this.seatBlocks);
          
        }
        if(resp.data.upperBerth)
        {
          this.upperBerthSeats=resp.data.upperBerth;
          let rowCounter=0;
          for(var items of this.upperBerthSeats)
          {
            let cellData=new Array();
            upperrowArray=new Array();
            upperrowArray.length=0;
            let counterItem=0;
            for(var coldata of items)
            {
              cellData[coldata.rowNumber]=[coldata.rowNumber,coldata.colNumber,coldata.seatType,2];
              upperrowArray.push(cellData);
              counterItem++;

              var seatData: SeatBlock = {rowNumber: coldata.rowNumber, colNumber:coldata.colNumber, seatType: coldata.seatType, berthType:2, seatText:''};
              this.seatBlocks.push(seatData); //Value Pushed to Interface
            }
            this.upperBerthBasketText[rowCounter]=upperrowArray; //Value Pushed to Array
            rowCounter++;
          }
        }
      }
    )
    

    
    

  
  }
  updateLayout(form:NgForm)
  {
    
   // console.log(form.value);
    const layoutName=form.value.SeatLayoutName;
    const lowerBerth=form.value.lowerBerth;
    var counter=0;
    if(Object.keys(lowerBerth).length > 0)
    {
      for (var [key,items] of Object.entries(lowerBerth)) {
        key=key.replace("lower_",'');
        this.formSeater[key]=[];
        for(const [subkey,subItems] of Object.entries(items))
        {
          this.formSeater[key][subkey]=subItems.seatText;
        }
      }
     
      for(var rowBlocks of this.seatBlocks)
      { 
        let rowNum=rowBlocks.rowNumber;
        let colNum=rowBlocks.colNumber;
       
        if(this.formSeater[rowNum][colNum] && this.seatBlocks[counter].berthType=="1")
        {
          
            this.seatBlocks[counter].seatText=this.formSeater[rowNum][colNum];
           
        }
        counter++;
      }
    
    }
    if(form.value.upperBerth)
    {
      counter=0;
      for (var [key,items] of Object.entries(form.value.upperBerth)) {
        key=key.replace("upper_",'');
        this.formSleeper[key]=[];
        for(const [subkey,subItems] of Object.entries(items))
        {
          this.formSleeper[key][subkey]=subItems.seatText;
        }
      }
      for(var rowBlocks of this.seatBlocks)
      { 
        let rowNum=rowBlocks.rowNumber;
        let colNum=rowBlocks.colNumber;
        if(this.seatBlocks[counter])
        {
          if(this.formSleeper[rowNum] && this.seatBlocks[counter].berthType=="2")
          {
              this.seatBlocks[counter].seatText=this.formSleeper[rowNum][colNum];
             
          }
          counter++;
        }
      }
    }
    let seatContext=form.value;
   // delete seatContext.SeatLayoutName;
   
   
    const data={
      name:form.value.SeatLayoutName,
      layout_data:JSON.stringify(this.seatBlocks),
      created_by:localStorage.getItem('USERNAME'),
      bus_operator_id:this.SeatLayoutRecord.bus_operator_id  
    }
 
   
    this.sLayout.update(this.SeatLayoutRecord.id, data).subscribe(
      resp => {
        if(resp.status==1)
        {
            this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
            this.modalReference.close();
            this.refresh();
        }
        else{
            this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
        }
      }
    );
  }
  OpenModal(content) {
    this.modalReference=this.modalService.open(content,{ scrollable: true, size: 'xl' });
  }
 
  msg : any;
  lowerBerthBasketText: string[][];
  upperBerthBasketText: string[][];
  seatType:{};
  
  ngOnInit(){
    //this.spinner.show();
    this.editLayout = this.fb.group({
      seatRows: this.fb.array([])
    });
    this.lowerBerthBasketText=[];
    this.upperBerthBasketText=[];
    var seatTypeId=[];
    seatTypeId['seater']="1";
    seatTypeId['sleeper']="2";
    seatTypeId['vertical']="3";
    seatTypeId['blank']="4";

    this.dragulaService.dropModel('COPYABLE').subscribe(({el,source,name,target, sibling,sourceModel, targetModel}) => {

      if(target!=null)
      {
        let sTypeId=el.id;
        let totalChild=target.childElementCount;
        let targetid=target.className;
        let splitString=targetid.split("Row_");
        let rowCounter=parseInt(splitString[1]);
        let arraylen = totalChild;
        if(sTypeId in seatTypeId)
        {
          this.seatType=seatTypeId[sTypeId]
        }
        if(this.lowerBerthBasketText[rowCounter]!=undefined)
        {
            for(let key in this.lowerBerthBasketText[rowCounter])
            {
              this.lowerBerthBasketText[rowCounter]=new Array();
            }
        }
        let counterItem=0;
        let rowArray=new Array();
        
        for(var items of targetModel)
        {
          let cellData=new Array();
          this.seatType=seatTypeId[items];
          if(this.seatType!="")
          {
            cellData[rowCounter]=[rowCounter,counterItem,this.seatType,1];
            rowArray.push(cellData);
            counterItem++;
          }
        }
        this.lowerBerthBasketText[rowCounter]=rowArray; //Value Pushed to Array
      } 
    });

    this.dragulaService.dropModel('SLEEPERCOPYABLE').subscribe(({el,source,name,target, sibling,sourceModel, targetModel}) => {

      if(target!=null)
      {
        let sTypeId=el.id;
        let totalChild=target.childElementCount;
        let targetid=target.className;
        let splitString=targetid.split("Row_");
        let rowCounter=parseInt(splitString[1]);
        let arraylen = totalChild;
        if(sTypeId in seatTypeId)
        {
          this.seatType=seatTypeId[sTypeId];
        }
        if(this.upperBerthBasketText[rowCounter]!=undefined)
        {
            for(let key in this.upperBerthBasketText[rowCounter])
            {
              this.upperBerthBasketText[rowCounter]=new Array();
            }
        }
        let counterItem=0;
        let rowArray=new Array();
        
        for(var items of targetModel)
        {
          let cellData=new Array();
          this.seatType=seatTypeId[items];
          if(this.seatType!="")
          {
            cellData[rowCounter]=[rowCounter,counterItem,this.seatType,2];
            // console.log(cellData);
            rowArray.push(cellData);
            counterItem++;
          }
        }
        this.upperBerthBasketText[rowCounter]=rowArray; //Value Pushed to Array
      }  

      // console.log( this.upperBerthBasketText);
    });
    
    this.SeatLayoutForm = this.fb.group({
      id:[null],
      name: [null],
      seatType: ["", Validators.compose([Validators.required])],
      rowNumber:[null, Validators.compose([Validators.required])],
      bus_operator_id:[null, Validators.compose([Validators.required])],
      SeatLayoutName:[null, Validators.compose([Validators.required])]
    });
    this.formConfirm=this.fb.group({
      id:[null]
    });

    this.searchForm = this.fb.group({  
      name: [null],  
      rows_number: Constants.RecordLimit,
    });

    this.search();
    this.loadServices();
    // this.loadSeatLayout();
  }
  loadServices() {
    const BusOperator={
      USER_BUS_OPERATOR_ID:localStorage.getItem("USER_BUS_OPERATOR_ID")
    };
    if(BusOperator.USER_BUS_OPERATOR_ID=="")
    {
      this.busOperatorService.readAll().subscribe(
        record=>{
        this.busoperators=record.data;
        }
      );
    }
    else
    {
      this.busOperatorService.readOne(BusOperator.USER_BUS_OPERATOR_ID).subscribe(
        record=>{
        this.busoperators=record.data;
        }
      );
    }

  }



  page(label:any){
    return label;
   }

   
  search(pageurl="")
  {      
    //this.spinner.show();
    const data = { 
      name: this.searchForm.value.name,
      rows_number:this.searchForm.value.rows_number, 
      USER_BUS_OPERATOR_ID:localStorage.getItem('USER_BUS_OPERATOR_ID')
    };
   
    // console.log(data);
    if(pageurl!="")
    {
      this.sLayout.getAllaginationData(pageurl,data).subscribe(
        res => {
          this.SeatLayouts= res.data.data.data;
          this.pagination= res.data.data;
          this.all=res.data;
          // console.log( this.SeatLayouts);
        }
      );
    }
    else
    {
      this.sLayout.getAllData(data).subscribe(
        res => {
          this.SeatLayouts= res.data.data.data;
          this.pagination= res.data.data;
          this.all=res.data;
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
  fileName= 'Seat-layout.xlsx';

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





  formSeater=[];
  formSleeper=[];
  saveLayout(form: NgForm)
  {
    this.seatBlocks=[];
    
    for(let LBRow of this.lowerBerthBasketText)
    {
      for(let LBCol of LBRow)
      {
        for(let LBColdata of LBCol)
        {
          if(LBColdata!=undefined)
          {
            //console.log(LBColdata);
            var seatData: SeatBlock = {rowNumber: LBColdata[0], colNumber:LBColdata[1], seatType: LBColdata[2], berthType:LBColdata[3], seatText:''};
            this.seatBlocks.push(seatData); //Value Pushed to Interface
          }
         
        }
      }
    }
    for(let UBRow of this.upperBerthBasketText)
    {
      for(let UBCol of UBRow)
      {
        for(let UBColdata of UBCol)
        {
          if(UBColdata!=undefined)
          {
            //console.log(UBColdata);
            var seatData: SeatBlock = {rowNumber: UBColdata[0], colNumber:UBColdata[1], seatType: UBColdata[2], berthType:UBColdata[3], seatText:''};
            this.seatBlocks.push(seatData); //Value Pushed to Interface
          }
         
        }
      }
    }
    const layoutName=this.SeatLayoutForm.value.SeatLayoutName;
    let seatContext=form.value;
    delete seatContext.SeatLayoutName;
    var counter=0;
    if(form.value.lowerBerthArray)
    {
      for (var [key,items] of Object.entries(form.value.lowerBerthArray)) {
        key=key.replace("lower_",'');
        this.formSeater[key]=[];
        for(const [subkey,subItems] of Object.entries(items))
        {
          this.formSeater[key][subkey]=subItems.seatText;
        }
      }
      for(var rowBlocks of this.seatBlocks)
      { 
        let rowNum=rowBlocks.rowNumber;
        let colNum=rowBlocks.colNumber;
        if(rowNum in this.formSeater)
        {
          if(this.formSeater[rowNum][colNum] && this.seatBlocks[counter].berthType=="1")
          {
              this.seatBlocks[counter].seatText=this.formSeater[rowNum][colNum];
              
          }
          counter++;
        }
       
      }
    }
    if(form.value.upperBerthArray)
    {
      counter=0;
      for (var [key,items] of Object.entries(form.value.upperBerthArray)) {
        key=key.replace("upper_",'');
        this.formSleeper[key]=[];
        for(const [subkey,subItems] of Object.entries(items))
        {
          this.formSleeper[key][subkey]=subItems.seatText;
        }
      }
      for(var rowBlocks of this.seatBlocks)
      { 
        let rowNum=rowBlocks.rowNumber;
        let colNum=rowBlocks.colNumber;
        if(this.seatBlocks[counter])
        {
          if(rowNum in this.formSleeper)
          {
            if(this.formSleeper[rowNum] && this.seatBlocks[counter].berthType=="2")
            {
                this.seatBlocks[counter].seatText=this.formSleeper[rowNum][colNum];
               
            }
            counter++;
          }
          
        }
      }
    }
    const data ={
      name:layoutName,
      layout_data:JSON.stringify(this.seatBlocks),
      created_by:localStorage.getItem('USERNAME'),
      bus_operator_id:this.SeatLayoutForm.value.bus_operator_id
    }
  //  console.log(data);
  //  return false;
    this.sLayout.create(data).subscribe(
      resp => {
        if(resp.status==1)
        {
          this.notificationService.addToast({title:Constants.SuccessTitle,msg:resp.message, type:Constants.SuccessType});
          this.modalReference.close();
          this.refresh();
        }
        else{
          this.notificationService.addToast({title:Constants.ErrorTitle,msg:resp.message, type:Constants.ErrorType});
        }
      }
    );
    
  }
  ResetAttributes()
  {
    this.lowerBerthArray=[];
    this.upperBerthArray=[];
    this.seatLayoutrows=Array();
    this.sleeperLayoutrows=Array();
    this.SeatLayoutRecord= {} as SeatLayout;

    const seatBlock=(): SeatBlock=>({
      rowNumber:"",
      colNumber:"",
      seatType:"",
      berthType:"",
      seatText:""

    });

    this.lowerBerthBasketText=[];
    this.upperBerthBasketText=[];

    this.SeatLayoutForm = this.fb.group({
      id:[null],
      name: [null],
      seatType: ["", Validators.compose([Validators.required])],
      rowNumber:[null, Validators.compose([Validators.required])],
      bus_operator_id:[null, Validators.compose([Validators.required])],
      SeatLayoutName:[null, Validators.compose([Validators.required])]
    });
    this.ModalHeading = "Add Seat Layout";
    this.ModalBtn = "Save";
  }
 

  openConfirmDialog(content)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
  }
  deleteRecord()
  {
    let delitem=this.formConfirm.value.id;
    this.sLayout.delete(delitem).subscribe(
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
  deleteSeatLayout(content, delitem:any)
  {
    this.confirmDialogReference=this.modalService.open(content,{ scrollable: true, size: 'md' });
    this.formConfirm=this.fb.group({
      id:[delitem]
    });
  }
  removeItem(event : Event)
  {
    // console.log(event);
  }
  changeStatus(event : Event, stsitem:any)
  {
    this.sLayout.chngsts(stsitem).subscribe(
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
  generateRow()
  {
    let rowNumberChoosen=this.SeatLayoutForm.value.rowNumber;
    let seatType=this.SeatLayoutForm.value.seatType;
    if(seatType=="Seater")
    {
      this.seatLayoutrows=Array();
      if(rowNumberChoosen>0)
      {
        for(let startCounter=0; startCounter<rowNumberChoosen; startCounter++)
        {
          this.seatLayoutrows.push(startCounter);//THIS IS USED TO CHECK IF THERE IS ANY ROW CREATED
          this.lowerBerthArray.push(Array());
        }
      }
    }
    else
    {
      this.sleeperLayoutrows=Array();
      if(rowNumberChoosen>0)
      {
        for(let startCounter=0; startCounter<rowNumberChoosen; startCounter++)
        {
          this.sleeperLayoutrows.push(startCounter);//THIS IS USED TO CHECK IF THERE IS ANY ROW CREATED
          this.upperBerthArray.push(Array());
        }
      }
    }
  }
}

