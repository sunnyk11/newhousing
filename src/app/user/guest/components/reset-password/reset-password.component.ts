import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordService } from '../../services/reset-password.service';
import { ConfirmedValidator } from '../../utils/validation';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public form: any;
  public otpForm: any;
  public passwordForm: any;
  public submitted: boolean = false;
  public email_form_display: boolean = true;
  public mobile_number_display: boolean = false;
  public response_data: any;
  public mobile_slice: any;
  public display_otp_form: boolean = false;
  public otp_submitted: boolean = false;
  public isFailedVerify_otp: boolean = false;
  public errorMessage: any;
  public showPasswordForm: boolean = false;
  public pwd_submitted: boolean = false;
  public reset_success: boolean = false;
  public user_email: any;
  public email_display: boolean = false;
  public otpEmailForm: any;
  public display_otp_email_form: boolean = false;
  public e_otp_submitted: boolean = false;
  private data_otp: any;
  private data: any;
  public isFailedVerify_otp_email: boolean = false;
  public email_response_data: any;
  public isEmailRegistered: boolean = true;

  public showLoadingIndicator: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private resetPasswordService: ResetPasswordService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]]
      }
    );

    this.otpForm = this.formBuilder.group({
      otp_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.otpEmailForm = this.formBuilder.group({
      otp_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      cpassword: ['', [Validators.required]]
    },
      {
        validators: ConfirmedValidator('password', 'cpassword')
      });
  }

  get f() {
    return this.form.controls;
  }

  get g() {
    return this.otpForm.controls;
  }

  get p() {
    return this.passwordForm.controls;
  }

  get e() {
    return this.otpEmailForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      //this.showLoadingIndicator = false;
      return;
    }
    this.showLoadingIndicator = true;
    this.resetPasswordService.verify_email(this.form.value.email).subscribe(
      data => {
        this.showLoadingIndicator = false;
        //console.log(data);
        this.email_response_data = data;
        if (this.email_response_data) {
          this.isEmailRegistered = true;
          this.response_data = data;
          this.email_form_display = false;
          this.mobile_number_display = true;
          //console.log(typeof (this.response_data));
          this.mobile_slice = this.response_data.toString().replace(/[0-9]{8}/, '********');
        }
        else {
          if (this.email_response_data === 0) {
            this.isEmailRegistered = false;
          }
          else {
            this.isEmailRegistered = true;
            this.user_email = this.form.value.email;
            this.email_display = true;
            this.email_form_display = false;
          }
        }
      },
      err => {
        this.showLoadingIndicator = false;
        // console.log(err);
      }
    );

  }

  proceed_verify() {
    this.showLoadingIndicator = true;
    this.resetPasswordService.verify_mobile(this.response_data).subscribe(
      data => {
        this.showLoadingIndicator = false;
        //console.log(data);
        this.display_otp_form = true;
        this.mobile_number_display = false;
      },
      err => {
        this.showLoadingIndicator = false;
        // console.log(err);
      }
    );
  }

  onSubmitotp() {
    this.otp_submitted = true;
    if (this.otpForm.invalid) {
      //this.showLoadingIndicator = false;
      return;
    }
    this.showLoadingIndicator = true;
    this.resetPasswordService.verify_otp(this.response_data, this.otpForm.value.otp_password).subscribe(
      data => {
        this.showLoadingIndicator = false;
        //console.log(data);
        this.showPasswordForm = true;
        this.display_otp_form = false;
      },
      err => {
        this.showLoadingIndicator = false;
        // console.log(err);
        this.isFailedVerify_otp = true;
        this.errorMessage = err.error.message;
      }
    );
  }

  onSubmitPassword() {
    this.pwd_submitted = true;
    if (this.passwordForm.invalid) {
      //this.showLoadingIndicator = false;
      return;
    }
    this.showLoadingIndicator = true;
    this.resetPasswordService.reset_password(this.passwordForm.value.password, this.passwordForm.value.cpassword, this.form.value.email).subscribe(
      data => {
        this.showLoadingIndicator = false;
        //console.log(data);
        this.reset_success = true;
        this.showPasswordForm = false;
      },
      err => {
        this.showLoadingIndicator = false;
        // console.log(err);
      }
    );
  }

  proceed_verify_email() {
    this.showLoadingIndicator = true;
    this.resetPasswordService.send_otp_email(this.form.value.email).subscribe(
      data => {
        this.showLoadingIndicator = false;
        this.data_otp = data;
        //console.log(this.data_otp);
        this.display_otp_email_form = true;
        this.email_display = false;
      },
      err => {
        this.showLoadingIndicator = false;
        // console.log(err);
      }
    );
  }

  onSubmitotp_email() {
    this.e_otp_submitted = true;
    if (this.otpEmailForm.invalid) {
      //this.showLoadingIndicator = false;
      return;
    }
    this.showLoadingIndicator = true;
    this.resetPasswordService.verify_otp_email(this.form.value.email, this.otpEmailForm.value.otp_password).subscribe(
      data => {
        this.showLoadingIndicator = false;
        //console.log(data);
        this.showPasswordForm = true;
        this.display_otp_email_form = false;
      },
      err => {
        this.showLoadingIndicator = false;
        // console.log(err);
        this.isFailedVerify_otp_email = true;
        this.errorMessage = err.error.message;
      }
    );


    // if (this.otpEmailForm.value.otp_password == this.data_otp) {
    //   console.log("OTP Matches");
    //   this.showPasswordForm = true;
    //   this.display_otp_email_form = false;
    //   this.isFailedVerify_otp_email = false;
    // }
    // else {
    //   console.log("OTP does not match");
    //   this.isFailedVerify_otp_email = true;
    //   this.errorMessage = "Verification Failed";
    // }
  }

}
