import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  public returnUrl:any;

  constructor(
    private titleService: Title,
    private jwtService: JwtService,
    private router:Router) { }

  ngOnInit(): void {    this.titleService.setTitle('FAQ Page');
    if(this.jwtService.getToken()){
      this.returnUrl = this.router.url;
      this.jwtService.saveReturnURL(this.returnUrl);
    }
  }

}
