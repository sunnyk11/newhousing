import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { LoginPageService } from '../../services/login-page.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { CommonService } from '../../services/common.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { PlansPageService } from '../../services/plans-page.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FixAppointmentComponent } from '../../modals/fix-appointment/fix-appointment.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public showLoadingIndicator: boolean = false;

  loginForm = this.fb.group({
    email_address: ['', Validators.required],
    password: ['', Validators.required]
  });

  public submitted: boolean = false;
  public errorMessage: string = "";
  public LoginFailed: boolean = false;
  public response_data: any;
  public LoggedIn: boolean = false;
  public token: string = '';
  public plansData: any;
  public returnUrl: any;
  private mobile_ver_status: any;
  public property_data: any;
  public user_id: any;
  public userEmail: any;
  public selectedPlanData: any;
  private payment_result: any;
  private invoice_result: any;
  private paytm_data: any;
  private paytm_form_url: string = environment.Paytm_formURL;
  public letOutPlanData: any;

  constructor(
    private fb: FormBuilder,
    private loginPageService: LoginPageService,
    private jwtService: JwtService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private plansPageService: PlansPageService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(
      params => {
        let google_token = params['token'];
        let data = params['data'];
        if (google_token && data) {
          this.LoggedIn = true;
          this.jwtService.saveGoogleUser(google_token, data);
          this.commonService.sendUpdate(this.LoggedIn, google_token);
        }
      }
    );

    if (this.jwtService.getToken()) {
      this.user_id = this.jwtService.getUserId();
      this.userEmail = this.jwtService.getUserEmail();
      this.returnUrl = this.jwtService.getReturnURL();
      console.log(this.returnUrl);
      if (this.returnUrl?.includes('/product_payment_summary')) {
        //console.log(this.returnUrl);
        this.proceedToPayment();
        this.jwtService.removeReturnURL();
      }
      else if (this.returnUrl?.includes('/plans')) {
        this.getPhoneDetails();
        this.jwtService.removeReturnURL();
      }
      else {
        this.router.navigateByUrl(this.returnUrl || '');
      }
    }
  }

  get LoginFormControl() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.showLoadingIndicator = true;
    this.submitted = true;
    if (this.loginForm.valid) {
      let loginData = {
        email: this.loginForm.value.email_address,
        password: this.loginForm.value.password,
        rememberme: 1
      }
      this.loginPageService.login(loginData).subscribe(
        response => {
          this.showLoadingIndicator = false;
          //console.log(response);
          this.LoginFailed = false;
          this.LoggedIn = true;
          this.response_data = response;
          this.jwtService.saveUser(this.response_data.data);
          this.token = this.jwtService.getToken();
          this.commonService.sendUpdate(this.LoggedIn, this.token);
          this.user_id = this.jwtService.getUserId();
          this.userEmail = this.jwtService.getUserEmail();

          this.returnUrl = this.jwtService.getReturnURL();

          if (this.returnUrl?.includes('/product_payment_summary')) {
            //console.log(this.returnUrl);
            this.proceedToPayment();
          }
          else if (this.returnUrl?.includes('/plans')) {
            this.getPhoneDetails();
          }

          else {
            this.router.navigateByUrl(this.returnUrl || '');
          }
        },
        err => {
          this.showLoadingIndicator = false;
          this.errorMessage = err.error.message;
          this.LoginFailed = true;
          //console.log(err);
        }
      );
    }
    else {
      this.showLoadingIndicator = false;
      //console.log("Invalid");
    }

  }

  redirect_login_google() {
    window.location.href = environment.googleURL;
  }

  proceedToPayment() {
    this.showLoadingIndicator = true;
    this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
      data => {
        this.showLoadingIndicator = false;
        console.log(data);
        this.mobile_ver_status = data;
        if (this.mobile_ver_status !== 1) {
          //console.log("Mobile number not verified");
          this.router.navigate(['verify-mobile']);
        }
        else {
          //console.log("Mobile number verified");
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
                    //console.log(error);
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
                    //console.log(err);
                  }
                );
              }
            },
            err => {

            }
          );
        }
      },
      err => {
        this.showLoadingIndicator = false;
        //console.log(err);
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

  getPhoneDetails() {
    this.showLoadingIndicator = true;
    this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
      data => {
        this.showLoadingIndicator = false;
        this.mobile_ver_status = data;
        if (this.mobile_ver_status !== 1) {
          console.log("Mobile number not verified");
          this.router.navigate(['verify-mobile']);
        }
        else {
          console.log("Mobile number verified");
          this.plansData = JSON.parse(this.jwtService.getPlansData());
          console.log(this.plansData);
          this.plansData['user_id'] = this.user_id;
          this.plansData['user_email'] = this.userEmail;
          this.plansPageService.postSelectedPlan(this.plansData).subscribe(
            res => {
              console.log(res);
              this.letOutPlanData = res;
              if (this.letOutPlanData.data.plan_type == 'let_out') {
                this.router.navigate(['/payment-summary'], { queryParams: { 'orderID': this.letOutPlanData.data.order_id } });
              }
              else if (this.letOutPlanData.data.plan_type == 'rent') {
                this.plansPageService.crm_call(this.user_id).subscribe();
                this.router.navigate(['plans']);
                this.openConfirmationModal();
              }
            },
            err => {
              console.log(err);
            }
          );
        }
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
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
