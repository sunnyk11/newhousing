import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  public returnUrl:any;

  constructor(
    private jwtService: JwtService,
    private router:Router) { }

  ngOnInit(): void {
    if(this.jwtService.getToken()){
      this.returnUrl = this.router.url;
      this.jwtService.saveReturnURL(this.returnUrl);
    }
  }

}
