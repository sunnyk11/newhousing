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
  public verify_token:any;

  constructor(
    private registerService: RegisterPageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jwtService: JwtService,

    private UserLogsService:UserLogsService
  ) { 
    
    this.route.queryParams.subscribe((params) => {
      if(params.verify_token != null){
        if(this.route.snapshot.queryParams['verify_token'].length==10){
           this.verify_token = this.route.snapshot.queryParams['verify_token'];  
           this.user_details(this.verify_token);   
         } else {
           this.router.navigate(['/sign-up']);
         }
      } else {
        this.router.navigate(['/sign-up']);
      }
    });
     this.usertype = this.jwtService.getUserType();
      this.url_info= this.router.url;
      this.device_info = this.UserLogsService.getDeviceInfo();
      this.browser_info = this.UserLogsService.getbrowserInfo();
      this.ip_address = this.UserLogsService.getIpAddress();
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
    
     this.isVerified= false;
  }

  get f() {
    return this.form.controls;
  }

  
  user_details(token:any){
    let param = { verify_code: token }
    this.registerService.sign_up_user_details(param).subscribe(
      response => {
        let data:any= response;
        if(data.data != null){          
          this.form.patchValue({
            tnc_check:data.data.user_aggree
          });
          if(data.user_name[0]){
            this.form.patchValue({
              firstName:data.user_name[0]
            });
          }
          if(data.user_name[1]){
            this.form.patchValue({
              lastName:data.user_name[1]
            });
          }
          this.form.patchValue({
            phone_number:data.data.mobile_no
          });
        }else{
          this.router.navigate(['/sign-up']);
        }
      }
      );

  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.showLoadingIndicator = false;
      return;
    }
     this.isVerified= false;
    this.showLoadingIndicator = true;
    this.registerService.register_new(this.form).subscribe(
      data => {
        this.showLoadingIndicator = false;
        let user_data:any=data;
        this.isSignUpFailed = false;
        this.isVerified = true;
         // user logs functionalty 
         this.type="Registration page";
         this.input_info=user_data.data;
         let param={'userEmail':user_data.data.email,'user_type':this.usertype,'device_info':this.device_info,'browser_info':this.browser_info,'ip_address':this.ip_address,'url_info':this.url_info,'type':this.type,'user_cart':this.user_cart,'input_info':this.input_info}
         this.UserLogsService.user_logs(param).subscribe(
           reponse => {
          });
             //

      },
      err => {
        this.showLoadingIndicator = false;
        this.errorMessage = err.error;
        this.isSignUpFailed = true;
      }
    );
  }
  keyPressNumbers1(event: { which: any; keyCode: any; preventDefault: () => void; }) {
    var charCode = (event.which) ? event.which : event.keyCode;
    event.preventDefault();
      return false;
    
  }
  
  onPaste(e:any) {
    e.preventDefault();
    return false;
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
