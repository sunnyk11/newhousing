import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../services/jwt.service';
import { Subscription } from 'rxjs';
import { CommonService } from '../../guest/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-guest-header',
  templateUrl: './guest-header.component.html',
  styleUrls: ['./guest-header.component.css']
})
export class GuestHeaderComponent implements OnInit {

  public LoggedIn: boolean = false;
  public userEmail: string = '';
  public userId: string = '';
  public profile_pic: string = '';
  public userName: string = '';
  private logged_in: Subscription;
  public ftpstring = environment.ftpURL;


  constructor(
    private jwtService: JwtService,
    private commonService: CommonService 
  ) { 
    this.logged_in = this.commonService.getUpdate().subscribe(
      message => {
        //console.log(message);
        this.LoggedIn = message.text;
      });
  }

  ngOnInit(): void {
    //console.log(this.LoggedIn);
    if(this.jwtService.isTokenAvailable()) {
      //console.log("Token Available");
      this.LoggedIn = true;
      this.userEmail = this.jwtService.getUserEmail();
      //console.log(this.userEmail);
      this.userId = this.jwtService.getUserId();
      this.profile_pic = JSON.parse(this.jwtService.getProfilePic());
      this.userName = JSON.parse(this.jwtService.getUserName());
      //console.log(this.profile_pic);
    }
    else {
      this.LoggedIn = false;
    }
  }

}
