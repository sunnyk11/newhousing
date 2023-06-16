import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from 'src/app/user/services/jwt.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Title } from '@angular/platform-browser';
import { RegisterPageService } from '../../services/register-page.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  
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
  public isReadMore: boolean = true;

  otpForm = this.fb.group({
    otp_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });
  loginForm = this.fb.group({
    user_name: ['', Validators.required],
    mobile_no: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    sign_up_page:[''],
    tnc_check: [false, Validators.required]
  })

  public toll_free=environment.toll_free;
  constructor(
    private fb: FormBuilder,private titleService: Title,
    private registerService: RegisterPageService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private jwtService: JwtService,) { }

  ngOnInit(): void {
    this.titleService.setTitle('Onwer-Landing Page');
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
  showText() {
    this.isReadMore = !this.isReadMore;
  }

  customOptions: OwlOptions = {
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: true,
    navSpeed: 700,
    navText: ['&#8249', '&#8250;'],
    responsive: {
      0: {
        items: 1,
        loop: true 
      },
      480: {
        items: 1,
        loop: true
      },
      667: {
        items: 2,
        loop: true
      },
      1024: {
        items: 3,
        loop: false
      }
    },
    nav: true
  }


}
