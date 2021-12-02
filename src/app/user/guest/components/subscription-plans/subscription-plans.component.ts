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

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.css']
})
export class SubscriptionPlansComponent implements OnInit {

  public showLoadingIndicator: boolean = false;
  public returnUrl: string = '';

  value: number = 10000;
  options: Options = {
    floor: 5000,
    ceil: 50000,
    step: 100,
    animate: true,
    showSelectionBar: true,
    translate: (value: number, label): string => {
      return this.commaSeperated(value);
    }
  };

  expected_rent_value: number = 5000;
  exp_rent_options: Options = {
    floor: 5000,
    ceil: 50000,
    step: 500,
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

  constructor(
    private plansPageService: PlansPageService,
    private jwtService: JwtService,
    private loginPageService: LoginPageService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getRentPlans();
    this.getRentFeatures();
    this.getLetOutPlans();
    this.getLetOutFeatures();
  }

  getRentPlans() {
    this.showLoadingIndicator = true;
    this.plansPageService.getRentPlans({ param: null }).subscribe(
      response => {
        this.rent_response = response;
        this.showLoadingIndicator = false;
        //console.log(response);
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  }

  getRentFeatures() {
    this.showLoadingIndicator = true;
    this.plansPageService.getRentFeatures({ param: null }).subscribe(
      response => {
        this.rent_feat_res = response;
        this.showLoadingIndicator = false;
        //console.log(response);
        for (let feat_res in this.rent_feat_res) {
          //console.log(this.rent_feat_res[feat_res].feature_details);
          this.myArray = this.rent_feat_res[feat_res].feature_details.split(',');
          //console.log(this.myArray);
          this.rent_feat_res[feat_res].feature_details = this.myArray;
        }
        //console.log(this.rent_feat_res);
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  }

  getLetOutPlans() {
    this.showLoadingIndicator = true;
    this.plansPageService.getLetOutPlans({ param: null }).subscribe(
      response => {
        this.showLoadingIndicator = false;
        this.letout_response = response;
        //console.log(response);
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  }

  getLetOutFeatures() {
    this.showLoadingIndicator = true;
    this.plansPageService.getLetOutFeatures({ param: null }).subscribe(
      res => {
        this.letout_feat_res = res;
        this.showLoadingIndicator = false;
        for (let feat_res_lo in this.letout_feat_res) {
          //console.log(this.letout_feat_res[feat_res_lo].feature_details);
          this.myArray_lo = this.letout_feat_res[feat_res_lo].feature_details.split(',');
          //console.log(this.myArray_lo);
          this.letout_feat_res[feat_res_lo].feature_details = this.myArray_lo;
        }
        //console.log(this.letout_feat_res);
      },
      err => {
        this.showLoadingIndicator = false;
        console.log(err);
      }
    );
  }

  commaSeperated(e: any) {
    var t = (e = e ? e.toString() : "").substring(e.length - 3)
      , n = e.substring(0, e.length - 3);
    return "" !== n && (t = "," + t),
      n.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + t
  }

  plan_payment(plan_name: any, plan_id: any, payment_type: any, plan_type: any, expected_rent: any, price_duration: any) {
    this.showLoadingIndicator = true;
    console.log(plan_name, plan_id, payment_type, plan_type, expected_rent, price_duration);
    let val = this.jwtService.getToken();
    if (val) {
      console.log("Logged In");
      console.log(val);
      this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
        data => {
          this.showLoadingIndicator = false;
          this.user_phone_data = data;
          console.log(this.user_phone_data);
          if (this.user_phone_data !== 1) {
            console.log("Mobile number not verified");
            this.returnUrl = this.router.url;
            this.jwtService.saveReturnURL(this.returnUrl);
            this.openMobModal(plan_name, plan_id, payment_type, plan_type, expected_rent, price_duration);
          }
          else {
            console.log("Mobile number verified");
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

            this.plan_price = expected_rent / (30 / price_duration);
            formData.append('plan_price', this.plan_price);

            this.plansPageService.postSelectedPlan(formData).subscribe(
              res => {
                console.log(res);
                this.selected_plan_data = res;
                if (plan_type == 'let_out') {
                  this.router.navigate(['/payment-summary'], { queryParams: { 'orderID': this.selected_plan_data.data.order_id } });
                }
                else if (plan_type == 'rent') {
                  this.plansPageService.crm_call(this.user_id).subscribe();
                  this.openConfirmationModal();
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
      console.log("Not logged in");
      console.log(this.router.url);
      this.showLoadingIndicator = false;
      this.openLoginModal(plan_name, plan_id, payment_type, plan_type, expected_rent, price_duration);
    }
  }

  openLoginModal(plan_name: any, plan_id: any, payment_type: any, plan_type: any, expected_rent: any, price_duration: any) {
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
      price_duration: price_duration
    }

    modalRef.componentInstance.fromParent = data;
  }

  openMobModal(plan_name: any, plan_id: any, payment_type: any, plan_type: any, expected_rent: any, price_duration: any) {
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
      price_duration: price_duration
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
}
