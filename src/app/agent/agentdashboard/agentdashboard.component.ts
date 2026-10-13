import { Component, OnInit } from '@angular/core';
import { Constants } from '../../constant/constant';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-agentdashboard',
  templateUrl: './agentdashboard.component.html',
  styleUrls: ['./agentdashboard.component.scss'],
})
export class AgentdashboardComponent implements OnInit {
  private apiURL = Constants.BASE_URL;

  grossbookings: number = 0;
  totalpnrs: number = 0;
  commissions: number = 0;
  walletbalance: number = 0;
  newtoday: number = 0;
  newthismonth: number = 0;
  kycpending: number = 0;
  activatedagents: number = 0;
  firstbookingpending: number = 0;
  activeagents: number = 0;
  dormantagents: number = 0;
  inactiveagents: number = 0;
  totalagents: number = 0;
  topagents: any[] = [];
  topoperators: any[] = [];
  topagentroutes: any[] = [];

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.spinner.show();
    this.getAgentDashboard();
  }

  getAgentDashboard(): void {
    const data = {};

    this.http.post<any>(this.apiURL + '/agentdashboard', data).subscribe(
      (response) => {
        if (response.status === '1') {
          this.grossbookings = Number(response.data.grossbookings);
          this.totalpnrs = Number(response.data.totalpnrs);
          this.commissions = Number(response.data.commissions);
          this.walletbalance = Number(response.data.walletbalance);
          this.newtoday = Number(response.data.newtoday);
          this.newthismonth = Number(response.data.newthismonth);
          this.kycpending = Number(response.data.kycpending);
          this.activatedagents = Number(response.data.activatedagents);
          this.firstbookingpending = Number(response.data.firstbookingpending);
          this.activeagents = Number(response.data.activeagents);
          this.dormantagents = Number(response.data.dormantagents);
          this.inactiveagents = Number(response.data.inactiveagents);
          this.totalagents = Number(response.data.totalagents);
          this.topagents = response.data.topagents;
          this.topoperators = response.data.topoperators;
          this.topagentroutes = response.data.topagentroutes;
        }

        this.spinner.hide();

        // console.log('Agent dashboard API response:', response);
      },
      (error) => {
        this.spinner.hide();
        console.error('Agent dashboard API error:', error);
      },
    );
  }
}
