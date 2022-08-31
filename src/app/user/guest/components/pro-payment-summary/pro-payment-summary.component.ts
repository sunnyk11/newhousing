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
  selector: 'app-pro-payment-summary',
  templateUrl: './pro-payment-summary.component.html',
  styleUrls: ['./pro-payment-summary.component.css']
})
export class ProPaymentSummaryComponent implements OnInit {

  public showLoadingIndicator: boolean = false;

  public rent_response: any;
  public rent_feat_res: any;
  public myArray: any = [];
  public product_id: any;
  public product_data: any;
  public pro_data: any;
  public expected_rent: any;
  public sgst_amount: any;
  public cgst_amount: any;
  public total_amount_hs: any;
  public plan_price: any;
  public security_deposit: any;
  public security_dep_amount: any;
  public maintenance_charge: any;
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
  public main_total_amount:any;
  public mode_payment: any = 'Online';
  public rent_aggrement_price:number=0;
  public plan_aggrement_price:any;

  private user_phone_data: any;
  public returnUrl: string = '';

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
    private productService: ProductPageService,
    private jwtService: JwtService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private loginPageService: LoginPageService,
    private router: Router
    ) { 
      this.route.queryParams.subscribe((params) => {
        if(params.productID.length >0){
          this.product_id=params.productID;
          this.product_details(this.product_id);
        } else {
          this.router.navigate(['/product-listing'])
        }
      });}

  ngOnInit(): void {
    this.showLoadingIndicator = true;   
    this.getRentFeatures();
  }

  product_details(product_id:any){
    this.productService.get_product_details(product_id).subscribe(
      prod_data => {
        this.showLoadingIndicator = false;
        this.product_data = prod_data;
        if(this.product_data.length>0){
          // if(this.product_data )
        this.pro_data = this.product_data[0];
        let user_id:any= this.jwtService.getUserId();
        if(user_id ==this.product_data[0].user_id){
          this.toastr.info('Property Owner', 'user', {
            timeOut: 1200,
          });
          this.router.navigate(['/product-details'],{queryParams:{'id':product_id,'name':this.product_data[0].build_name}})

        }else{
          
        this.expected_rent = this.product_data[0].expected_rent;
        this.sgst_amount = Math.round((9 * this.plan_price) / 100); 
        this.cgst_amount = Math.round((9 * this.plan_price) / 100);
        this.total_amount_hs = this.plan_price + this.sgst_amount + this.cgst_amount;
        this.security_deposit = this.product_data[0].security_deposit;
        this.security_dep_amount = this.expected_rent * this.security_deposit;

        this.maintenance_charge = this.product_data[0].maintenance_charge;
        //console.log(this.maintenance_charge);
        if (this.maintenance_charge) {
          this.total_amount_owner = Number(this.expected_rent) + Number(this.security_dep_amount) + Number(this.maintenance_charge);
        }
        else {
          this.total_amount_owner = Number(this.expected_rent) + Number(this.security_dep_amount);
          //console.log(this.maintenance_charge);
          this.maintenance_charge = 0;
          //console.log(this.maintenance_charge);
        }

        }

        }else {
          this.router.navigate(['/product-listing'])
        }
        
      },
      err => {
        this.showLoadingIndicator = false;
        console.log(err);
      }
    );
  }
  
  getRentFeatures() {
    this.showLoadingIndicator = true;
    this.plansPageService.getRentFeatures({ param: null }).subscribe(
      response => {
        this.showLoadingIndicator = false;
        this.rent_feat_res = response;
        console.log(this.rent_feat_res);
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  }

  plan_payment(plan_name:any, plan_id:any, payment_type:any, plan_type:any, expected_rent:any, price_duration_actual: any, price_duration_discount:any, plan_features: any) {
    // console.log(plan_name, plan_id, payment_type, plan_type, expected_rent, price_duration_discount,plan_features);
    // console.log(plan_features?.features.length);
    this.rent_aggrement_price=0;
    for(let i=0; i< plan_features?.features.length; i++){
      if(plan_features?.features[i].feature_name=='Rent Agreement'){
        if(plan_features?.features[i].feature_value>=0){
          this.rent_aggrement_price=plan_features?.features[i].feature_value;            
         }
      }

    }
    this.plan_name = plan_name;
    if(price_duration_discount>=0) {
      this.plan_price = Math.round(expected_rent / (30 / price_duration_discount));
    }
    else {
      this.plan_price = Math.round(expected_rent / (30 / price_duration_actual));
    }
    this.plan_features_data = plan_features;
    this.plan_type = plan_type;
    this.plan_id = plan_id;
    this.payment_type = payment_type;
    this.expected_rent = expected_rent;
    this.property_name = this.product_data[0].build_name;
    this.property_id = this.product_data[0].id;
    this.plan_aggrement_price= this.plan_price + this.rent_aggrement_price;
    this.sgst_amount = Math.round((9 * this.plan_aggrement_price) / 100);
    this.cgst_amount = Math.round((9 * this.plan_aggrement_price) / 100);
    this.maintenance_charge = this.product_data[0].maintenance_charge;
    this.security_deposit = this.product_data[0].security_deposit;
    this.security_dep_amount = this.expected_rent * this.security_deposit;
    this.total_amount_hs = this.plan_aggrement_price + this.sgst_amount + this.cgst_amount;
    this.maintenance_charge = this.product_data[0].maintenance_charge;
    //console.log(this.maintenance_charge);
    if (this.maintenance_charge) {
      this.total_amount_owner = Number(this.expected_rent) + Number(this.security_dep_amount) + Number(this.maintenance_charge);
    }
    else {
      this.total_amount_owner = Number(this.expected_rent) + Number(this.security_dep_amount);
    }
    this.total_amount = this.total_amount_hs + this.total_amount_owner;
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
  
  changepayment_type(e:any) {
    if(e.target.value == 'purchase_property') {
      this.purchase_property = true;
      this.book_property = false;
      this.choose_payment_type = 'purchase_property';
      this.payment_percentage=100;
      this.total_amount= this.total_amount_hs + this.total_amount_owner;
      this.main_total_amount= Math.round(this.total_amount_hs + this.total_amount_owner);
    }
    else if (e.target.value == 'book_property') {
      this.purchase_property = false;
      this.book_property = true;
      this.choose_payment_type = 'book_property';
      this.payment_percentage=40;
      this.total_amount= Math.round((this.total_amount_owner)*this.payment_percentage/100);
    }
  }
  changepercentage(e:any) {
    this.payment_percentage=e.target.value;
    this.total_amount= Math.round((this.total_amount_owner)*this.payment_percentage/100);
  
    console.log(this.total_amount);
  }

  proceedToPayment() {

    this.showLoadingIndicator = true;

    const formData: any = new FormData();
    formData.append('plan_name', this.plan_name);
    formData.append('plan_price', this.plan_price);
    formData.append('plan_aggrement_price', this.rent_aggrement_price);
    formData.append('plan_type', this.plan_type);
    formData.append('plan_id', this.plan_id);
    formData.append('payment_type', this.payment_type);
    formData.append('expected_rent', this.expected_rent);
    formData.append('property_name', this.product_data[0].build_name);
    formData.append('property_id', this.product_data[0].id);
    formData.append('gst_amount', this.sgst_amount + this.cgst_amount);
    formData.append('maintenance_charge', this.maintenance_charge);
    formData.append('security_deposit', this.security_dep_amount);
    formData.append('total_amount',  Math.round(this.total_amount));
    formData.append('main_total_amount',  Math.round(this.total_amount_hs + this.total_amount_owner));
    formData.append('property_uid', this.product_data[0].product_uid);
    formData.append('payment_mode', this.mode_payment);
    formData.append('choose_payment_type', this.choose_payment_type);
    formData.append('payment_percentage', this.payment_percentage);
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
            this.openMobModal();
          }
          else {
            //console.log("Mobile number verified");
            formData.append('user_id', this.user_id);
            formData.append('user_email', this.userEmail);
            formData.append('plan_features_data', JSON.stringify(this.plan_features_data));
            
            this.plansPageService.postSelectedRentPlan(formData).subscribe(
              res => {
                this.selected_plan_data = res;
                this.plansPageService.proceedToPaymentRent(this.selected_plan_data.data.order_id).subscribe(
                  result => {
                    this.payment_result = result;
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
      //console.log("Not logged in: " + val);
      this.openModal();
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

  openModal() {
    const modalRef = this.modalService.open(LoginCheckComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: false,
         backdrop: 'static'
      });

    let data = {
      plan_name: this.plan_name,
      plan_price: this.plan_price,
      plan_aggrement_price: this.plan_price + this.rent_aggrement_price,
      plan_type: this.plan_type,
      plan_id: this.plan_id,
      payment_type: this.payment_type,
      expected_rent: this.expected_rent,
      property_name: this.product_data[0].build_name,
      property_id: this.product_data[0].id,
      gst_amount: this.sgst_amount + this.cgst_amount,
      maintenance_charge: this.maintenance_charge,
      security_deposit: this.security_dep_amount,
      total_amount: Math.round(this.total_amount),
      main_total_amount:Math.round(this.total_amount_hs + this.total_amount_owner),
      property_uid: this.product_data[0].product_uid,
      payment_mode: this.mode_payment,
      choose_payment_type: this.choose_payment_type,
      payment_percentage: this.payment_percentage,
      plan_features_data: JSON.stringify(this.plan_features_data)
    }

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      //console.log(result);
    }, (reason) => {
    });
  }

  
  openMobModal() {
    const modalRef = this.modalService.open(MobileCheckComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: false,
         backdrop: 'static'
      });

    let data = {
      plan_name: this.plan_name,
      plan_price: this.plan_price,
      plan_aggrement_price: this.plan_price + this.rent_aggrement_price,
      plan_type: this.plan_type,
      plan_id: this.plan_id,
      payment_type: this.payment_type,
      expected_rent: this.expected_rent,
      property_name: this.product_data[0].build_name,
      property_id: this.product_data[0].id,
      gst_amount: this.sgst_amount + this.cgst_amount,
      maintenance_charge: this.maintenance_charge,
      security_deposit: this.security_dep_amount,
      total_amount: this.total_amount_hs + this.total_amount_owner,
      property_uid: this.product_data[0].product_uid,
      payment_mode: this.mode_payment,
      main_total_amount:  Math.round(this.total_amount_hs + this.total_amount_owner),
      choose_payment_type:this.choose_payment_type,
      payment_percentage:this.payment_percentage,
      plan_features_data: JSON.stringify(this.plan_features_data)
    }

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      //console.log(result);
    }, (reason) => {
    });
  }
  
  generateInvoice() {
    this.showLoadingIndicator = true;
    //console.log("Generate Invoice");
    var formData: any = new FormData();
    formData.append('plan_name', this.plan_name);
    formData.append('plan_price', this.plan_price);
    formData.append('plan_aggrement_price', this.rent_aggrement_price);
    formData.append('plan_type', this.plan_type);
    formData.append('plan_id', this.plan_id);
    formData.append('payment_type', this.payment_type);
    formData.append('expected_rent', this.expected_rent);
    formData.append('property_name', this.product_data[0].build_name);
    formData.append('property_id', this.product_data[0].id);
    formData.append('gst_amount', this.sgst_amount + this.cgst_amount);
    formData.append('maintenance_charge', this.maintenance_charge);
    formData.append('security_deposit', this.security_dep_amount);
    formData.append('total_amount', Math.round(this.total_amount));
    formData.append('main_total_amount',  Math.round(this.total_amount_hs + this.total_amount_owner));
    formData.append('property_uid', this.product_data[0].product_uid);
    formData.append('payment_mode', this.mode_payment);
    formData.append('choose_payment_type', this.choose_payment_type);
    formData.append('payment_percentage', this.payment_percentage);
    console.log(formData);
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
            this.openMobModal();
          }
          else {
            //console.log("Mobile number verified");
            formData.append('user_id', this.user_id);
            formData.append('user_email', this.userEmail);
            formData.append('plan_features_data', JSON.stringify(this.plan_features_data));
            //console.log(formData);
            this.plansPageService.postSelectedRentPlan(formData).subscribe(
              res => {
                console.log(res);
                this.rent_plan_data = res;
                this.plansPageService.generateRentInvoice(this.rent_plan_data.data.order_id).subscribe(
                  res => {
                    console.log(res);
                    this.invoice_data = res;
                    if(this.invoice_data.property_type == 'book_property'){
                      this.router.navigate(['/book-property'], { queryParams: { 'invoice_no': this.invoice_data.data } });
                    }else{
                      this.router.navigate(['/invoice'], { queryParams: { 'invoice_no': this.invoice_data.data } });
                    }
                   },
                  err => {
                    console.log(err);
                  }
                );
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
      //console.log("Not logged in: " + val);
      this.openModal();
    }
  }

  
}
