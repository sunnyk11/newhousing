import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { LoginPageService } from '../../services/login-page.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { CommonService } from '../../services/common.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { PlansPageService } from '../../services/plans-page.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    email_address: ['', Validators.required],
    password: ['', Validators.required]
  });

  public submitted: boolean = false;
  public errorMessage: string = "";
  public LoginFailed: boolean = false;
  private access_token: any;
  public response_data: any;
  public LoggedIn: boolean = false;
  private username: string = '';
  private profile_pic: any;
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

  constructor(
    private fb: FormBuilder,
    private loginPageService: LoginPageService,
    private jwtService: JwtService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private plansPageService: PlansPageService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        let token = params['token'];
        let data = params['data'];
        //console.log(data);
        if (token && data) {
          this.LoggedIn = true;
          this.username = JSON.parse(data).name;
          this.profile_pic = JSON.parse(data).profile_pic;
          this.commonService.sendUpdate(this.LoggedIn, this.username, this.profile_pic);
          this.jwtService.saveGoogleUser(token, data);
        }
      }
    );

    if (this.jwtService.getToken()) {
      this.user_id = this.jwtService.getUserId();
      this.userEmail = this.jwtService.getUserEmail();
      this.returnUrl = this.jwtService.getReturnURL();
      //console.log(this.returnUrl);
      if (this.returnUrl?.includes('/product_payment_summary')) {
        //console.log(this.returnUrl);
        this.proceedToPayment();
      }
      else {
        this.router.navigateByUrl('');
      }
    }
  }

  get LoginFormControl() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      let loginData = {
        email: this.loginForm.value.email_address,
        password: this.loginForm.value.password,
        rememberme: 1
      }
      this.loginPageService.login(loginData).subscribe(
        response => {
          //console.log(response);
          this.LoginFailed = false;
          this.LoggedIn = true;
          this.response_data = response;
          //console.log(this.response_data);
          this.commonService.sendUpdate(this.LoggedIn, this.response_data.data.username, this.response_data.data.misc.profile_pic);
          //console.log(this.response_data.data.access_token);
          //this.jwtService.saveToken(this.response_data.data.access_token);
          this.jwtService.saveUser(this.response_data.data);
          this.user_id = this.jwtService.getUserId();
          this.userEmail = this.jwtService.getUserEmail();

          this.returnUrl = this.jwtService.getReturnURL();
          //console.log(this.returnUrl);
          if (this.returnUrl?.includes('/product_payment_summary')) {
            //console.log(this.returnUrl);
            this.proceedToPayment();
          }
          else {
            this.router.navigateByUrl(this.returnUrl);
          }
        },
        err => {
          this.errorMessage = err.error.message;
          this.LoginFailed = true;
          //console.log(err);
        }
      );
    }
    else {
      //console.log("Invalid");
    }

  }

  redirect_login_google() {
    window.location.href = environment.googleURL;
  }

  proceedToPayment() {
    this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
      data => {
        //console.log(data);
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

}
