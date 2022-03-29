import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/user/services/jwt.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-real-estate-agent',
  templateUrl: './real-estate-agent.component.html',
  styleUrls: ['./real-estate-agent.component.css']
})
export class RealEstateAgentComponent implements OnInit {
  
  public returnUrl: any;

  constructor(
    private jwtService: JwtService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
  }
  navigate() {
    this.returnUrl = this.router.url;
    this.jwtService.removeReturnURL();
    this.jwtService.saveReturnURL(this.returnUrl);
    this.router.navigate(['/sign-up'])
  }

}
