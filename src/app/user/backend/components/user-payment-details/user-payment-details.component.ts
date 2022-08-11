import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-payment-details',
  templateUrl: './user-payment-details.component.html',
  styleUrls: ['./user-payment-details.component.css']
})
export class UserPaymentDetailsComponent implements OnInit {

  public showLoadingIndicator: boolean = false;

  private user_id: any;
  public payment_data: any;
  public other_payment_data: any;
  public property_det: any;

  constructor(
    private CommonService: CommonService,
    private jwtService: JwtService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let val = this.jwtService.getToken();
    if (val) {
      this.user_id = this.jwtService.getUserId();
    }
    this.get_rented_properties();
  }

  get_rented_properties() {
    this.showLoadingIndicator = true;
    this.CommonService.get_property_payment(this.user_id).subscribe(
      res => {
        this.showLoadingIndicator = false;
        let data:any=res;
        this.payment_data = data.data;
        this.other_payment_data=data.other_payment;

      },
      err => {
        this.showLoadingIndicator = false;
        console.log(err);
      }
    );
  }
  
rentslip(product_id:number){
  const url:any = this.router.createUrlTree(['/agent/property-rent-slip'],{queryParams:{'product_id':product_id}})
  window.open(url.toString(), '_blank')
}
  
  product_preview(id:number,name:string){
    const url:any = this.router.createUrlTree(['/product-preview'],{queryParams:{'id':id,'name':name}})
      window.open(url.toString(), '_blank')
  }
  
  viewInvoice(invoice_no: any) {
    const url:any = this.router.createUrlTree(['/invoice'],{ queryParams: { 'invoice_no': invoice_no } })
      window.open(url.toString(), '_blank')
  }

  moreDetails(property_details: any) {
    //console.log(property_details);
    this.property_det = property_details;
  }

}
