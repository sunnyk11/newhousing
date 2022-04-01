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
import { UserLogsService } from '../../services/user-logs.service';
import { ToastrService } from 'ngx-toastr';

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
  mobile_loginForm = this.fb.group({
    mobile_no: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
  });

  otpForm = this.fb.group({
    otp_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  public submitted: boolean = false;
  public mobile_submitted:boolean=false;
  public display_otp_form: boolean = false;
  public showLoadingIndicator: boolean = false;
  public isFailedVerify_otp: boolean = false;
  public otp_submitted: boolean = false;
  public mobile_slice: any;
  public errorMessage: string = "";
  public status_code:number=200;
  public LoginFailed: boolean = false;
  public LoginFailed1: boolean = false;
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
  public mobile_no:any;
  public modified_url:any;

  private usertype: any;
  public userDetails: any;
  public ip_address: any;
  public pro_id: any = null;
  public type: any;
  public device_info: any;
  public  browser_info: any;
  public url_info: string = '';
  public url: any;
  public input_info: any = null;
  public user_cart: any = null;

  constructor(
    private fb: FormBuilder,
    private loginPageService: LoginPageService,
    private jwtService: JwtService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private plansPageService: PlansPageService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private UserLogsService:UserLogsService
  ) {
    this.usertype = this.jwtService.getUserType();
      this.url_info= this.router.url;
      this.device_info = this.UserLogsService.getDeviceInfo();
      this.browser_info = this.UserLogsService.getbrowserInfo();
      this.ip_address = this.UserLogsService.getIpAddress();
      //console.log(this.browser_info);
      //console.log(this.ip_address);
     }

  ngOnInit(): void {
    this.ip_address = this.UserLogsService.getIpAddress();
    this.route.queryParams.subscribe(
      params => {
        let google_token = params['token'];
        let email = params['email'];
        let user_id = params['id'];
        let user_name = params['name'];
        let user_type = params['usertype'];
        let user_profile_pic = params['profile_pic'];

        if (google_token) {
          this.LoggedIn = true;
          this.showLoadingIndicator=true;
          this.jwtService.saveGoogleToken(google_token);
          this.jwtService.saveUserEmail(email);
          this.jwtService.saveUserID(user_id);
          this.jwtService.saveUserName(user_name);
          this.jwtService.saveUserType(user_type);
          this.jwtService.saveUserProfilePic(user_profile_pic);

          //this.jwtService.saveGoogleUser(google_token, data);
          this.commonService.sendUpdate(this.LoggedIn, google_token);
        }
      }
    );

    if (this.jwtService.getToken()) {
      this.showLoadingIndicator=true;
      this.user_id = this.jwtService.getUserId();
      this.userEmail = this.jwtService.getUserEmail();
      this.returnUrl = this.jwtService.getReturnURL();
      if(this.returnUrl){
        this.modified_url=this.returnUrl.split('?')[0];
      }
      if (this.modified_url?.includes('/product_payment_summary')) {
        let x:any=this.returnUrl.split('?')[1];
        let y:any=x.split('=')[1];
        this.router.navigate([this.modified_url],{queryParams:{'productID':y}})
      }
      else if (this.returnUrl?.includes('/plans')) {
        this.getPhoneDetails();
      }else if (this.modified_url?.includes('/product-details')) {
        this.fixed_appointment();
      }else if (this.returnUrl?.includes('/product_payment_summary')) {
        //console.log(this.returnUrl);
        this.proceedToPayment();
        //this.jwtService.removeReturnURL();
      } 
      else {
        this.router.navigateByUrl(this.returnUrl || '');
      }
    }
  }

  get LoginFormControl() {
    return this.loginForm.controls;
  }
  
  get g() {
    return this.otpForm.controls;
  }
  get mobile_LoginFormControl() {
    return this.mobile_loginForm.controls;
  }
  

  onSubmit() {
    this.showLoadingIndicator = true;
    this.submitted = true;
    this.LoginFailed1=false;
    this.mobile_loginForm.reset();
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
          //console.log(this.response_data.data.user_data);
          this.jwtService.saveUser(this.response_data.data);
          this.token = this.jwtService.getToken();
          this.commonService.sendUpdate(this.LoggedIn, this.token);
          this.user_id = this.jwtService.getUserId();
          this.userEmail = this.jwtService.getUserEmail();
          this.returnUrl = this.jwtService.getReturnURL();
          if(this.returnUrl){
            console.log(this.returnUrl);
            this.modified_url=this.returnUrl.split('?')[0];
          }
          // user logs functionalty 
          this.type="login page";
          this.input_info=this.response_data.data.user_data;
          let param={'userEmail':this.userEmail,'user_type':this.usertype,'device_info':this.device_info,'browser_info':this.browser_info,'ip_address':this.ip_address,'url_info':this.url_info,'type':this.type,'user_cart':this.user_cart,'input_info':this.input_info}
          this.UserLogsService.user_logs(param).subscribe(
            reponse => {
              // console.log(data.status);
            });
          if (this.modified_url?.includes('/product_payment_summary')) {
            let x:any=this.returnUrl.split('?')[1];
            let y:any=x.split('=')[1];
            this.router.navigate([this.modified_url],{queryParams:{'productID':y}})
          }
          else if (this.returnUrl?.includes('/plans')) {
            this.getPhoneDetails();
          }
          else if (this.modified_url?.includes('/product-details')) {
             this.fixed_appointment();
          }else if (this.returnUrl?.includes('/product_payment_summary')) {
            //console.log(this.returnUrl);
            this.proceedToPayment();
          }

          else {
            this.router.navigateByUrl(this.returnUrl || '');
          }
        },
        err => {
          this.showLoadingIndicator = false;
          this.errorMessage = err.error.message;
          this.status_code=err.error.status;
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
  onSubmit_mobile() {
    this.LoginFailed=false;
    this.loginForm.reset();
    this.mobile_submitted = true;
    if (this.mobile_loginForm.valid) {
      let loginmobile_data = {
        mobile_no: this.mobile_loginForm.value.mobile_no,
        rememberme: 1
      }
      this.LoginFailed1 = false;
      this.showLoadingIndicator = true;
      this.loginPageService.mobile_otp_send(loginmobile_data).subscribe(
        response => {
          this.showLoadingIndicator = false;
          let data:any=response;
          if(data.status==404){
            this.LoginFailed1 = true;
            this.errorMessage = data.message;
            this.status_code=data.status;

          }else{
            this.LoginFailed1 = false;
            this.mobile_no=data.mobile_no;
            this.mobile_slice = data.mobile_no.toString().replace(/[0-9]{6}/, '********');
            this.display_otp_form = true;
          }
        },
        err => {
          this.showLoadingIndicator = false;
          this.errorMessage = err.error.message;
          this.status_code=err.error.status;
          console.log(err.error);
          this.LoginFailed1 = true;
          //console.log(err);
        }
      );
    }
  }
  
  user_otp_resend(){
    let loginmobile_data = {
      mobile_no: this.mobile_loginForm.value.mobile_no,
      rememberme: 1
    }
    this.loginPageService.user_otp_resend_login(loginmobile_data).subscribe(
      response => {
        let data:any= response;
        if(data.status==200){
          this.toastr.success('Resend Successfully', 'OTP', {
            timeOut: 1000,
          });
        }
      }
      );
  }
  onSubmitotp() {
    this.otp_submitted = true;
    if (this.otpForm.invalid) {
      return;
    }else{
      this.LoginFailed=false;      
    this.showLoadingIndicator = true;
    this.loginPageService.mobile_login_verify_otp(this.mobile_no, this.otpForm.value.otp_password).subscribe(
      response => {
        this.showLoadingIndicator = false;
        //console.log(data);
        this.display_otp_form = false;
        this.showLoadingIndicator = false;
          console.log(response);
          this.LoginFailed1 = false;
          this.LoggedIn = true;
          this.response_data = response;
          this.jwtService.saveUser(this.response_data.data);
          this.token = this.jwtService.getToken();
          this.commonService.sendUpdate(this.LoggedIn, this.token);
          this.user_id = this.jwtService.getUserId();
          this.userEmail = this.jwtService.getUserEmail();
          this.returnUrl = this.jwtService.getReturnURL();
          if(this.returnUrl){
            console.log(this.returnUrl);
            this.modified_url=this.returnUrl.split('?')[0];
          }
          // user logs functionalty 
          this.type="login page";
          this.input_info=this.response_data.data.user_data;
          let param={'user_mobile':this.mobile_no,'user_type':this.usertype,'device_info':this.device_info,'browser_info':this.browser_info,'ip_address':this.ip_address,'url_info':this.url_info,'type':this.type,'user_cart':this.user_cart,'input_info':this.input_info}
          this.UserLogsService.user_logs(param).subscribe(
            reponse => {
            });
            if (this.modified_url?.includes('/product_payment_summary')) {
              let x:any=this.returnUrl.split('?')[1];
              let y:any=x.split('=')[1];
              this.router.navigate([this.modified_url],{queryParams:{'productID':y}})
            }
          else if (this.returnUrl?.includes('/plans')) {
            this.getPhoneDetails();
          }
          else if (this.modified_url?.includes('/product-details')) {
             this.fixed_appointment();
          }else if (this.returnUrl?.includes('/product_payment_summary')) {
            //console.log(this.returnUrl);
            this.proceedToPayment();
          }

          else {
            this.router.navigateByUrl(this.returnUrl || '');
          }
      },
      err => {
        this.showLoadingIndicator = false;
        // console.log(err);
        this.isFailedVerify_otp = true;
        this.errorMessage = err.error.message;
      }
    );
    
   }
  }

 
  redirect_login_google() {
    window.location.href = environment.googleURL;
  }
  
  navigate() {
    this.returnUrl = this.router.url;
    this.jwtService.removeReturnURL();
    this.jwtService.saveReturnURL(this.returnUrl);
    this.router.navigate(['/sign-up'])
  }

  proceedToPayment() {
    this.showLoadingIndicator = true;
    this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
      data => {
        this.showLoadingIndicator = false;
        //console.log(data);
        this.mobile_ver_status = data;
        if (this.mobile_ver_status !== 1) {
          //console.log("Mobile number not verified");
          this.router.navigate(['verify-mobile']);
        }
        else {
          this.jwtService.removeReturnURL();
          //console.log("Mobile number verified");
          this.property_data = JSON.parse(this.jwtService.getPlansData());
          //console.log(this.property_data);
          this.property_data.user_id = this.user_id;
          this.property_data.user_email = this.userEmail;
          console.log(this.property_data);

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
            },
            err => {

            }
          );
        }
      },
      err => {
        this.showLoadingIndicator = false;
        // console.log(err);
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

  getPhoneDetails() {
    this.showLoadingIndicator = true;
    this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
      data => {
        // this.showLoadingIndicator = false;
        this.mobile_ver_status = data;
        if (this.mobile_ver_status !== 1) {
          //console.log("Mobile number not verified");
          this.router.navigate(['verify-mobile']);
        }
        else {
          //console.log("Mobile number verified");
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
              else if (this.letOutPlanData.appointment == 'fixed_appointment') {
                this.plansPageService.crm_call_appionment(this.user_id).subscribe();
                this.router.navigate(['/fix-appointment']);
                // this.openConfirmationModal();
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

  keyPressNumbers(event: { which: any; keyCode: any; preventDefault: () => void; }) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
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
