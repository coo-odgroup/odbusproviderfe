import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialmediaService }  from '../../services/socialmedia.service';
import { SocialMedia } from '../../model/socialmedia';
import { NotificationService } from '../../services/notification.service';



@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.scss']
})
export class SocialmediaComponent implements OnInit {
  public socialFrom: FormGroup;
  socialdata: SocialMedia[] ;
  socialdataRecord: SocialMedia ;

  constructor(
    private fb: FormBuilder,
    private sm:SocialmediaService,
    private notificationService: NotificationService
  ) { }

 

  ngOnInit(): void {
   

    this.socialFrom = this.fb.group({
      facebook_link:[''],
      twitter_link:[''],
      instagram_link:[''],
      googleplus_link:[''],
      linkedin_link:['']
    }) 

    this.getdata();   

  }
  getdata()
  {
    this.sm.readAll().subscribe(
      res => {
        this.socialdata= res.data;
        this.socialdataRecord =this.socialdata[0] ;

        this.socialFrom.controls.facebook_link.setValue(this.socialdataRecord.facebook_link);
        this.socialFrom.controls.twitter_link.setValue(this.socialdataRecord.twitter_link);
        this.socialFrom.controls.instagram_link.setValue(this.socialdataRecord.instagram_link);
        this.socialFrom.controls.googleplus_link.setValue(this.socialdataRecord.googleplus_link);
        this.socialFrom.controls.linkedin_link.setValue(this.socialdataRecord.linkedin_link);
        // console.log( this.socialdata); 
      }
    );

  }

  update()
  {
    this.socialdataRecord = this.socialFrom.value;
    
    const data = {
      facebook_link: this.socialdataRecord.facebook_link,
      twitter_link:this.socialdataRecord.twitter_link,
      instagram_link :this.socialdataRecord.instagram_link,
      googleplus_link:this.socialdataRecord.googleplus_link,
      linkedin_link:this.socialdataRecord.linkedin_link,     
    };
    // console.log(data);

    this.sm.update(data).subscribe(
      res => {
        if(res.status==1)
        {           
            this.notificationService.addToast({title:'Success',msg:res.message, type:'success'});
            this.getdata();
        }
        else{
            this.notificationService.addToast({title:'Error',msg:res.message, type:'error'});
        }

      }
    );
  }



}
