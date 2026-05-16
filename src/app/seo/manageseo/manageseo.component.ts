import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BusOperatorService } from './../../services/bus-operator.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { Constants } from '../../constant/constant';

@Component({
  selector: 'app-manageseo',
  templateUrl: './manageseo.component.html',
  styleUrls: ['./manageseo.component.scss']
})
export class ManageseoComponent implements OnInit {

  public searchFrom!: FormGroup;
  public updateFrom!: FormGroup;


  apiUrl = Constants.BASE_URL;
  role = sessionStorage.getItem('ROLE_ID');

  cityContent: any;

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private rs: ReportsService,
    private busOperatorService: BusOperatorService,
    private fb: FormBuilder,
    private locationService: LocationService,
    public formatter: NgbDateParserFormatter
  ) {

  }
  title = 'angular-app';
  fileName = 'Complete-Report.csv';
  ngOnInit(): void {
    this.spinner.show();


    this.searchFrom = this.fb.group({
      location: [null],
    })

    this.updateFrom = this.fb.group({
      id: [null],
      content: [null],
    })

    this.search();
    // this.loadServices();

  }


  search() {
    const formData = this.searchFrom.value;
    this.http.post(this.apiUrl + '/manage-city-content', formData).subscribe((res: any) => {
      this.cityContent = res.data;
      console.log(res.data);
      this.spinner.hide();
    })
  }

  updateForm(data: any, content: string) {
    this.spinner.show();
    this.updateFrom.patchValue({
      id: data.id,
      content: content
    });

    this.http.post(this.apiUrl+'/update-city-content', this.updateFrom.value).subscribe(res => {
      console.log('updated')
      this.search();
      this.spinner.hide();
    });
  }


  // search(pageurl = "") {
  //   this.spinner.show();
  //   this.completeReportRecord = this.searchFrom.value;

  //   const data = {
  //     bus_operator_id: this.completeReportRecord.bus_operator_id,
  //   };

  //   // console.log(data);


  //   if (pageurl != "") {
  //     this.rs.completepaginationReport(pageurl, data).subscribe(
  //       res => {
  //         this.completedata = res.data;
  //         console.log(this.completedata)
  //         this.spinner.hide();
  //       }
  //     );
  //   }
  //   else {
  //     this.rs.completeReport(data).subscribe(
  //       res => {
  //         this.completedata = res.data;
  //         // console.log(this.completedata.data.data);
  //         this.spinner.hide();
  //       }
  //     );
  //   }

  // }



  refresh() {
    this.spinner.show();
    this.searchFrom = this.fb.group({
      location: [null],
    })
    this.search();
  }




}
