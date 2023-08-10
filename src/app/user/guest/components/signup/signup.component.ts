import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { RegisterPageService } from '../../services/register-page.service';
import { UserLogsService } from '../../services/user-logs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from 'src/app/user/services/jwt.service';
import { ToastrService } from 'ngx-toastr';import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  
  
  public submitted: boolean = false;
  public mobile_submitted:boolean=false;
  public display_otp_form: boolean = false;
  public isFailedVerify_otp: boolean = false;
  public status_code:number=200;
  public LoginFailed: boolean = false;
  public errorMessage: string = "";
  public errormobile:string ="";
  public otp_submitted: boolean = false;
  public showLoadingIndicator: boolean = false;
  public mobile_no:any;
  public mobile_slice: any;
  public returnUrl:any;

  
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

  otpForm = this.fb.group({
    otp_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });
  loginForm = this.fb.group({
    user_name: ['', Validators.required],
    mobile_no: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    sign_up_page:[''],
    tnc_check: [false, Validators.required]
  })

  constructor(
    private fb: UntypedFormBuilder,
    private registerService: RegisterPageService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private jwtService: JwtService,
    private titleService: Title,
    private UserLogsService:UserLogsService
    ) {
      this.usertype = this.jwtService.getUserType();
        this.url_info= this.router.url;
        this.type="sign-up page";
        this.device_info = this.UserLogsService.getDeviceInfo();
        this.browser_info = this.UserLogsService.getbrowserInfo();
        this.ip_address = this.UserLogsService.getIpAddress();
       }

  ngOnInit(): void {
    
    this.titleService.setTitle('Sign-UP');
    this.returnUrl = this.jwtService.getReturnURL();
    if (this.jwtService.getToken()) {
        this.router.navigateByUrl('');
      }
    
  }
  
  get LoginFormControl() {
    return this.loginForm.controls;
  }
  get g() {
    return this.otpForm.controls;
  }
  
  onSubmit() {
    this.submitted=true;
    this.LoginFailed = false;
    if (this.loginForm.invalid) {
      return;
    }else{
      this.showLoadingIndicator = true;
      if(this.returnUrl){
        this.loginForm.patchValue({
          sign_up_page:this.returnUrl
        });     
      }else{
        this.loginForm.patchValue({
          sign_up_page:'sign-up'
        });
      }
      
        if( this.loginForm.value.tnc_check == true){
          this.loginForm.patchValue({
            tnc_check:'1'
          });
        }else{      
          this.loginForm.patchValue({
            tnc_check:'0'
          });
        }
      this.registerService.sign_up_otp_send(this.loginForm.value).subscribe(
        response => {
          this.showLoadingIndicator = false;
          let data:any=response;
          if(data.status==201){
            this.router.navigate(['register'], { queryParams: { 'verify_token': data.verify_code } });
            
          } if(data.status==200){
            this.LoginFailed = false;
            this.mobile_no=data.mobile_no;
            this.mobile_slice = data.mobile_no.toString().replace(/[0-9]{6}/, '********');
            this.display_otp_form = true;
            
          }
        }, err => {
          this.showLoadingIndicator = false;
          this.errorMessage = err.error.errors.message;
          this.errormobile=err.error.errors.mobile_no;
          this.status_code=err.error.status;
          this.LoginFailed = true;
        }
      );
    }
  }
  user_otp_resend(){
    this.registerService.user_otp_resend(this.loginForm.value).subscribe(
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
    this.returnUrl = this.jwtService.getReturnURL();
    
    this.registerService.mobile_login_verify_otp(this.mobile_no,this.loginForm.value, this.otpForm.value.otp_password).subscribe(
      response => {
        let data:any=response;
        this.input_info=this.loginForm.value;
        let param={'user_mobile':this.mobile_no,'user_type':this.usertype,'device_info':this.device_info,'browser_info':this.browser_info,'ip_address':this.ip_address,'url_info':this.url_info,'type':this.type,'user_cart':this.user_cart,'input_info':this.input_info}
        this.UserLogsService.user_logs(param).subscribe(
          reponse => {
         });
        if(data.status==200){
          this.router.navigate(['/register'], { queryParams: { 'verify_token': data.verify_code } });
        }

      }, err => {
        this.showLoadingIndicator = false;
        this.errorMessage = err.error.message;
        this.status_code=err.error.status;
        this.isFailedVerify_otp = true;
      }
      );
    }
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
