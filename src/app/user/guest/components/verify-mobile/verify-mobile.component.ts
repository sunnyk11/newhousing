import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JwtService } from 'src/app/user/services/jwt.service';
import { VerifyMobileService } from '../../services/verify-mobile.service';
import { PlansPageService } from '../../services/plans-page.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FixAppointmentComponent } from '../../modals/fix-appointment/fix-appointment.component';

@Component({
  selector: 'app-verify-mobile',
  templateUrl: './verify-mobile.component.html',
  styleUrls: ['./verify-mobile.component.css']
})
export class VerifyMobileComponent implements OnInit {

  public showLoadingIndicator: boolean = false;

  constructor(private fb: FormBuilder,
    private jwtService: JwtService,
    private verifyMobileService: VerifyMobileService,
    private plansPageService: PlansPageService,
    private router: Router,
    private modalService: NgbModal) { }

  public verify: boolean = false;
  public submitted: boolean = false;
  public currentUserId: any;
  public errorMessage: any;
  public isFailedVerify: boolean = false;
  public otp_submitted: boolean = false;
  public number: string = '';
  public isFailedVerify_otp: boolean = false;
  public isVerified: boolean = false;
  private previousUrl: any;

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

  verifyForm = this.fb.group({
    form_phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
  });

  otpForm = this.fb.group({
    otp_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  get f() {
    return this.verifyForm.controls;
  }

  get g() {
    return this.otpForm.controls;
  }

  ngOnInit(): void {
    this.currentUserId = this.jwtService.getUserId();
    this.previousUrl = this.jwtService.getReturnURL();
    console.log(this.previousUrl);
    if (this.jwtService.getToken()) {
      this.user_id = this.jwtService.getUserId();
      // this.userEmail = JSON.parse(this.jwtService.getUserEmail());
      this.userEmail = this.jwtService.getUserEmail();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.verifyForm.invalid) {
      return;
    }
    this.showLoadingIndicator = true;
    this.verifyMobileService.mobile_verify(this.verifyForm.value.form_phone, this.currentUserId).subscribe(
      data => {
        this.showLoadingIndicator = false;
        //console.log(data);
        this.verify = true;
        this.number = this.verifyForm.value.form_phone;
      },
      err => {
        this.showLoadingIndicator = false;
        this.errorMessage = err.error;
        this.isFailedVerify = true;
      }
    );
  }

  onSubmitotp() {
    this.otp_submitted = true;
    if (this.otpForm.invalid) {
      return;
    }
    this.showLoadingIndicator = true;
    this.verifyMobileService.mobile_verify_otp(this.number, this.otpForm.value.otp_password, this.currentUserId).subscribe(
      data => {
        this.showLoadingIndicator = false;
        this.isVerified = true;
        this.verify = false;

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
          console.log(this.previousUrl);
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
          this.jwtService.removeReturnURL();
        }
        else if (this.previousUrl.includes('profile')) {
          this.jwtService.removeReturnURL();
          this.router.navigate(['profile']);
        }
        else {
          this.router.navigateByUrl(this.previousUrl || '');
          this.jwtService.removeReturnURL();
        }
      },
      err => {
        this.showLoadingIndicator = false;
        this.errorMessage = err.error;
        this.verify = true;
        this.isFailedVerify_otp = true;
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
