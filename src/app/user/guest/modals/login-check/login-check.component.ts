import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/user/services/jwt.service';

@Component({
  selector: 'app-login-check',
  templateUrl: './login-check.component.html',
  styleUrls: ['./login-check.component.css']
})
export class LoginCheckComponent implements OnInit {

  public returnUrl: string = '';
  public plan_price: number = 0;

  @Input() fromParent:any;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private jwtService: JwtService
    ) { }

  ngOnInit(): void {
    //console.log(this.fromParent);
  }

  actionFunction(url:any) {

    this.closeModal("");
    this.returnUrl = this.router.url; 
    console.log(this.returnUrl);
    console.log(this.fromParent);
    if (this.returnUrl == '/plans') {
      if(this.fromParent.expected_rent){
        if(this.fromParent.price_duration_discount) {
          this.plan_price = this.fromParent.expected_rent / (30 / this.fromParent.price_duration_discount);
        }
        else {
          this.plan_price = this.fromParent.expected_rent / (30 / this.fromParent.price_duration_actual);
        }
        this.fromParent.plan_price = this.plan_price;
        console.log(this.fromParent);
        this.jwtService.savePlansData(this.fromParent);
      }
    }
    this.jwtService.saveReturnURL(this.returnUrl);
    if(this.returnUrl){
      let modified_url:any=this.returnUrl.split('?')[0];
      if (modified_url == '/product-details') {
        this.fromParent.page_name = this.returnUrl;
        this.jwtService.savePlansData(this.fromParent);
  
      }
    }
    
      if(url=='login'){
        this.router.navigate(['/login']);
      }
      if(url=='signup'){
        this.router.navigate(['/sign-up']);
      }
  }
  closeModal(sendData:any) {
    this.activeModal.close(sendData);
  }

}
