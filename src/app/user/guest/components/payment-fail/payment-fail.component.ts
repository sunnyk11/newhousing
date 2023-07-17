import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-fail',
  templateUrl: './payment-fail.component.html',
  styleUrls: ['./payment-fail.component.css']
})
export class PaymentFailComponent implements OnInit {

  public showLoadingIndicator: boolean = false;

  private user_id: any;
  public payment_data: any;
  public property_det: any;

  constructor(
    private CommonService: CommonService,
    private jwtService: JwtService,private titleService: Title,
    private router: Router
  ) { }

  ngOnInit(): void {   this.titleService.setTitle('Payment-Failed');
    let val = this.jwtService.getToken();
    if (val) {
      this.user_id = this.jwtService.getUserId();
    }
    this.get_rented_properties();
  }

  get_rented_properties() {
    this.showLoadingIndicator = true;
    this.CommonService.user_paymentfail().subscribe(
      res => {
        // console.log(res);
        this.showLoadingIndicator = false;
        let data:any=res;
        this.payment_data = data.data;

      },
      err => {
        this.showLoadingIndicator = false;
        console.log(err);
      }
    );
  }
  
  product_preview(id:number,name:string){
    const url:any = this.router.createUrlTree(['/product-preview'],{queryParams:{'id':id,'name':name}})
      window.open(url.toString(), '_blank')
  }
  
  product_checkout(product_id: any) {
    const url:any = this.router.createUrlTree(['/product_payment_summary'],{ queryParams: { 'productID': product_id } })
      window.open(url.toString(), '_blank')
  }

}
