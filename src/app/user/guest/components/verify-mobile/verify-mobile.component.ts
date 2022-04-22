import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JwtService } from 'src/app/user/services/jwt.service';
import { VerifyMobileService } from '../../services/verify-mobile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    private toastr: ToastrService,
    private router: Router) { }

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
  public mobile_slice: any;

  public property_data: any;
  private user_id: any;
  private userEmail: any;
  public selectedPlanData: any;
  public plansData: any;
  public letOutPlanData: any;
  public modified_url:any;

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
    this.modified_url=this.previousUrl.split('?')[0];
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
        
        this.mobile_slice = this.verifyForm.value.form_phone.toString().replace(/[0-9]{6}/, '********');
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
            this.router.navigate(['/verify-mobile/success']);

      },
      err => {
        this.showLoadingIndicator = false;
        this.errorMessage = err.error;
        this.verify = true;
        this.isFailedVerify_otp = true;
      }
    );
  }
  
  user_otp_resend(){
    
    let param = { mobile_no: this.number}
    this.verifyMobileService.user_otp_resend(param).subscribe(
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


}
