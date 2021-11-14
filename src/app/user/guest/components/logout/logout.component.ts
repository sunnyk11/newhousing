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

  constructor(
    private jwtService: JwtService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    //console.log("Log Out");
    this.jwtService.signOut();
    if(this.jwtService.isTokenAvailable()) {
      //console.log("Logout Page: Token Available");
      //console.log(this.jwtService.getToken());
    }
    else {
      //console.log("Logout Page: Token Not Available");
    }
    this.commonService.sendUpdate(this.LoggedIn, "", "");
  }

}
