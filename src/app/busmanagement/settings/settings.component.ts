import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {SettingsService} from '../../services/settings.service';
import { SettingsRecords } from '../../model/settings';
import { Constants } from '../../constant/constant';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {

  
  settingRecord: SettingsRecords;

  constructor( ) { }
  ngOnInit(): void {
    
  }
 
}
