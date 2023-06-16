import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  public returnUrl:any;
  

  constructor( private jwtService: JwtService,
    private router:Router,private titleService: Title) { }

  ngOnInit(): void {
    if(this.jwtService.getToken()){
      this.returnUrl = this.router.url;
      this.jwtService.saveReturnURL(this.returnUrl);
    }
    this.titleService.setTitle('About Page');
  }
  

}
