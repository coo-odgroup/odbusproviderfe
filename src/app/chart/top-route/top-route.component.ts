import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../constant/constant';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import Drilldown from 'highcharts/modules/drilldown';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';
import OfflineExporting from 'highcharts/modules/offline-exporting';



Exporting(Highcharts);
ExportData(Highcharts);
Accessibility(Highcharts);
OfflineExporting(Highcharts);


Drilldown(Highcharts);

type BusDetail = {
  bus_number: string;
  cancel_bus: string;
};

type BusPoint = {
  busDetails?: BusDetail[];
  date?: string;
};

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

  totalSeat: any[] = [];
  totalSleeper: any[] = [];
  totalSeatbooked: any[] = [];
  totalSleeperbooked: any[] = [];
  totalSeatavl: any[] = [];
  totalSleeperavl: any[] = [];


  minEndDate: string = '';
  maxEndDate: string = '';

  form!: FormGroup;
  busOperators: any;

  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private fb: FormBuilder) { }

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

  operatorFormBooking = new FormGroup({
    from_j_date: new FormControl(''),
    to_j_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
    bus_operator_id: new FormControl([]),
  })


  operatorFormRevenue = new FormGroup({
    from_j_date: new FormControl(''),
    to_j_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
    bus_operator_id: new FormControl([]),
  })


  operatorFormSeat = new FormGroup({
    start_date: new FormControl(''),
  })


  opBuscancelForm = new FormGroup({
    from_date: new FormControl(''),
    to_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
    bus_operator_id: new FormControl([]),
  })



  isChartLoading: boolean = false;
  isCityLoading: boolean = false;
  isDayLoading: boolean = false;
  isSeatLoading: boolean = false;
  isOPbLoading: boolean = false;
  isOPrLoading: boolean = false;
  isOPbcLoading: boolean = false;


  toTitleCase(text: string): string {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  refresh() {
    this.RouteformData.reset();
  }

  Cityrefresh() {
    this.CityFormData.reset();
  }

  Dayrefresh() {
    this.DayFormData.reset();
  }

  opBookingrefresh() {
    if (this.chartRef) {
      try {
        this.chartRef.drillUp();
      } catch { }
    }
    this.operatorFormBooking.reset();
    this.getOperator();
  }

  opSeatfresh() {
    this.operatorFormSeat.reset();
  }

  opRevenuefresh() {
    if (this.revenueChartRef) {
      try {
        this.revenueChartRef.drillUp();
      } catch { }
    }
    this.operatorFormRevenue.reset();
    this.getOperatorRevenue();
  }

  opBusCancelfresh() {
    if (this.busCancelChartRef) {
      try {
        this.busCancelChartRef.drillUp();
      } catch { }
    }
    this.opBuscancelForm.reset();
    this.getOperatorBuscancel();
  }

  onStartDateChange(event: any) {
    const start = new Date(event.target.value);

    this.minEndDate = event.target.value;

    const max = new Date(start);
    max.setDate(max.getDate() + 30);

    this.maxEndDate = max.toISOString().split('T')[0];
  }


  getRoute() {
    this.isChartLoading = true;

    const reqData = this.RouteformData.value;

    this.http.post(this.apiURL + '/top-route', reqData).subscribe({
      next: (res: any) => {
        if (res.status === true) {

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
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isChartLoading = false;
      }
    });
  }


  getCity() {
    // console.log(this.CityFormData.value);
    this.isCityLoading = true;
    const reqData = this.CityFormData.value;
    this.http.post(this.apiURL + "/top-city", reqData).subscribe({
      next: (res: any) => {
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
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isCityLoading = false;
      }
    })
  }



  getdaywise() {
    this.isDayLoading = true;
    const reqData = this.DayFormData.value;

    this.http.post(this.apiURL + "/day-wise", reqData).subscribe({
      next: (res: any) => {
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
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isDayLoading = false;
      }
    });
  }

  getTotalseat() {
    this.isSeatLoading = true;
    const reqParams = this.operatorFormSeat.value;
    this.http.post(this.apiURL + "/total-bus-seat", reqParams).subscribe({
      next: (res: any) => {
        // console.log(res);
        this.totalSeat = res.total_lower_berth;
        this.totalSleeper = res.total_upper_berth;
        this.totalSeatbooked = res.total_seat_booked;
        this.totalSleeperbooked = res.total_sleeper_booked;
        this.totalSeatavl = res.total_seat_avl;
        this.totalSleeperavl = res.total_sleeper_avl;

        // console.log(this.totalSeat)
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
              name: 'Sleeper Not Booked',
              type: 'column',
              data: [this.totalSleeperavl],
              stack: 'America'
            },
            {
              name: 'Sleeper Booked',
              type: 'column',
              data: [this.totalSleeperbooked],
              stack: 'America'
            },
            {
              name: 'Total Sleeper',
              type: 'column',
              data: [this.totalSleeper],
              stack: 'America'
            },

          ]
        };

        this.updateFlag = true;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isSeatLoading = false;
      }
    })
  }

  chartRef: Highcharts.Chart | null = null;

  onChartInstance(chart: Highcharts.Chart) {
    this.chartRef = chart;
  }


  getOperator() {
    if (this.chartRef) {
      try {
        this.chartRef.drillUp();
      } catch { }
    }
    this.isOPbLoading = true;
    const reqParams = this.operatorFormBooking.value;
    // console.log(reqParams);
    this.http.post(this.apiURL + "/operator-wise-booking", reqParams).subscribe({
      next: (res: any) => {
        // console.log(res);

        const operatorSeries = res.map((item: any) => ({
          name: this.toTitleCase(item.operator_name),
          y: item.total_booking,
          drilldown: this.toTitleCase(item.operator_name)
        }));

        const drilldownSeries = res.map((item: any) => {
          // Ensure bus_wise is an array
          const busArray = Array.isArray(item.bus_wise) ? item.bus_wise : [];

          // Aggregate bus-wise bookings
          const busMap: { [key: string]: number } = {};
          busArray.forEach((bus: any) => {
            if (!busMap[bus.bus_number]) {
              busMap[bus.bus_number] = 0;
            }
            busMap[bus.bus_number] += bus.total_booking;
          });

          const busData = Object.keys(busMap).map(busNumber => [busNumber, busMap[busNumber]]);

          return {
            id: item.operator_name,
            name: item.operator_name + ' - Bus wise booking',
            type: 'column',
            data: busData
          };
        });

        this.operatorchart = {
          ...this.operatorchart,
          series: [{
            name: 'Operators',
            type: 'column',
            colorByPoint: true,
            data: operatorSeries
          }],
          drilldown: {
            series: drilldownSeries
          }
        };
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isOPbLoading = false;
      }
    });
  }


  revenueChartRef: Highcharts.Chart | null = null;

  onRevenueChartInstance(chart: Highcharts.Chart) {
    this.revenueChartRef = chart;
  }


  getOperatorRevenue() {
    if (this.revenueChartRef) {
      try {
        this.revenueChartRef.drillUp();
      } catch { }
    }
    this.isOPrLoading = true;
    const reqParams = this.operatorFormRevenue.value;
    this.http.post(this.apiURL + "/operator-wise-revenue", reqParams).subscribe({
      next: (res: any) => {
        // console.log(res.data);

        const operatorSeries = res.data.map((item: any) => ({
          name: this.toTitleCase(item.organisation_name),
          y: item.total_revenue,
          drilldown: this.toTitleCase(item.organisation_name)
        }));

        const drilldownSeries = res.data.map((item: any) => {

          const busArray = Array.isArray(item.bus_wise) ? item.bus_wise : [];

          const busMap: { [key: string]: number } = {};
          busArray.forEach((bus: any) => {
            if (!busMap[bus.bus_number]) {
              busMap[bus.bus_number] = 0;
            }
            busMap[bus.bus_number] += bus.total_revenue;
          });

          const busData = Object.keys(busMap).map(busNumber => [
            busNumber,
            busMap[busNumber]
          ]);

          return {
            id: item.organisation_name,
            name: item.organisation_name + ' - Bus wise revenue',
            type: 'column',
            data: busData
          };
        });

        this.operatorRevenuechart = {
          ...this.operatorRevenuechart,
          series: [{
            name: 'Operators Revenue',
            type: 'column',
            colorByPoint: true,
            data: operatorSeries
          }],
          drilldown: {
            series: drilldownSeries
          }
        };
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isOPrLoading = false;
      }
    });
  }


  busCancelChartRef: Highcharts.Chart | null = null;

  onBusCancelChartInstance(chart: Highcharts.Chart) {
    this.busCancelChartRef = chart;
  }

  getOperatorBuscancel() {
    if (this.busCancelChartRef) {
      try {
        this.busCancelChartRef.drillUp();
      } catch { }
    }
    this.isOPbcLoading = true;
    const reqParams = this.opBuscancelForm.value;

    this.http.post(this.apiURL + "/operator-wise-busclose", reqParams).subscribe({
      next: (res: any) => {

        // Single date
        if (res.type === 'single_date') {

          const operatorSeries = res.data.map((item: any) => ({
            name: this.toTitleCase(item.organisation_name),
            y: item.total_cancel,
            busDetails: item.cancelled_buses || []
          }));

          this.operatorBusCancelchart = {
            ...this.operatorBusCancelchart,
            series: [{
              name: 'Operators',
              type: 'column',
              colorByPoint: true,
              data: operatorSeries
            }],
            drilldown: undefined
          };

          return;
        }

        //Date wise
        const dateSeries = res.data.map((day: any) => ({
          name: day.date,
          y: day.operators.reduce(
            (sum: number, op: any) => sum + op.total_cancel, 0
          ),
          drilldown: day.date
        }));

        const drilldownSeries = res.data.map((day: any) => ({
          id: day.date,
          name: `Operator wise cancel (${day.date})`,
          type: 'column',
          data: day.operators.map((op: any) => ({
            name: this.toTitleCase(op.organisation_name),
            y: op.total_cancel,
            date: day.date,
            busDetails: op.cancelled_buses || []
          }))
        }));


        this.operatorBusCancelchart = {
          ...this.operatorBusCancelchart,
          series: [{
            name: 'Date wise Cancel',
            type: 'column',
            colorByPoint: true,
            data: dateSeries
          }],
          drilldown: {
            series: drilldownSeries
          }
        };
      },
      error: (err) => console.error(err),
      complete: () => this.isOPbcLoading = false
    });
  }



  alloperator() {
    this.http.get(this.apiURL + "/busoperator").subscribe((res: any) => {
      this.busOperators = res.data;
    })
  }


  selectAll() {
    const ids = this.busOperators.map(op => op.id);
    this.operatorFormBooking.get('bus_operator_id')?.setValue(ids);
  }

  clearAll() {
    this.operatorFormBooking.get('bus_operator_id')?.setValue([]);
  }



  ngOnInit(): void {
    this.getRoute();
    this.getCity();
    this.getdaywise();
    this.getTotalseat();
    this.getOperator();
    this.getOperatorRevenue();
    this.alloperator();
    this.getOperatorBuscancel();
    this.cancelledTicketCountReport();
    this.refundAmountReport();
    this.cancellationChargesReport();
    this.getBusWiseLoss();
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
        name: 'Sleeper Not Booked',
        type: 'column',
        data: [],
        stack: 'America'
      },
      {
        name: 'Sleeper Booked',
        type: 'column',
        data: [],
        stack: 'America'
      },
      {
        name: 'Total Sleeper',
        type: 'column',
        data: [],
        stack: 'America'
      },

    ]
  };



  operatorchart: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Operator wise Booking'
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Total percent market share'
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y}'
        }
      }
    },

    series: [
      {
        name: 'Browsers',
        type: 'column',
        colorByPoint: true,
        data: [
        ]
      }
    ],

    drilldown: {
      series: [
        {
          id: 'Chrome',
          name: 'Chrome versions',
          type: 'column',
          data: []
        },
        {
          id: 'Safari',
          name: 'Safari versions',
          type: 'column',
          data: []
        }
      ]
    }

  };


  operatorRevenuechart: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Operator wise Revenue'
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Total percent market share'
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y}'
        }
      }
    },

    series: [
      {
        name: 'Browsers',
        type: 'column',
        colorByPoint: true,
        data: [
        ]
      }
    ],

    drilldown: {
      series: [
        {
          id: 'Chrome',
          name: 'Chrome versions',
          type: 'column',
          data: []
        },
        {
          id: 'Safari',
          name: 'Safari versions',
          type: 'column',
          data: []
        }
      ]
    }

  };

  operatorBusCancelchart: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Operator wise Bus Cancel'
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Total Cancel Count'
      }
    },
    legend: {
      enabled: false
    },

    tooltip: {
      useHTML: true,
      formatter: function () {

        const point = this.point as Highcharts.Point & BusPoint;

        let html = `
      <b>${point.name}</b><br/>
    `;

        if (point.date) {
          html += `<b>Date:</b> ${point.date}<br/>`;
        }

        html += `<b>Total Cancel:</b> ${point.y}<br/>`;

        if (point.busDetails?.length) {
          html += `<br/><b>Cancelled Buses:</b><br/>`;
          point.busDetails.forEach((bus, i) => {
            html += `${i + 1}. ${bus.cancel_bus}<br/>`;
          });
        }

        return html;
      }
    },



    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true
        }
      }
    },

    series: [
      {
        name: 'Operators',
        type: 'column',
        colorByPoint: true,
        data: []
      }
    ]
  };

  // Cancel Ticket Count Start
  TCRformData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
  });

  refreshTCR() {
    this.TCRformData.reset();
  }

  isTCRChartLoading: boolean = false;

  cancelledTicketCountReport() {
    this.isTCRChartLoading = true;

    const reqData = this.TCRformData.value;

    this.http.post(this.apiURL + '/cancelled-ticket-count', reqData).subscribe({
      next: (res: any) => {
        if (res.status === true) {

          const journeyDates = res.data.map(
            (item: any) => item.journey_date
          );

          const totalCancelledBookings = res.data.map(
            (item: any) => Number(item.total_cancel_bookings)
          );

          this.cancelTicketChart = {
            ...this.cancelTicketChart, // ✅ keep existing config

            chart: {
              type: 'column',
              inverted: false,
            },

            title: {
              text: '',
            },

            // ✅ CATEGORY AXIS (added)
            xAxis: {
              type: 'category',
              categories: journeyDates,
              title: {
                text: 'Journey Date',
              },
            },

            yAxis: {
              title: {
                text: 'Cancelled Bookings Count',
              },
            },

            // ✅ BETTER TOOLTIP (added)
            tooltip: {
              shared: true,
              pointFormat:
                '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
            },

            // ✅ DATA LABELS (added)
            plotOptions: {
              series: {
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  formatter: function () {
                    return this.y;
                  }
                }
              }
            },

            series: [
              {
                type: 'column',
                name: 'Cancelled Ticket Count',
                colorByPoint: true,
                data: totalCancelledBookings,
              },
            ],
          };

          this.updateFlag = true;
        }
      },
      error: (err) => console.error(err),
      complete: () => {
        this.isTCRChartLoading = false;
      }
    });
  }

  cancelTicketChart: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: '#0b0e11'
    },
    title: {
      text: 'Cancelled Ticket Count',
      style: { color: '#000', fontSize: '22px' }
    },
    xAxis: {
      type: 'category',        // ✅ added
      categories: [],
      crosshair: true,
      labels: { style: { color: '#000' } }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Cancelled Bookings Count',
        style: { color: '#000' }
      },
      labels: { style: { color: '#000' } }
    },
    legend: {
      itemStyle: { color: '#000' }
    },

    // ✅ improved tooltip
    tooltip: {
      shared: true
    },

    // ✅ data labels added
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y}'
        }
      }
    },

    series: [
      {
        name: 'Cancelled Ticket Count',
        type: 'column',
        data: [],
        colorByPoint: true,
      }
    ]
  };
  // Cancel Ticket Count End

  // Refund Amount Report Start
  RAformData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
  });

  refreshRA() {
    this.RAformData.reset();
  }

  isRAChartLoading: boolean = false;

  refundAmountReport() {
    this.isRAChartLoading = true;

    const reqData = this.RAformData.value;

    this.http.post(this.apiURL + '/refund-amount', reqData).subscribe({
      next: (res: any) => {
        if (res.status === true) {

          // console.log(res.data);

          // X-axis: Journey Dates
          const journeyDates = res.data.map(
            (item: any) => item.journey_date
          );

          // Y-axis: Total Refund Amount
          const totalRefundAmounts = res.data.map(
            (item: any) => Number(item.total_refund_amount)
          );

          this.refundAmountChart = {
            ...this.refundAmountChart,

            chart: {
              type: 'column',
              inverted: false,
            },

            title: {
              text: '',
            },

            // ✅ CATEGORY AXIS (added)
            xAxis: {
              type: 'category',
              categories: journeyDates,
              title: {
                text: 'Journey Date',
              },
            },

            yAxis: {
              title: {
                text: 'Total Refund Amount',
              },
            },

            // ✅ BETTER TOOLTIP (added)
            tooltip: {
              shared: true,
              pointFormat:
                '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>₹ {point.y}</b><br/>'
            },

            // ✅ DATA LABELS (added)
            plotOptions: {
              series: {
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  formatter: function () {
                    return '₹ ' + this.y;
                  }
                }
              }
            },

            series: [
              {
                type: 'column',
                name: 'Refund Amount',
                colorByPoint: true,
                data: totalRefundAmounts,
              },
            ],
          };

          this.updateFlag = true;
        }
      },
      error: (err) => console.error(err),
      complete: () => {
        this.isRAChartLoading = false;
      }
    });
  }

  refundAmountChart: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: '#0b0e11'
    },
    title: {
      text: 'Refund Amount',
      style: { color: '#000', fontSize: '22px' }
    },
    xAxis: {
      type: 'category',   // ✅ added
      categories: [],
      crosshair: true,
      labels: { style: { color: '#000' } }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total Refund Amount',
        style: { color: '#000' }
      },
      labels: { style: { color: '#000' } }
    },
    legend: {
      itemStyle: { color: '#000' }
    },

    // ✅ improved tooltip
    tooltip: {
      shared: true
    },

    // ✅ data labels added
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '₹ {point.y}'
        }
      }
    },

    series: [
      {
        name: 'Refund Amount',
        type: 'column',
        data: [],
        colorByPoint: true,
      }
    ]
  };
  // Refund Amount Report End

  // Cancellation Charges Report Start
  CCformData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
  });

  refreshCC() {
    this.CCformData.reset();
  }

  isCCChartLoading: boolean = false;

  cancellationChargesReport() {
    this.isCCChartLoading = true;

    const reqData = this.CCformData.value;

    this.http.post(this.apiURL + '/cancellation-charges', reqData).subscribe({
      next: (res: any) => {
        if (res.status === true) {

          console.log(res.data);

          // X-axis: Journey Dates
          const journeyDates = res.data.map(
            (item: any) => item.journey_date
          );

          // Y-axis: Total Refund Amount
          const totalRefundAmounts = res.data.map(
            (item: any) => Number(item.total_cancel_profit)
          );

          this.cancellationChargesChart = {
            ...this.cancellationChargesChart,

            chart: {
              type: 'column',
              inverted: false,
            },

            title: {
              text: '',
            },

            // ✅ CATEGORY AXIS (added)
            xAxis: {
              type: 'category',
              categories: journeyDates,
              title: {
                text: 'Journey Date',
              },
            },

            yAxis: {
              title: {
                text: 'Total Cancellation Charges',
              },
            },

            // ✅ BETTER TOOLTIP (added)
            tooltip: {
              shared: true,
              pointFormat:
                '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>₹ {point.y}</b><br/>'
            },

            // ✅ DATA LABELS (added)
            plotOptions: {
              series: {
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  formatter: function () {
                    return '₹ ' + this.y;
                  }
                }
              }
            },

            series: [
              {
                type: 'column',
                name: 'Cancellation Charges',
                colorByPoint: true,
                data: totalRefundAmounts,
              },
            ],
          };

          this.updateFlag = true;
        }
      },
      error: (err) => console.error(err),
      complete: () => {
        this.isCCChartLoading = false;
      }
    });
  }

  cancellationChargesChart: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: '#0b0e11'
    },
    title: {
      text: 'Cancellation Charges',
      style: { color: '#000', fontSize: '22px' }
    },
    xAxis: {
      type: 'category',   // ✅ added
      categories: [],
      crosshair: true,
      labels: { style: { color: '#000' } }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total Cancellation Charges',
        style: { color: '#000' }
      },
      labels: { style: { color: '#000' } }
    },
    legend: {
      itemStyle: { color: '#000' }
    },

    // ✅ improved tooltip
    tooltip: {
      shared: true
    },

    // ✅ data labels added
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '₹ {point.y}'
        }
      }
    },

    series: [
      {
        name: 'Cancellation Charges',
        type: 'column',
        data: [],
        colorByPoint: true,
      }
    ]
  };
  // Cancellation Charges Report End

  // Bus wise Loss Report Start
  BWLformData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
  });

  refreshBWL() {
    if (this.busWiseLossRef) {
      try {
        this.busWiseLossRef.drillUp();
      } catch { }
    }
    this.BWLformData.reset();
    this.getBusWiseLoss();
  }

  isBWLChartLoading: boolean = false;

  busWiseLossRef: Highcharts.Chart | null = null;

  onBusWiseLossChartInstance(chart: Highcharts.Chart) {
    this.busWiseLossRef = chart;
  }

  getBusWiseLoss() {
    if (this.busWiseLossRef) {
      try {
        this.busWiseLossRef.drillUp();
      } catch { }
    }

    this.isBWLChartLoading = true;
    const reqParams = this.BWLformData.value;

    this.http.post(this.apiURL + '/buswisetotalloss', reqParams).subscribe({
      next: (res: any) => {

        /*
         |--------------------------------------------------------------------------
         | DATE WISE → BUS WISE LOSS
         |--------------------------------------------------------------------------
         */

        const dateSeries = res.data.map((day: any) => ({
          name: day.journey_date,
          y: day.date_total_loss,
          drilldown: day.journey_date
        }));

        const drilldownSeries = res.data.map((day: any) => ({
          id: day.journey_date,
          name: `Bus wise Loss (${day.journey_date})`,
          type: 'column',
          data: day.buses.map((bus: any) => ({
            name: this.toTitleCase(bus.bus_name),
            y: bus.loss,
            date: day.journey_date,
            busDetails: [bus]
          }))
        }));

        this.busWiseLossChart = {
          ...this.busWiseLossChart,
          title: {
            text: 'Date wise Bus Loss'
          },
          yAxis: {
            title: {
              text: 'Total Loss Amount'
            }
          },
          series: [
            {
              name: 'Date wise Loss',
              type: 'column',
              colorByPoint: true,
              data: dateSeries
            }
          ],
          drilldown: {
            series: drilldownSeries
          }
        };
      },
      error: (err) => console.error(err),
      complete: () => this.isBWLChartLoading = false
    });
  }

  busWiseLossChart: Highcharts.Options = {
    chart: {
      type: 'column'
    },

    title: {
      text: 'Date wise Bus Loss'
    },

    xAxis: {
      type: 'category'
    },

    yAxis: {
      title: {
        text: 'Total Loss Amount'
      }
    },

    legend: {
      enabled: false
    },

    tooltip: {
      useHTML: true,
      formatter: function () {

        const point = this.point as Highcharts.Point & any;

        let html = `<b>${point.name}</b><br/>`;

        if (point.date) {
          html += `<b>Date:</b> ${point.date}<br/>`;
        }

        html += `<b>Total Loss:</b> ₹${point.y}<br/>`;

        if (point.busDetails?.length) {
          html += `<br/><b>Bus Details:</b><br/>`;
          point.busDetails.forEach((bus: any, i: number) => {
            html += `${i + 1}. ${bus.bus_name} — ₹${bus.loss}<br/>`;
          });
        }

        return html;
      }
    },

    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true
        }
      }
    },

    series: [
      {
        name: 'Date wise Loss',
        type: 'column',
        colorByPoint: true,
        data: []
      }
    ]
  };
  // Bus wise Loss Report End
}