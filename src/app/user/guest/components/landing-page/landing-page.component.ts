import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from 'src/app/user/services/jwt.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Title } from '@angular/platform-browser';
import { GtmserviceService } from '../../services/gtmservice.service';
import { UserLogsService } from '../../services/user-logs.service';
import { RegisterPageService } from '../../services/register-page.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  testimonial_data = [
    { id:1,content: "I had been struggling to find a reliable platform to let out my property in Delhi. But with HousingStreet.com, I got my property rented out within just 30 days, without paying anything in advance. Their efficient team took care of everything, making the    process hassle-free. Highly recommended!", author: "Rajesh Verma" ,stars:5},
    { id:2,content: "After dealing with brokers and paying hefty brokerage fees, I came across HousingStreet.com. They not only let out my property within 30 days but also charged me just 15 days rent as their service fee. Their professional team handled everything, from tenant verification to rent agreement, saving  me a lot of time and effort. Thanks to HousingStreet.com!", author: "M.K Sharma", stars:5 },
    { id:3,content: "Wow! HousingStreet.com made renting out my property in Delhi a breeze. Within just 30 days, they found reliable tenants, took care of all the paperwork, and I didn't have to payanything upfront. Their service fee of just 15 days' rent is a steal!", author: "Deepak Joshi",stars:5 },
    { id:4,content: "I'm extremely satisfied with the service provided by HousingStreet.com. They took  care of everything, from listing my property to tenant verification. The best part was that I only had to get involved when the payment was transferred to my account. Highly recommend their efficient and cost-effective approach!", author: "Rakesh Kapoor",stars:5 },
    // Add more testimonials as needed
  ];
  
  public submitted: boolean = false;
  public mobile_submitted:boolean=false;
  public LoggedIn: boolean = false;
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
    private UserLogsService:UserLogsService,
    private gtmService: GtmserviceService,
    private toastr: ToastrService,
    private jwtService: JwtService,) { }

  ngOnInit(): void {
    this.titleService.setTitle('Onwers');
    this.sendDataToGTM();
    
    if (this.jwtService.isTokenAvailable()) {
      this.LoggedIn = true;
    }else{
      this.LoggedIn = false;
    }
  }
  get LoginFormControl() {
    return this.loginForm.controls;
  }
  get g() {
    return this.otpForm.controls;
  }
  sendDataToGTM()  {
           
    const data = {
      event: 'dataLayer',
      data: {
        

      },
      action: 'Onload Action',
      label: 'Owner Landing page',
      page_name:'Owner Landing Page',
      page_url:this.router.url,
      site_type:this.UserLogsService.getDeviceInfo(),
      // Additional data properties as needed
    };

    this.gtmService.pushToDataLayer(data);
    console.log(data);
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
  // carosule image
  testimonial: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    autoplay:true,
    autoplayHoverPause:true,
    dots: true,
    navSpeed: 2000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      },
      1050: {
        items: 1
      }
    },
    nav: true
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
