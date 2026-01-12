import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
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
import 'rxjs/add/operator/map';


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
  selector: 'app-landing1',
  templateUrl: './landing1.component.html',
  styleUrls: ['./landing1.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LandingComponent1 implements OnInit {
  private apiURL = Constants.BASE_URL;
  data: any;
  TopRoutes: any[] = [];
  TotalBooking: any[] = [];
  CitywiseBooking: any[] = [];
  MonthwiseRevenue: any[] = [];
  Hour: any[] = [];

  paymentData: any;
  passenger: any;


  totalSeat: any[] = [];
  totalSleeper: any[] = [];
  totalSeatbooked: any[] = [];
  totalSleeperbooked: any[] = [];
  totalSeatavl: any[] = [];
  totalSleeperavl: any[] = [];

  odbus: any[] = [];
  abhibus: any[] = [];
  paytm: any[] = [];

  TopCity: any;
  monthName: any;


  minEndDate: string = '';
  maxEndDate: string = '';

  form!: FormGroup;
  busOperators: any;

  totalBooking: any;
  totalRevenue: any;
  TotalRevenue: any;
  Routes: any;
  routePercentages: number[] = [];

  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private fb: FormBuilder) { }

  updateFlag = false;


  isOPbLoading: boolean = false;
  isOPrLoading: boolean = false;
  isPyamentLoading: boolean = false;
  isSeatLoading: boolean = false;
  isDayLoading: boolean = false;
  isBookingLoading: boolean = false;
  ismrLoading: boolean = false;
  isPeakLoading: boolean = false;
  isRouteRevenueLoading: boolean = false;
  isChartLoading: boolean = false;
  isBusRevenueLoading: boolean = false;
  isOPbcLoading: boolean = false;

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
    revenue_by: new FormControl('total_fare'),
    bus_operator_id: new FormControl([]),
  })


  PaymentFormData = new FormGroup({
    start_date: new FormControl(''),
    order: new FormControl('DESC'),
  })

  operatorFormSeat = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
  })


  DayFormData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
  })

  CityFormData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
  })

  peakBookingFormData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
  })

  monthBookingFormData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    order: new FormControl('DESC'),
  })

  monthRevenueFormData = new FormGroup({
    from_j_date: new FormControl(''),
    to_j_date: new FormControl(''),
    revenue_by: new FormControl('total_fare'),
  })

  RouteRevenueformData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
    revenue_by: new FormControl('total_fare'),
  });

  RouteformData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
  });

  busRevenueformData = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    bus_operator_id: new FormControl(''),
    bus_id: new FormControl(''),
    order: new FormControl(''),
    limit: new FormControl('10'),
  });

  opBuscancelForm = new FormGroup({
    from_date: new FormControl(''),
    to_date: new FormControl(''),
    order: new FormControl('DESC'),
    limit: new FormControl('10'),
    bus_operator_id: new FormControl([]),
  })


  //refresh 

  peakBookingrefresh() {
    this.peakBookingFormData.reset();
    this.getpeakBooking();
  }

  seatRefresh() {
    this.operatorFormSeat.reset();
    this.getTotalseat();
  }


  monthBookingRefresh() {
    this.monthBookingFormData.reset();
    this.getMonthBooking();
  }

  Revenuerfresh() {
    this.monthRevenueFormData.reset();
    this.getMonthRevenue();
  }

  routeBookingRefresh() {
    this.RouteRevenueformData.reset();
    this.getRouteRevenue();
  }

  routeRefresh() {
    this.RouteformData.reset();
    this.getRoute();
  }


  busRevenueRefresh() {
    this.busRevenueformData.reset();
    this.getBusRevenue();
  }




  toTitleCase(text: string): string {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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

  opRevenuefresh() {
    if (this.revenueChartRef) {
      try {
        this.revenueChartRef.drillUp();
      } catch { }
    }
    this.operatorFormRevenue.reset();
    this.getOperatorRevenue();
  }

  onStartDateChange(event: any) {
    const start = new Date(event.target.value);

    this.minEndDate = event.target.value;

    const max = new Date(start);
    max.setDate(max.getDate() + 30);

    this.maxEndDate = max.toISOString().split('T')[0];
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


  getPaymentdata() {
    // console.log(this.PaymentFormData.value);
    this.isPyamentLoading = true;
    const reqData = this.PaymentFormData.value;
    this.http.post(this.apiURL + "/payment-report", reqData).subscribe({
      next: (res: any) => {
        console.log(res.data);
        this.paymentData = res.data.map((item: any) => item.source);
        this.CitywiseBooking = res.data.map((item: any) => item.total_fare);

        this.paymentChart = {
          ...this.paymentChart,
          xAxis: {
            categories: this.paymentData,
          },
          series: [
            {
              name: 'Total Revenue',
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
        this.isPyamentLoading = false;
      }
    })
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



  alloperator() {
    this.http.get(this.apiURL + "/busoperator").subscribe((res: any) => {
      this.busOperators = res.data;
    })
  }

  busNames: any;

  onOperatorChange(operator: any) {
    // console.log('Selected operator:', operator.id);

    if (!operator?.id) {
      this.busNames = [];
      return;
    }

    this.http.get(this.apiURL + `/operatorBus/${operator.id}`)
      .subscribe((res: any) => {
        this.busNames = res.data;
        console.log(this.busNames);
        this.busNames.map((i: any) => { i.testing = i.name + ' - ' + i.bus_number + '(' + i.from_location[0].name + '>>' + i.to_location[0].name + ')'; return i; });
        // console.log(this.busNames)
      });
  }



  selectAll() {
    const ids = this.busOperators.map(op => op.id);
    this.operatorFormBooking.get('bus_operator_id')?.setValue(ids);
  }

  clearAll() {
    this.operatorFormBooking.get('bus_operator_id')?.setValue([]);
  }


  getPassenger() {
    this.http.post(this.apiURL + "/all-passengers", "").subscribe((res: any) => {
      this.passenger = res.data;
      // console.log(res.data)
    })
  }

  getTotalseat() {
    this.isSeatLoading = true;
    const reqParams = this.operatorFormSeat.value;
    // console.log(reqParams)
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

  getpeakBooking() {
    this.isPeakLoading = true;
    const reqData = this.peakBookingFormData.value;
    this.http.post(this.apiURL + "/peak-booking", reqData).subscribe({
      next: (res: any) => {
        this.Hour = res.data.map((item: any) => item.journey_dt);
        this.odbus = res.data.map((item: any) => Number(item.total_booking));


        // console.log(this.odbus)

        this.chartOptions = {
          ...this.chartOptions,
          xAxis: {
            categories: this.Hour,
          },
          series: [
            {
              name: 'Booking',
              type: 'line',
              color: 'blue',
              data: this.odbus
            }
          ],
        };

        this.updateFlag = true;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isPeakLoading = false;
      }
    });
  }

  getMonthBooking() {
    // console.log(this.CityFormData.value);
    this.isBookingLoading = true;
    const reqData = this.monthBookingFormData.value;
    // console.log(reqData);
    this.http.post(this.apiURL + "/month-wise-booking", reqData).subscribe({
      next: (res: any) => {
        // console.log(res.data);
        this.totalBooking = res.total;
        this.TopCity = res.data.map((item: any) => item.month_name);
        this.CitywiseBooking = res.data.map((item: any) => item.total_booking);

        this.monthBooking = {
          ...this.monthBooking,
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
        this.isBookingLoading = false;
      }
    })
  }

  getMonthRevenue() {
    // console.log(this.CityFormData.value);
    this.ismrLoading = true;
    const reqData = this.monthRevenueFormData.value;

    console.log(reqData);
    this.http.post(this.apiURL + "/month-wise-revenue", reqData).subscribe({
      next: (res: any) => {
        // console.log(res.data);
        this.totalRevenue = res.total
        this.monthName = res.data.map((item: any) => item.month_name);
        this.MonthwiseRevenue = res.data.map((item: any) => item.total_revenue);

        this.monthRevenuechart = {
          ...this.monthRevenuechart,
          xAxis: {
            categories: this.monthName,
          },
          series: [
            {
              name: 'Total Revenue',
              type: 'bar',
              data: this.MonthwiseRevenue,
            },
          ],
        };

        this.updateFlag = true;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.ismrLoading = false;
      }
    })
  }


  getRouteRevenue() {
    this.isRouteRevenueLoading = true;

    const reqData = this.RouteRevenueformData.value;

    this.http.post(this.apiURL + '/route-wise-revenue', reqData).subscribe({
      next: (res: any) => {
        if (res.status === true) {

          this.Routes = res.data.map((item: any) => item.Route);
          this.TotalRevenue = res.data.map((item: any) => item.TotalRevenue);

          this.routeRevenueChart = {
            ...this.routeRevenueChart,
            xAxis: {
              categories: this.Routes,
            },
            series: [
              {
                name: 'Revenue',
                type: 'bar',
                data: this.TotalRevenue,
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
        this.isRouteRevenueLoading = false;
      }
    });
  }

  getRoute() {
    this.isChartLoading = true;

    const reqData = this.RouteformData.value;

    this.http.post(this.apiURL + '/top-route', reqData).subscribe({
      next: (res: any) => {
        if (res.status === true) {

          this.TopRoutes = res.data.map((item: any) => item.Route);
          this.TotalBooking = res.data.map((item: any) => item.TotalBooking);

          // 👉 NEW: Percentage array (convert to number)
          this.routePercentages = res.data.map((item: any) =>
            parseFloat(item.Percentage)
          );

          this.routeChart = {
            ...this.routeChart,
            xAxis: {
              ...this.routeChart.xAxis,
              categories: this.TopRoutes.map((route, i) =>
                `${route} (${this.routePercentages[i]}%)`
              )
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

  BusName: any[] = [];
  OwnerName: any[] = [];
  BusWiseRevenue: any[] = [];



  getBusRevenue() {
    this.isBusRevenueLoading = true;

    const busIds = this.busRevenueformData.value.bus_id;
    const bus_operator_id = this.busRevenueformData.value.bus_operator_id;
    const start_date = this.busRevenueformData.value.start_date;
    const end_date = this.busRevenueformData.value.end_date;

    const reqData = {
      bus_id: Array.isArray(busIds) ? busIds : busIds ? [busIds] : [],
      operator_id: bus_operator_id,
      start_date: start_date,
      end_date: end_date,
    };

    this.http.post(this.apiURL + '/bus-wise-revenue', reqData).subscribe({
      next: (res: any) => {
        console.log(res.status);
        if (res.status === 200) {

          this.BusName = res.data.map((item: any) => item.bus_name);
          this.OwnerName = res.data.map((item: any) => item.organisation_name);
          this.BusWiseRevenue = res.data.map((item: any) => item.total_owner_fare);

          // 👉 NEW: Percentage array (convert to number)
          // this.routePercentages = res.data.map((item: any) =>
          //   parseFloat(item.Percentage)
          // );

          this.busRevenueChart = {
            ...this.busRevenueChart,
            xAxis: {
              ...this.busRevenueChart.xAxis,
              categories: this.BusName.map((route, i) =>
                `${route} (${this.OwnerName[i]})`
              )
              // categories: `this.BusName + (this.OwnerName)`,

            },
            series: [
              {
                name: 'Total Revenue',
                type: 'bar',
                data: this.BusWiseRevenue,
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
        this.isBusRevenueLoading = false;
      }
    });
  }

  // busCancelChartRef: Highcharts.Chart | null = null;
  
  //   onBusCancelChartInstance(chart: Highcharts.Chart) {
  //     this.busCancelChartRef = chart;
  //   }

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




  ngOnInit(): void {
    this.getOperator();
    this.getOperatorRevenue();
    this.alloperator();
    this.getPassenger();
    this.getPaymentdata();
    this.getTotalseat();
    this.getpeakBooking();
    this.getMonthBooking();
    this.getMonthRevenue();
    this.getRouteRevenue();
    this.getRoute();
    this.getBusRevenue();
    this.getOperatorBuscancel();
  }

  Highcharts: typeof Highcharts = Highcharts;

  //Operator wise Booking
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


  //Operator wise Revenue
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

  // Payment Received
  paymentChart: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: '#0b0e11'
    },
    title: {
      text: 'Payment Received',
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


  //Month wise Revenue
  monthRevenuechart: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: '#0b0e11'
    },
    title: {
      text: 'Month wise Revenue',
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

  // Total Seats(Filled vs Empty)
  seatChart: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Total Seats(Filled vs Empty)'
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

  // Peak Booking Dates
  chartOptions: Highcharts.Options = {
    chart: {
      backgroundColor: '#0b0e11',
      type: 'line'
    },
    title: {
      text: 'Peak Booking Dates',
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
        name: 'Total Booking',
        type: 'line',
        color: 'blue',
        data: []
      }
    ]
  };


  //For Month wise booking
  monthBooking: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: '#0b0e11'
    },
    title: {
      text: 'Month Wise Booking',
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

  // Route wise Revenue
  routeRevenueChart: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: '#121212',
    },

    title: {
      text: 'Route Wise Revenue In Rupees',
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


  //Routes wise Booking
  routeChart: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: '#121212',
    },

    title: {
      text: 'Route Wise Booking In Numbers',
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

  //Routes wise Booking
  busRevenueChart: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: '#121212',
    },

    title: {
      text: 'Bus Wise Revenue In Rupees',
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


}
