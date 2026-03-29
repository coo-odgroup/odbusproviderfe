import {Component, OnInit} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {

  username:any;
  constructor(public router: Router) { }

  ngOnInit() { 
    this.username=sessionStorage.getItem("USERNAME");
  }
  logout()
  {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
