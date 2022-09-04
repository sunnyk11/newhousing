import { Component, OnInit } from '@angular/core';
import { PlansPageService } from '../../services/plans-page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductPageService } from '../../services/product-page.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginCheckComponent } from '../../modals/login-check/login-check.component';
import { MobileCheckComponent } from '../../modals/mobile-check/mobile-check.component';
import { LoginPageService } from '../../services/login-page.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-remaining-checkout',
  templateUrl: './remaining-checkout.component.html',
  styleUrls: ['./remaining-checkout.component.css']
})
export class RemainingCheckoutComponent implements OnInit {

  public showLoadingIndicator: boolean = false;
  public rent_response: any;
  public rent_feat_res: any;
  public myArray: any = [];
  public invoice_id: any;
  public product_data: any;
  public pro_data: any;
  public expected_rent: any;
  public sgst_amount: any;
  public cgst_amount: any;
  public total_amount_hs: any;
  public plan_price: any;
  public security_deposit: any;
  public security_dep_amount: number=0;
  public maintenance_charge: number=0;
  public total_amount_owner: number = 0;
  public plan_name: any;
  public plan_type: any;
  public plan_id: any;
  public payment_type: any;
  public property_name: any;
  public property_id: any;
  public total_amount: any;
  public purchase_property: boolean = true;
  public book_property: boolean = false;
  public online_pay_btn: boolean = true;
  public cash_pay_btn: boolean = false;
  public choose_payment_type: any = 'purchase_property';
  public payment_percentage: number=100;
  public section_c: number=0;
  public payable_amount: number=0;
  public remaining_amount: number=0;
  public main_total_amount:any;
  public mode_payment: any = 'Online';
  public rent_aggrement_price:number=0;
  public plan_aggrement_price:any;
  public area:any;
  public area_unit:any;
  public maintenance_condition:any;
  private user_phone_data: any;
  public returnUrl: string = '';
  public maintenance_charge_status:number=0;
  public order_id:any;

  public userEmail: any;
  public user_id: any;
  public string_formdata: any;
  public selected_plan_data: any;
  public payment_result: any;
  public paytm_data: any;
  public rent_plan_data: any;
  public invoice_data: any;
  public plan_features_data: any;
  private paytm_form_url: string = environment.Paytm_formURL;
  constructor(
    private plansPageService: PlansPageService,
    private route: ActivatedRoute,
    private jwtService: JwtService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private loginPageService: LoginPageService,
    private router: Router
    ) { 
      this.route.queryParams.subscribe((params) => {
        if(params.invoice_no.length >0){
          this.invoice_id=params.invoice_no;
        } else {
          this.router.navigate(['/my-properties']);
        }
      });}

  ngOnInit(): void {
    this.showLoadingIndicator = true;   
    this.get_invoice_details(this.invoice_id);
  }

get_invoice_details(invoice_id:any){
  let val = this.jwtService.getToken();
  if(val){
    this.plansPageService.getInvoiceDetails(invoice_id).subscribe(
      res => {
        let data:any=res;
        console.log(data);
        if(data.data !=null){
          if(data?.data?.book_property?.payment_status=='PAID'){
            if(data?.data?.purchased_property?.payment_status=='UNPAID'){
              this.plan_name=data?.data?.plan_name;
              this.plan_type=data?.data?.plan_type;
              this.plan_price=data?.data?.plan_price;
              this.property_name=data?.data?.order_details?.property_name;
              this.expected_rent=data?.data?.expected_rent;
              this.area=data?.data?.order_details?.product_details?.area;
              this.security_deposit=data?.data?.order_details?.product_details?.security_deposit;
              this.security_dep_amount=this.expected_rent*this.security_deposit;
              this.maintenance_charge_status=data?.data?.order_details?.product_details?.maintenance_charge_status;
              this.area_unit=data.data?.order_details?.product_details?.property_area_unit?.unit;
              if(data.data?.agreement_price){
                this.rent_aggrement_price=data.data?.agreement_price;
              }
              this.plan_aggrement_price=this.rent_aggrement_price+this.plan_price;
              this.sgst_amount=this.plan_aggrement_price*9/100;
              this.cgst_amount=this.plan_aggrement_price*9/100;
              this.total_amount_hs=this.plan_aggrement_price+this.cgst_amount+this.sgst_amount;
              if(this.maintenance_charge_status==1){
                this.maintenance_condition=data?.data?.order_details?.product_details?.maintenance_condition?.name;
                this.maintenance_charge=data?.data?.order_details?.product_details?.maintenance_charge;  
                this.total_amount_owner=this.expected_rent + Number(this.maintenance_charge) + this.security_dep_amount;
              }else{        
              this.total_amount_owner=this.expected_rent + Number(this.security_dep_amount);
              }
              this.payment_percentage=data.data?.payment_percentage;
              this.section_c=Math.round((this.total_amount_owner)*this.payment_percentage/100);
              this.payable_amount=this.total_amount_hs+this.section_c;
              this.remaining_amount=data.data?.total_amount-this.payable_amount;
              this.showLoadingIndicator = false;   
              this.order_id=data.data.order_id;
            }else{ 
              this.router.navigate(['/my-properties']);
             }
          }else{ 
            this.router.navigate(['/my-properties']);
           } 
        }else{ 
         this.router.navigate(['/my-properties']);
        } 
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  }else{
    this.router.navigate(['/login']);
  }
}

  changePayment(e:any) {
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
  proceedToPayment() {
    this.showLoadingIndicator = true;
    let val = this.jwtService.getToken();
    if (val) {
      this.user_id = this.jwtService.getUserId();
      this.userEmail = this.jwtService.getUserEmail();
      this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
        data => {
          this.showLoadingIndicator = false;
          //console.log(data);
          this.user_phone_data = data;
          if(this.user_phone_data !== 1) {
            //console.log("Mobile number not verified");
            this.returnUrl = this.router.url;
            this.jwtService.saveReturnURL(this.returnUrl);
          }
          else {
            //console.log("Mobile number verified");
                this.plansPageService.remaing_plans_rent_payment(this.order_id).subscribe(
                  result => {
                    this.payment_result = result;
                    console.log(this.payment_result);
                    if ( this.payment_result.status == 201) {
                      this.paytm_data =  this.payment_result.data;
                      this.createPaytmForm(); 
                    }
                  },
                  error => {
                    console.log(error);
                  }
                );
          }
        },
        err => {
          this.showLoadingIndicator = false;
        }
      );
    } 
    else {
      this.showLoadingIndicator = false;
      this.router.navigate(['/login']);
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
    console.log(my_form);
    document.body.appendChild(my_form);
    my_form.submit();
    // after click will fire you will redirect to paytm payment page.
    // after complete or fail transaction you will redirect to your CALLBACK URL
  }
  
  offline_payment() {
    this.toastr.info('Contact To Branch', 'Super Admin', {
    timeOut: 3000,
  });
  }

  
}
