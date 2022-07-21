import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/user/services/jwt.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  public LoggedIn: boolean = false;
  public token: string=' ';
  public user_blocked_status:boolean=false;

  constructor(
    private jwtService: JwtService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    //console.log("Log Out");
    if(this.jwtService.getUserBlockStatus()==1){
      this.user_blocked_status=true;
    }
    this.jwtService.signOut();
    if(this.jwtService.isTokenAvailable()) {
      //console.log("Logout Page: Token Available");
      //console.log(this.jwtService.getToken());
    }
    else {
      //console.log("Logout Page: Token Not Available");
    }
    this.token=this.jwtService.getToken();
    this.commonService.sendUpdate(this.LoggedIn,this.token);
  }

}
