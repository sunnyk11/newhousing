import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlansPageService } from '../../services/plans-page.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.css']
})
export class PaymentSummaryComponent implements OnInit {

  public showLoadingIndicator: boolean = false;

  private order_id: any;
  public response: any;
  public order_response: any;
  public price_amount: any;
  public gst_amount: any;
  public total_amount: any;
  public payment_type: any;

  public online_pay_btn: boolean = true;
  public cash_pay_btn: boolean = false;
  public mode_payment: any = 'Online';
  private payment_result: any;
  public paytm_data: any;
  public content: any;
  private paytm_form_url: string = environment.Paytm_formURL;
  public invoice_data: any;

  constructor(private route: ActivatedRoute,
    private plansPageService: PlansPageService,
    private router: Router) { }

  ngOnInit(): void {
    this.showLoadingIndicator = true;
    this.order_id = this.route.snapshot.queryParams['orderID'];
    console.log(this.order_id);
    this.plansPageService.getOrderDetails(this.order_id).subscribe(
      res => {
        this.showLoadingIndicator = false;
        console.log(res);
        this.response = res;
        this.order_response = this.response[0];
        this.price_amount = this.order_response.plan_price;
        this.gst_amount = (18 * this.price_amount) / 100;
        this.total_amount = this.price_amount + this.gst_amount;
        this.payment_type = this.order_response.payment_type;
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  }

  changePayment(e:any) {
    //console.log(e.target.value);
    if(e.target.value == 'Online') {
      this.online_pay_btn = true;
      this.cash_pay_btn = false;
      this.mode_payment = "Online";
    }
    else if (e.target.value == 'Cash') {
      this.online_pay_btn = false;
      this.cash_pay_btn = true;
      this.mode_payment = "Cash";
    }
  }

  proceedToPayment(orderID:any) {
    this.showLoadingIndicator = true;
    console.log("Proceed to Payment");
    this.plansPageService.proceedToPayment(orderID).subscribe(
      res => {
        this.showLoadingIndicator = false;
        console.log(res);
        this.payment_result = res;
        if (this.payment_result.status == 201) {
          this.paytm_data = this.payment_result.data;
          this.createPaytmForm();
        }
        else {

        }
      },
      err => {
        this.showLoadingIndicator = false;
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
    this.showLoadingIndicator = true;
    this.plansPageService.generateInvoice(orderID).subscribe(
      res => {
        this.showLoadingIndicator = false;
        console.log(res);
        this.invoice_data = res;
        this.router.navigate(['/invoice'], { queryParams: { 'invoice_no': this.invoice_data.data } });
      },
      err => {
        this.showLoadingIndicator = false;
        console.log(err);
      }
    );
  }

}
