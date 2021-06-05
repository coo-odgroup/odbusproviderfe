import { Component, OnInit, ViewEncapsulation,ElementRef,ViewChild} from '@angular/core';
import { SupportChartData1} from '../chart/support-chart-data-1';
import { SupportChartData2} from '../chart/support-chart-data-2';
import { SeoChart1 } from '../chart/seo-chart-1';
import { SeoChart2 } from '../chart/seo-chart-2';
import { SeoChart3 } from '../chart/seo-chart-3';
import { PowerCardChart1 } from '../chart/power-card-chart-1';
import { PowerCardChart2 } from '../chart/power-card-chart-2';


import * as Highcharts from 'highcharts';
import * as HC_more from 'highcharts/highcharts-more';
import HC_drilldown from 'highcharts/modules/drilldown';
HC_drilldown(Highcharts);

import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingComponent implements OnInit {

    public supportChartData1: any;
    public supportChartData2: any;
    public seoChartData1: any;
    public seoChartData2: any;
    public seoChartData3: any;
    public powerCardChartData1: any;
    public powerCardChartData2: any;


    public barBasicChartOptions: any;
    public pie2CAC:any;
   
    public Highcharts = Highcharts;

    public isCollapsed: boolean;
    public isMail: string;
    public isSubMail: string;



  

    public barBasicChartData: any;
  public barBasicChartOption: any;
  @ViewChild('barBasicChart') barBasicChart: ElementRef; // used barStackedChart, barHorizontalChart
  public barBasicChartTag: CanvasRenderingContext2D;


    constructor() {
 
      this.isCollapsed = false;
      this.isMail = 'inbox';
      this.isSubMail = 'primary';

      this.pie2CAC = {
        chart: {
          height: 320,
          type: 'donut',
        },
        series: [ 41, 17, 15],
        
        labels: ['Mobile', 'Desktop', 'App'],
        colors: [ '#00acc1', '#ffa21d', '#ff5252'],
        legend: { show: true, position: 'bottom',},
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true
                },
                value: {
                  show: true
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: true,
          dropShadow: {
            enabled: false,
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              show: true,
              floating: true,
              fontSize: '16px',
              position: 'left',
              offsetX: 0,
              offsetY: 0,
              labels: {
                useSeriesColors: true,
              },
              markers: {
                size: 0
              },
              formatter: (seriesName, opts) => seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex],
              itemMargin: {
                horizontal: 1,
              }
            }
          }
        }]
      };

    
      this.barBasicChartOptions = {
        chart: {
          type: 'column'
        },
        colors: ['#1abc9c', '#000000', '#2ecc71'],
        title: {
          text: 'Monthly Average Ticket Booking'
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Booking'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:6px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.1,
            borderWidth: 0
          }
        },
        series: [{
          name: 'Total Tickets',
          data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

        }, {
          name: 'Desktop Tickets',
          data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

        }, {
          name: 'App Tickets',
          data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

        }]
      };

      this.barBasicChartOption = {
        barValueSpacing: 20
      };
      
    }

    ngAfterViewInit()
    {

      setTimeout(() => {
        const barBasicTag = (((this.barBasicChart.nativeElement as HTMLCanvasElement).children));
      this.barBasicChartTag = ((barBasicTag['bar_basic_chart']).lastChild).getContext('2d');
      const abc = (this.barBasicChartTag).createLinearGradient(0, 300, 0, 0);
      abc.addColorStop(0, '#00acc1');
      abc.addColorStop(1, '#1abc9c');
      const def = (this.barBasicChartTag).createLinearGradient(0, 300, 0, 0);
      def.addColorStop(0, '#0e9e4a');
      def.addColorStop(1, '#0e9e4a');
      this.barBasicChartData = {
        labels: ['Jan-1','Jan-2','Jan-3','Jan-4','Jan-5','Jan-6','Jan-7','Jan-8'],
        datasets: [{
          label: 'PNR',
          data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.54],
          borderColor: abc,
          backgroundColor: abc,
          hoverborderColor: abc,
          hoverBackgroundColor: abc,
        }]
      };
        
    });
      
    }
  
    ngOnInit() {
    }

}
