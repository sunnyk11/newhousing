import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { PlansPageService } from '../../services/plans-page.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { LoginPageService } from '../../services/login-page.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginCheckComponent } from '../../modals/login-check/login-check.component';
import { MobileCheckComponent } from '../../modals/mobile-check/mobile-check.component';
import { FixAppointmentComponent } from '../../modals/fix-appointment/fix-appointment.component';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Title } from '@angular/platform-browser';
import { GtmserviceService } from '../../services/gtmservice.service';
import { UserLogsService } from '../../services/user-logs.service';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.css']
})
export class SubscriptionPlansComponent implements OnInit {

  public showLoadingIndicator: boolean = false;
  public showLoadingIndicator1: boolean = false;
  public returnUrl: string = '';
  public  plan_name:any;
  public slider_amount:any;

  value: number = 10000;
  options: Options = {
    floor: 5000,
    ceil: 300000,
    step: 5000,
    animate: true,
    showSelectionBar: true,
    translate: (value: number, label): string => {
      return this.commaSeperated(value);
    }
  };

  expected_rent_value: number = 5000;
  exp_rent_options: Options = {
    floor: 5000,
    ceil: 300000,
    step: 5000,
    animate: true,
    showSelectionBar: true,
    translate: (value: number, label): string => {
      return this.commaSeperated(value);
    }
  };

  public rent_response: any;
  public rent_feat_res: any;
  public myArray: any = [];
  public letout_response: any;
  public letout_feat_res: any;
  public myArray_lo: any = [];
  private user_phone_data: any;
  private user_id: any;
  private userEmail: any;
  private plan_price: number = 0;
  public selected_plan_data: any;
  public  plan_name_model:any;
  public  plan_id_model:any;
  public  payment_type_model:any;
  public  expected_rent_model:any;
  public  plan_type_model:any;
  public  price_duration_discount_model:any;
  public  price_duration_actual_model:any;
  public  plan_features_model:any;
  public clicked = false;

  public displayAlert: boolean = false;

  constructor(
    private titleService: Title,
    private plansPageService: PlansPageService,
    private jwtService: JwtService,
    private loginPageService: LoginPageService,
    private router: Router,
    private UserLogsService:UserLogsService,
    private gtmService: GtmserviceService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void { this.titleService.setTitle('Plans');
    this.getRentFeatures();
    this.getLetOutFeatures();
    this.sendDataToGTM1();
  }

  getRentFeatures() {
    this.showLoadingIndicator = true;
    this.showLoadingIndicator1 = true;
    this.plansPageService.getRentFeatures({ param: null }).subscribe(
      response => {
        this.rent_feat_res = response;
        //console.log(response);
        this.showLoadingIndicator = false;
        this.showLoadingIndicator1 = false;
      },
      err => {
        // console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }
  sendDataToGTM1()  {
    this.plan_name='Rentout';
    this.slider_amount=this.value;
    const encodedUrl = this.router.url.toString().replace(/ /g, '%20');
    const finalUrl = encodedUrl.toString().replace(/&/g, '%26'); 
   
    const data = {
      event: 'dataLayer',
      data: {
        property_url: finalUrl,
        plan_name: this.plan_name,
        slider_amount:this.slider_amount,
        page_name:'plans Page',
      },
      action: 'Onload Action',
      label: 'PLAN page',
      page_name:'Plan Page',
      page_url:finalUrl,
      site_type:this.UserLogsService.getDeviceInfo(),
      // Additional data properties as needed
    };

     this.gtmService.initializeDataLayer();
    console.log(data);
  }
  sendDataToGTM()  {
      this.plan_name='Letout';
      this.slider_amount=this.expected_rent_value;
      
      
    const encodedUrl = this.router.url.toString().replace(/ /g, '%20');
    const finalUrl = encodedUrl.toString().replace(/&/g, '%26'); 
   
    const data = {
      event: 'dataLayer',
      data: {
        property_url: finalUrl,
        plan_name: this.plan_name,
        slider_amount:this.slider_amount,
        page_name:'plans Page',
      },
      action: 'Onload Action',
      label: 'PLAN page',
      page_name:'Plan Page',
      page_url:finalUrl,
      site_type:this.UserLogsService.getDeviceInfo(),
      // Additional data properties as needed
    };

    this.gtmService.initializeDataLayer();
    console.log(data);
  }

  getLetOutFeatures() {
    this.showLoadingIndicator = true;
    this.plansPageService.getLetOutFeatures({ param: null }).subscribe(
      res => {
        this.letout_feat_res = res;
        //console.log(this.letout_feat_res);
        this.showLoadingIndicator = false;
        this.showLoadingIndicator1 = false;
      },
      err => {
        this.showLoadingIndicator = false;
        // console.log(err);
      }
    );
  }

  commaSeperated(e: any) {
    var t = (e = e ? e.toString() : "").substring(e.length - 3)
      , n = e.substring(0, e.length - 3);
    return "" !== n && (t = "," + t),
      n.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + t
  }
  plan_payment_model(plan_name: any, plan_id: any, payment_type: any, plan_type: any, expected_rent: any, price_duration_actual: any, price_duration_discount:any, plan_features: any) {
    this.plan_name_model=plan_name;
    this.plan_id_model=plan_id;
    this.payment_type_model=payment_type;
    this.expected_rent_model=expected_rent;
    this. plan_type_model=plan_type;
    this.price_duration_actual_model=price_duration_actual;
    this.price_duration_discount_model=price_duration_discount;
    this.plan_features_model=plan_features;
  }
  plan_payment(plan_name: any, plan_id: any, payment_type: any, plan_type: any, expected_rent: any, price_duration_actual: any, price_duration_discount:any, plan_features: any) {
    this.showLoadingIndicator = true;
    console.log(plan_name, plan_id, payment_type, plan_type, expected_rent, price_duration_actual, price_duration_discount);
    let val = this.jwtService.getToken();
    if (val) {
      //console.log(val);
      this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
        data => {
          this.showLoadingIndicator = false;
          this.user_phone_data = data;
          // console.log(this.user_phone_data);
          if (this.user_phone_data !== 1) {
            //console.log("Mobile number not verified");
            this.returnUrl = this.router.url;
            this.jwtService.saveReturnURL(this.returnUrl);
            this.openMobModal(plan_name, plan_id, payment_type, plan_type, expected_rent, price_duration_actual, price_duration_discount, plan_features);
          }
          else {
            this.returnUrl = this.router.url;
            //console.log("Mobile number verified");
            this.user_id = this.jwtService.getUserId();
            this.userEmail = this.jwtService.getUserEmail();
            var formData: any = new FormData();
            formData.append('user_id', this.user_id);
            formData.append('user_email', this.userEmail);
            formData.append('plan_type', plan_type);
            formData.append('plan_name', plan_name);
            formData.append('expected_rent', expected_rent);
            formData.append('plan_id', plan_id);
            formData.append('payment_type', payment_type);

            if(price_duration_discount) {
              this.plan_price = expected_rent / (30 / price_duration_discount);
            }
            else {
              this.plan_price = expected_rent / (30 / price_duration_actual);
            }
            
            formData.append('plan_price', this.plan_price);
            formData.append('plan_features_data', JSON.stringify(plan_features));
            // console.log(typeof(plan_features));
            // console.log(plan_features);
            console.log(formData);

            this.plansPageService.postSelectedPlan(formData).subscribe(
              res => {
                this.returnUrl = this.router.url;
                this.jwtService.saveReturnURL(this.returnUrl);
                this.selected_plan_data = res;
                if (plan_type == 'Let Out') {
                  this.router.navigate(['/payment-summary'], { queryParams: { 'orderID': this.selected_plan_data.data.order_id } });
                }
                else if (plan_type == 'Rent') {
                  this.plansPageService.crm_call_appionment(this.user_id).subscribe();
                  // this.openConfirmationModal();
                this.router.navigate(['/fix-appointment']);
                }
              },
              err => {

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
      //console.log("Not logged in");
      //console.log(this.router.url);
      this.showLoadingIndicator = false;
       this.returnUrl = this.router.url;
      this.openLoginModal(plan_name, plan_id, payment_type, plan_type, expected_rent, price_duration_actual, price_duration_discount, plan_features);
    }
  }

  
  fixed_appointment(plan_name: any, plan_id: any, payment_type: any, plan_type: any, expected_rent: any, price_duration_actual: any, price_duration_discount:any, plan_features: any) {
    this.showLoadingIndicator = true;
    console.log(plan_name, plan_id, payment_type, plan_type, expected_rent, price_duration_actual, price_duration_discount);
    let val = this.jwtService.getToken();
    if (val) {
      //console.log(val);
      this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
        data => {
          this.showLoadingIndicator = false;
          this.user_phone_data = data;
          // console.log(this.user_phone_data);
          if (this.user_phone_data !== 1) {
            //console.log("Mobile number not verified");
            this.returnUrl = this.router.url;
            this.jwtService.saveReturnURL(this.returnUrl);
            this.openMobModal(plan_name, plan_id, payment_type, plan_type, expected_rent, price_duration_actual, price_duration_discount, plan_features);
          }
          else {
            this.returnUrl = this.router.url;
            //console.log("Mobile number verified");
            this.user_id = this.jwtService.getUserId();
            this.userEmail = this.jwtService.getUserEmail();
            var formData: any = new FormData();
            formData.append('user_id', this.user_id);
            formData.append('user_email', this.userEmail);
            formData.append('plan_type', plan_type);
            formData.append('plan_name', plan_name);
            formData.append('expected_rent', expected_rent);
            formData.append('plan_id', plan_id);
            formData.append('payment_type', payment_type);
            formData.append('page_name',  this.returnUrl);

            if(price_duration_discount) {
              this.plan_price = expected_rent / (30 / price_duration_discount);
            }
            else {
              this.plan_price = expected_rent / (30 / price_duration_actual);
            }
            
            formData.append('plan_price', this.plan_price);
            formData.append('plan_features_data', JSON.stringify(plan_features));
            // console.log(typeof(plan_features));
            // console.log(plan_features);
            console.log(formData);

            this.plansPageService.postSelectedPlan(formData).subscribe(
              res => {
                console.log(res);
                    
                this.returnUrl = this.router.url;
                this.jwtService.saveReturnURL(this.returnUrl);
                this.selected_plan_data = res;
                   this.plansPageService.crm_call_appionment(this.user_id).subscribe();
                  // this.openConfirmationModal();
                    this.router.navigate(['/fix-appointment']);
                },
              err => {

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
      //console.log("Not logged in");
      //console.log(this.router.url);
      this.showLoadingIndicator = false;
       this.returnUrl = this.router.url;
      this.openLoginModal_appointment(plan_name, plan_id, payment_type, plan_type, expected_rent, price_duration_actual, price_duration_discount, plan_features,this.returnUrl);
    }
  }

  openLoginModal(plan_name: any, plan_id: any, payment_type: any, plan_type: any, expected_rent: any, price_duration_actual: any, price_duration_discount: any, plan_features: any) {
    const modalRef = this.modalService.open(LoginCheckComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: false,
        backdrop: 'static'
      });

    let data = {
      plan_name: plan_name,
      plan_id: plan_id,
      payment_type: payment_type,
      plan_type: plan_type,
      expected_rent: expected_rent,
      price_duration_actual: price_duration_actual,
      price_duration_discount: price_duration_discount,
      plan_features_data: JSON.stringify(plan_features)
    }

    modalRef.componentInstance.fromParent = data;
  }
  
  openLoginModal_appointment(plan_name: any, plan_id: any, payment_type: any, plan_type: any, expected_rent: any, price_duration_actual: any, price_duration_discount: any, plan_features: any,url:any) {
    const modalRef = this.modalService.open(LoginCheckComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: false,
        backdrop: 'static'
      });

    let data = {
      plan_name: plan_name,
      plan_id: plan_id,
      payment_type: payment_type,
      plan_type: plan_type,
      expected_rent: expected_rent,
      price_duration_actual: price_duration_actual,
      price_duration_discount: price_duration_discount,
      page_name:url,
      plan_features_data: JSON.stringify(plan_features)
    }

    modalRef.componentInstance.fromParent = data;
  }

  openMobModal(plan_name: any, plan_id: any, payment_type: any, plan_type: any, expected_rent: any, price_duration_actual: any, price_duration_discount: any, plan_features:any) {
    const modalRef = this.modalService.open(MobileCheckComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: false,
        backdrop: 'static'
      });

    let data = {
      plan_name: plan_name,
      plan_id: plan_id,
      payment_type: payment_type,
      plan_type: plan_type,
      expected_rent: expected_rent,
      price_duration_actual: price_duration_actual,
      price_duration_discount: price_duration_discount,
      plan_features_data: JSON.stringify(plan_features)
    }

    modalRef.componentInstance.fromParent = data;
  }

  openConfirmationModal() {
    const modalRef = this.modalService.open(FixAppointmentComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: false,
        backdrop: 'static'
      });
  }

  toggleAlert() {
    this.displayAlert = !this.displayAlert;
  }
}
