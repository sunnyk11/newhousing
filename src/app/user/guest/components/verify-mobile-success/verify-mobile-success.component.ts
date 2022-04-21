import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';
import { VerifyMobileService } from '../../services/verify-mobile.service';
import { PlansPageService } from '../../services/plans-page.service';
import { environment } from 'src/environments/environment';
import { LoginPageService } from '../../services/login-page.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-verify-mobile-success',
  templateUrl: './verify-mobile-success.component.html',
  styleUrls: ['./verify-mobile-success.component.css']
})
export class VerifyMobileSuccessComponent implements OnInit {
  public previousUrl:any;  
  private plan_price: number = 0;
  public showLoadingIndicator: boolean = false;
  public property_data: any;
  private user_id: any;
  private userEmail: any;
  public selectedPlanData: any;
  private payment_result: any;
  private paytm_data: any;
  private paytm_form_url: string = environment.Paytm_formURL;
  private invoice_result: any;
  public plansData: any;
  public letOutPlanData: any;
  public modified_url:any;
  public count_number:any;


  constructor(
    private jwtService: JwtService,
    private loginPageService: LoginPageService,
    private plansPageService: PlansPageService,
    private router: Router) { }

  ngOnInit(): void {
    
    const obs$=interval(1000);
    obs$.subscribe((d)=>{
      let data_check:number=1;
      if(data_check>0){
        this.count_number=3-d;
        data_check =this.count_number;
      }
    });
    this.previousUrl = this.jwtService.getReturnURL();
    setTimeout(()=>{ 
      this. redirection();
    }, 4000)
  }
  redirection(){
    
    if (this.previousUrl.includes('product_payment_summary')) {
      //console.log(this.previousUrl);
      this.property_data = JSON.parse(this.jwtService.getPlansData());
      //console.log(this.property_data);
      this.property_data.user_id = this.user_id;
      this.property_data.user_email = this.userEmail;
      //console.log(this.property_data);

      this.plansPageService.postSelectedRentPlan(this.property_data).subscribe(
        res => {
          //console.log(res);
          this.selectedPlanData = res;
          if (this.property_data.payment_mode == 'Online') {
            this.plansPageService.proceedToPaymentRent(this.selectedPlanData.data.order_id).subscribe(
              result => {
                //console.log(result);
                this.payment_result = result;
                if (this.payment_result.status == 201) {
                  this.paytm_data = this.payment_result.data;
                  this.createPaytmForm();
                }
              },
              error => {
                console.log(error);
              }
            );
          }
          else if (this.property_data.payment_mode == 'Cash') {
            this.plansPageService.generateRentInvoice(this.selectedPlanData.data.order_id).subscribe(
              result => {
                //console.log(result);
                this.invoice_result = result;
                this.router.navigate(['/invoice'], { queryParams: { 'invoice_no': this.invoice_result.data } });
              },
              err => {
                console.log(err);
              }
            );
          }
        }
      );
      this.jwtService.removeReturnURL();
    }
    else if (this.previousUrl.includes('plans')) {
      //console.log(this.previousUrl);
      this.plansData = JSON.parse(this.jwtService.getPlansData());
      //console.log(this.plansData);
      this.plansData['user_id'] = this.user_id;
      this.plansData['user_email'] = this.userEmail;
      this.plansPageService.postSelectedPlan(this.plansData).subscribe(
        res => {
          //console.log(res);
          this.letOutPlanData = res;
          if (this.letOutPlanData.data.plan_type == 'Let Out') {
            this.router.navigate(['/payment-summary'], { queryParams: { 'orderID': this.letOutPlanData.data.order_id } });
          }
          else if (this.letOutPlanData.data.plan_type == 'Rent') {
            this.plansPageService.crm_call_appionment(this.user_id).subscribe();
            
            this.router.navigate(['/fix-appointment']);
            // this.router.navigate(['plans']);
            // this.openConfirmationModal();
          }
        },
        err => {
          console.log(err);
        }
      );
      this.jwtService.removeReturnURL();
    }
    else if (this.previousUrl.includes('profile')) {
      this.jwtService.removeReturnURL();
      this.router.navigate(['profile']);
    }
    else if (this.previousUrl.includes('my-properties')) {
      this.plansData = JSON.parse(this.jwtService.getPlansData());
      //console.log(this.plansData);
      this.plansData.user_id = this.user_id;
      this.plansData.user_email = this.userEmail;

      if(this.plansData.price_duration_discount) {
        this.plan_price = this.plansData.expected_rent / (30 / this.plansData.price_duration_discount);
      }
      else {
        this.plan_price = this.plansData.expected_rent / (30 / this.plansData.price_duration_actual);
      }

      this.plansData.plan_price = this.plan_price;
      
      this.plansPageService.postSelectedPlan(this.plansData).subscribe(
        res => {
          //console.log(res);
          this.letOutPlanData = res;
          if (this.letOutPlanData.data.plan_type == 'Let Out') {
            this.router.navigate(['/payment-summary'], { queryParams: { 'orderID': this.letOutPlanData.data.order_id } });
          }
          else if (this.letOutPlanData.data.plan_type == 'Rent') {
            this.plansPageService.crm_call_appionment(this.user_id).subscribe();
            // this.router.navigate(['plans']);
            // this.openConfirmationModal();
            this.router.navigate(['/fix-appointment']);
          }
        },
        err => {
          console.log(err);
        }
      );
      this.jwtService.removeReturnURL();
    }
    else if (this.modified_url?.includes('/product-details')) {
       this.fixed_appointment();
    }
    else {
      this.router.navigateByUrl(this.previousUrl || '');
      this.jwtService.removeReturnURL();
    }
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
  
  fixed_appointment(){
    this.showLoadingIndicator = true;
    this.plansData = JSON.parse(this.jwtService.getPlansData());
          this.loginPageService.store_fixed_appointment(this.plansData).subscribe(
            res => {
              this.showLoadingIndicator=true;
                this.plansPageService.crm_call_appionment(this.user_id).subscribe();
                this.router.navigate(['/fix-appointment']);
                // this.openConfirmationModal();
            },
            err => {
              console.log(err);
            }
          );  
  }

}
