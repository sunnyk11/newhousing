import { Component, OnInit } from '@angular/core';
import { PlansServiceService } from '../../services/plans-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.css']
})
export class PaymentSummaryComponent implements OnInit {
  
  public order_id: any;
  public price_amount: any;
  public gst_amount: any;
  public total_amount: any;
  public payment_type: any;
  public paytm_data: any;
  public content: any;
  public paytm_form_url: string = environment.Paytm_formURL;
  public response:any={}; 
  public mode_payment: number = 1;
  public response_data:any;

  constructor(
    private PlansServiceService:PlansServiceService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void{
    this.order_id = this.route.snapshot.queryParams['orderID'];
    this.PlansServiceService.getOrderDetails(this.order_id).subscribe(
      response => {
        console.log(response);
        this.response_data = response;
        this.response=this.response_data[0];
        this.price_amount = this.response_data[0].plan_price;
        this.gst_amount = (18 * this.price_amount) / 100;
        this.total_amount = this.price_amount + this.gst_amount;
        this.payment_type = this.response_data[0].payment_type;
      },
      err => {
        // console.log(err);
      }
    );
  }
  
  proceedToPayment(orderID:any) {
    this.PlansServiceService.proceedToPayment(orderID).subscribe(
      response => {
        this.response=response;
        if(this.response.status == 201) {
          this.paytm_data = this.response.data;
          this.createPaytmForm();
        }
        else {
          
        }
      },
      err => {
        this.content = err.error.message;
      }
    );
  }

  createPaytmForm() {
    const my_form: any = document.createElement('form');
     my_form.name = 'paytm_form';
     my_form.method = 'post';
     my_form.action = this.paytm_form_url;
  
     const myParams = Object.keys(this.paytm_data);
     for (let i = 0; i < myParams.length; i++) {
       const key = myParams[i];
       let my_tb: any = document.createElement('input');
       my_tb.type = 'hidden';
       my_tb.id = key;
       my_tb.name = key;
       my_tb.value = this.paytm_data[key];
       my_form.appendChild(my_tb);
     };
     // console.log(my_form);
     document.body.appendChild(my_form);
     my_form.submit();
   // after click will fire you will redirect to paytm payment page.
   // after complete or fail transaction you will redirect to your CALLBACK URL
   }
   generateInvoice(orderID:any) {
    let param = { orderID: orderID }
    this.PlansServiceService.generateInvoice(param).subscribe(
      response => {
        let res:any=response;
        this.router.navigate(['/agent/invoice'], { queryParams: { 'invoice_no': res.data } });
      },
      err => {
        console.log(err);
      }
    );
 }


}
