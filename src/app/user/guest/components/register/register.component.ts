import { Component, OnInit } from '@angular/core';
import { RegisterPageService } from '../../services/register-page.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from '../../utils/validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public isSuccessful = false;
  public errorMessage: any;
  public isSignUpFailed: boolean = false;
  public isVerified: boolean = false;
  public verify: boolean = false;
  public otp: any;
  public isFailedVerify: boolean = false;
  public submitted: boolean = false;
  public form: any;
  public otp_form: any;
  public email_id:any;
  public first_name:any;
  public number: any;
  public otp_submitted: boolean = false;

  constructor(
    private registerService: RegisterPageService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
        cpassword: ['', [Validators.required]],
        phone_number: ['', [Validators.required]],
        select_type: ['', Validators.required],
        tnc_check: [false, Validators.required]
      }, {
      validators: ConfirmedValidator('password', 'cpassword')
    }
    );

    this.otp_form = this.formBuilder.group(
      {
        otp_number: ['', [Validators.required, Validators.minLength(6)]]
      }
    );
  }

  get f() {
    return this.form.controls;
  }

  get g() {
    return this.otp_form.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    this.registerService.register_new(this.form).subscribe(
      data => {
        console.log(data);
        this.isSignUpFailed = false;
        this.isSuccessful = true;
        console.log(this.form);
        this.number = this.form.value.phone_number;
        this.email_id = this.form.value.email;
        this.first_name = this.form.value.firstName;
        this.verify = true;
      },
      err => {
        console.log(err);
        this.errorMessage = err.error;
        this.isSignUpFailed = true;
      }
    );
  }

  onSubmitotp(): void {
    {
      //this.showLoadingIndicator = true;
      this.otp_submitted = true;
      if (this.otp_form.invalid) {
        return;
      }
      console.log(this.number);
      console.log(this.otp_form.otp_number);
      console.log(this.email_id);
      console.log(this.first_name);
      this.registerService.verify_otp(this.number, this.otp_form.value.otp_number, this.email_id, this.first_name).subscribe(

        data => {
          //console.log(data);
          this.isVerified = true;
          this.verify = false;
          
        },
        err => {
          this.errorMessage = err.error.message;
          this.verify = true;
          this.isFailedVerify = true;
          //console.log(err);
        }
      );
    }
  }

}
