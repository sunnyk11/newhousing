import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/user/services/jwt.service';
import { interval } from 'rxjs';
import { Router } from '@angular/router';import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-visit-user-thank',
  templateUrl: './visit-user-thank.component.html',
  styleUrls: ['./visit-user-thank.component.css'],
})
export class VisitUserThankComponent implements OnInit {
  public count_number:any;
  public returnUrl:any;  
  public modified_url:any;  

  constructor(private titleService: Title,
    private jwtService: JwtService,
    private router: Router) { }

  ngOnInit(): void { this.titleService.setTitle('Visit-User-thank');
    this.jwtService.getReturnURL();
    
    const obs$=interval(1000);
    obs$.subscribe((d)=>{
      let data_check:number=1;
      if(data_check>0){
        this.count_number=3-d;
        data_check =this.count_number;
      }
    });
    this.returnUrl = this.jwtService.getReturnURL();
    this.modified_url=this.returnUrl.split('?')[0];
    setTimeout(()=>{ 
      this. redirection();
    }, 4000)
  }
  redirection(){
    if(this.modified_url?.includes('/product-details')==true){
      let x:any=this.returnUrl.split('?')[1];
      let y:any=x.split('&')[0];
      let z:any=x.split('&')[1];
      this.router.navigate([this.modified_url],{queryParams:{'id':y.split('=')[1],'name':z.split('=')[1]}})
    }
   else if(this.returnUrl?.includes('/product-listing')==true){
      this.router.navigate(['/product-listing'])
    }
    else  if(this.returnUrl?.includes('/')==true){
      this.router.navigate(['/'])
    } 
    else{ }

  }

}
