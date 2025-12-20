import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../constant/constant';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-top-route',
  templateUrl: './top-route.component.html',
  styleUrls: ['./top-route.component.scss'],
})
export class TopRouteComponent implements OnInit {
  private apiURL = Constants.BASE_URL;
  data: any;
  TopRoutes: any[] = [];
  TotalBooking: any[] = [];
  TopCity: any[] = [];
  CitywiseBooking: any[] = [];
  Hour: any[] = [];
  odbus: any[] = [];
  abhibus: any[] = [];
  paytm: any[] = [];

  totalSeat: any[]=[];
  totalSlepper: any[]=[];
  totalSeatbooked: any[]=[];
  totalSlepperbooked: any[]=[];
  totalSeatavl: any[]=[];
  totalSlepperavl: any[]=[];


  minEndDate: string = '';
  maxEndDate: string = '';

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {}

  updateFlag = false;

  RouteformData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
  });

  CityFormData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
  })

  DayFormData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
  })

  refresh() {
    this.RouteformData.reset();
  }

  Cityrefresh(){
    this.CityFormData.reset();
  }

  Dayrefresh(){
    this.DayFormData.reset();
  }
  onStartDateChange(event: any) {
    const start = new Date(event.target.value);

    this.minEndDate = event.target.value;

    const max = new Date(start);
    max.setDate(max.getDate() + 30);

    this.maxEndDate = max.toISOString().split('T')[0];
  }

  getRoute() {
    this.spinner.show();
    const reqData = this.RouteformData.value;
    this.http.post(this.apiURL + '/top-route', reqData).subscribe((res: any) => {
      // console.log(res.status);
      if (res.status == true) {
        this.spinner.hide();
        this.TopRoutes = res.data.map((item: any) => item.Route);
        this.TotalBooking = res.data.map((item: any) => item.TotalBooking);

        this.routeChart = {
          ...this.routeChart,
          xAxis: {
            categories: this.TopRoutes,
          },
          series: [
            {
              name: 'Total Bookings',
              type: 'bar',
              data: this.TotalBooking,
            },
          ],
        };

        this.updateFlag = true;
      }
    });
  }

  getCity(){
    // console.log(this.CityFormData.value);
    const reqData = this.CityFormData.value;
    this.http.post(this.apiURL+"/top-city",reqData).subscribe((res:any)=>{
      // console.log(res.data);
      this.TopCity = res.data.map((item: any) => item.source_name);
      this.CitywiseBooking = res.data.map((item: any) => item.total_bookings);

      this.cityChart = {
          ...this.cityChart,
          xAxis: {
            categories: this.TopCity,
          },
          series: [
            {
              name: 'Total Bookings',
              type: 'bar',
              data: this.CitywiseBooking,
            },
          ],
        };

        this.updateFlag = true;
    })
  }

  

  getdaywise() {
    const reqData = this.DayFormData.value;

    this.http.post(this.apiURL + "/day-wise", reqData).subscribe((res: any) => {
      this.Hour = res.data.map((item: any) => item.cat);
      this.odbus = res.data.map((item: any) => Number(item.odbus));
      this.abhibus = res.data.map((item: any) => Number(item.abhibus));
      this.paytm = res.data.map((item: any) => Number(item.paytm));


      // console.log(this.odbus)

      this.chartOptions = {
        ...this.chartOptions,
        xAxis: {
          categories: this.Hour,
        },
        series: [
          {
            name: 'ODBUS',
            type: 'line',
            color: 'red',
            data: this.odbus
          },
          {
            name: 'Abhibus',
            type: 'line',
            color: '#00ff7f',
            data: this.abhibus  
          },
          {
            name: 'Paytm',
            type: 'line',
            color: 'blue',
            data: this.paytm
          }
        ],
      };

      this.updateFlag = true;
    });
  }

  getTotalseat(){
    this.http.post(this.apiURL + "/total-bus-seat", "").subscribe((res:any)=>{
      console.log(res);
      this.totalSeat = res.total_lower_berth;
      this.totalSlepper = res.total_upper_berth;
      this.totalSeatbooked = res.total_seat_booked;
      this.totalSlepperbooked = res.total_slepper_booked;
      this.totalSeatavl = res.total_seat_avl;
      this.totalSlepperavl = res.total_slepper_avl;

      console.log(this.totalSeat)
      this.seatChart = {
        ...this.seatChart,
        // xAxis: {
        //   categories: this.Hour,
        // },
        series: [
          {
            name: 'Seats Not Booked',
            type: 'column',
            data: [this.totalSeatavl],
            stack: 'Europe'
          },
          {
            name: 'Booked Seats',
            type: 'column',
            data: [this.totalSeatbooked],
            stack: 'Europe'
          },
          {
            name: 'Total Seats',
            type: 'column',
            data: [this.totalSeat],
            stack: 'Europe'
          },
          {
            name: 'Slepper Not Booked',
            type: 'column',
            data: [this.totalSlepperavl],
            stack: 'America'
          },
          {
            name: 'Slepper Booked',
            type: 'column',
            data: [this.totalSlepperbooked],
            stack: 'America'
          },
          {
            name: 'Total Slepper',
            type: 'column',
            data: [this.totalSlepper],
            stack: 'America'
          },
          
        ]
      };

      this.updateFlag = true;
    })
  }


  ngOnInit(): void {
    this.getRoute();
    this.getCity();
    this.getdaywise();
    this.getTotalseat();
  }

  Highcharts: typeof Highcharts = Highcharts;

  //For Routes wise
  routeChart: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: '#121212',
    },

    title: {
      text: 'High Demand Routes',
      style: { color: '#000', fontSize: '22px' },
    },

    // subtitle: {
    //   text: 'Sahil Creation',
    //   style: { color: '#aaa' }
    // },

    xAxis: {
      categories: [],
      title: { text: null },
      labels: { style: { color: '#000', fontSize: '11px' } },
    },

    yAxis: {
      min: 0,
      title: {
        text: '',
        style: { color: '#000' },
      },
      labels: { style: { color: '#000' } },
      gridLineColor: '#333',
    },

    legend: {
      reversed: false,
      itemStyle: { color: '#000' },
    },

    tooltip: {
      shared: true,
      backgroundColor: '#000',
      borderColor: '#555',
      style: { color: '#000' },
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          style: { color: '#000', textOutline: 'none' },
        },
      },
    },

    series: [
      {
        name: 'Year 1990',
        type: 'bar',
        data: [],
        colorByPoint: true,
      },
    ],
  };


  //For City wise 
  cityChart: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: '#0b0e11'
    },
    title: {
      text: 'High Demand City',
      style: { color: '#000', fontSize: '22px' }
    },
    // subtitle: {
    //   text: 'Source: indexmundi',
    //   style: { color: '#ccc' }
    // },
    xAxis: {
      categories: [],
      crosshair: true,
      labels: { style: { color: '#000' } }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Value',
        style: { color: '#000' }
      },
      labels: { style: { color: '#000' } }
    },
    legend: {
      itemStyle: { color: '#000' }
    },
    tooltip: {
      shared: true
    },
    series: [
      {
        name: 'City',
        type: 'column',
        data: [],
        colorByPoint: true,
      },
      // {
      //   name: 'Wheat',
      //   type: 'column',
      //   data: [48, 135, 10, 140, 18, 108],
      //   color: '#00ff7f' // green
      // }
    ]
  };


  //Day wise data show

  chartOptions: Highcharts.Options = {
    chart: {
      backgroundColor: '#0b0e11',
      type: 'line'
    },
    title: {
      text: '',
      style: { color: '#000', fontSize: '22px' }
    },
    // subtitle: {
    //   text: 'Source: Google Analytics',
    //   style: { color: '#000' }
    // },
    xAxis: {
      categories: [],
      labels: { style: { color: '#000' } },
      crosshair: true
    },
    yAxis: {
      title: { text: '' },
      labels: { style: { color: '#000' } }
    },
    legend: {
      itemStyle: { color: '#000' }
    },
    tooltip: {
      shared: true,
      backgroundColor: '#000',
      style: { color: '#000' }
    },
    plotOptions: {
      series: {
        marker: { enabled: true, radius: 4, lineWidth: 2 }
      }
    },
    series: [
      {
        name: 'ODBUS',
        type: 'line',
        color: 'red',
        data: []
      },
      {
        name: 'Abhibus',
        type: 'line',
        color: '#00ff7f',
        data: []
      },
      {
        name: 'Paytm',
        type: 'line',
        color: 'blue',
        data: []
      }
    ]
  };



  seatChart: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Day wise booked'
    },
    xAxis: {
      categories: ["Odbus"]
    },
    yAxis: {
      min: 0,
      title: { text: 'Count medals' }
    },
    tooltip: {
      shared: false
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        pointPadding: 0.3, 
        groupPadding: 0.3
      }
    },
    series: [
      {
        name: 'Seats Not Booked',
        type: 'column',
        data: [],
        stack: 'Europe'
      },
      {
        name: 'Booked Seats',
        type: 'column',
        data: [],
        stack: 'Europe'
      },
      {
        name: 'Total Seats',
        type: 'column',
        data: [],
        stack: 'Europe'
      },
      {
        name: 'Slepper Not Booked',
        type: 'column',
        data: [],
        stack: 'America'
      },
      {
        name: 'Slepper Booked',
        type: 'column',
        data: [],
        stack: 'America'
      },
      {
        name: 'Total Slepper',
        type: 'column',
        data: [],
        stack: 'America'
      },
      
    ]
  };
}
