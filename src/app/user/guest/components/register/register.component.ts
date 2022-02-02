import { Component, OnInit } from '@angular/core';
import { RegisterPageService } from '../../services/register-page.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from '../../utils/validation';
import { UserLogsService } from '../../services/user-logs.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public showLoadingIndicator: boolean = false;

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
  public email_id: any;
  public first_name: any;
  public number: any;
  public otp_submitted: boolean = false;

  
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
    private registerService: RegisterPageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jwtService: JwtService,
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
    this.form = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
        cpassword: ['', [Validators.required]],
        phone_number: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        gender: ['', Validators.required],
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
    this.showLoadingIndicator = true;
    if (this.form.invalid) {
      //console.log(this.form);
      this.showLoadingIndicator = false;
      return;
    }
    this.registerService.register_new(this.form).subscribe(
      data => {
        this.showLoadingIndicator = false;
        //console.log(data);
        let user_data:any=data;
        this.isSignUpFailed = false;
        this.isSuccessful = true;
        //console.log(this.form);

         // user logs functionalty 
         this.type="Registration page";
         this.input_info=user_data.data;
         let param={'userEmail':user_data.data.email,'user_type':this.usertype,'device_info':this.device_info,'browser_info':this.browser_info,'ip_address':this.ip_address,'url_info':this.url_info,'type':this.type,'user_cart':this.user_cart,'input_info':this.input_info}
         this.UserLogsService.user_logs(param).subscribe(
           reponse => {
            // console.log(data.status);
          });
             //

        this.number = this.form.value.phone_number;
        this.email_id = this.form.value.email;
        this.first_name = this.form.value.firstName;
        this.verify = true;
      },
      err => {
        this.showLoadingIndicator = false;
        console.log(err);
        this.errorMessage = err.error;
        this.isSignUpFailed = true;
      }
    );
  }

  onSubmitotp(): void {
    {
      
      this.otp_submitted = true;
      if (this.otp_form.invalid) {
        return;
      }
      this.showLoadingIndicator = true;
      //console.log(this.number);
      //console.log(this.otp_form.otp_number);
      //console.log(this.email_id);
      //console.log(this.first_name);
      this.registerService.verify_otp(this.number, this.otp_form.value.otp_number, this.email_id, this.first_name).subscribe(

        data => {
          this.showLoadingIndicator = false;
          //console.log(data);
          this.isVerified = true;
          this.verify = false;

        },
        err => {
          this.showLoadingIndicator = false;
          this.errorMessage = err.error.message;
          this.verify = true;
          this.isFailedVerify = true;
          console.log(err);
        }
      );
    }
  }

}
