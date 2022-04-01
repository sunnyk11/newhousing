import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fixed-appointment',
  templateUrl: './fixed-appointment.component.html',
  styleUrls: ['./fixed-appointment.component.css']
})
export class FixedAppointmentComponent implements OnInit {

  public returnUrl:any;
  public modified_url:any;

  constructor(
    private jwtService: JwtService,
    private router: Router) { }

  ngOnInit(): void {
    this.returnUrl = this.jwtService.getReturnURL();
    if(this.returnUrl){
      this.modified_url=this.returnUrl.split('?')[0];
    }
    if(this.returnUrl?.includes('/plans')==true){
    }else if(this.modified_url?.includes('/product-details')==true){
    }else{      
      this.router.navigate(['/plans']);
    }
  }
  navigate(){
    if(this.returnUrl?.includes('/plans')==true){
      this.router.navigate([this.returnUrl])
    }else if(this.modified_url?.includes('/product-details')==true){
      let x:any=this.returnUrl.split('?')[1];
      let y:any=x.split('&')[0];
      let z:any=x.split('&')[1];
      this.router.navigate([this.modified_url],{queryParams:{'id':y.split('=')[1],'name':z.split('=')[1]}})
    }else{ }
  }

}
