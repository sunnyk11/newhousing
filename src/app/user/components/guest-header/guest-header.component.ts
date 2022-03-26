import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { JwtService } from '../../services/jwt.service';
import { Subscription } from 'rxjs';
import { CommonService } from '../../guest/services/common.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-guest-header',
  templateUrl: './guest-header.component.html',
  styleUrls: ['./guest-header.component.css']
})
export class GuestHeaderComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();

  public LoggedIn: boolean = false;
  public userEmail: string = '';
  public toll_free=environment.toll_free;
  public userId: string = '';
  public login_usertype:number=0;
  public profile_pic: string = '';
  public google_profile_pic: any;
  public userName: string = '';
  private logged_in: Subscription;
  public ftpstring = environment.ftpURL;
  public property: any = {};
  public wishlist_length: number = 0;
  public property_comp: any = {};
  public property_comp_length: number = 0;
  public token: string = '';
  private google_token: string = '';
  public service_provider:boolean=false;


  constructor(
    private jwtService: JwtService,
    private commonService: CommonService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {
    this.logged_in = this.commonService.getUpdate().subscribe(
      message => {
        //console.log(message);
        this.LoggedIn = message.text;
        this.token = message.token;
        if (this.token.length>5) {
          this.user_details();
        }
      });
  }

  ngOnInit(): void {
    this.user_details();
  }
  user_details() {
    if (this.jwtService.isTokenAvailable()) {
      this.LoggedIn = true;
      this.login_usertype = this.jwtService.getUserType();
      this.userEmail = this.jwtService.getUserEmail();
      this.userId = this.jwtService.getUserId();
      this.profile_pic = this.jwtService.getProfilePic();
      if (this.profile_pic?.indexOf('https') != -1) {
        this.google_profile_pic = this.sanitize(this.profile_pic)
      }
      this.userName = this.jwtService.getUserName();
      this.product_wishlist();
      this.product_comapre();
      this.user_plan_availability();
      // wishlist refresh function 
      this.wishlist_refresh();
      // product conpare function   
      this.compare_refresh();
    }
    else {
      this.LoggedIn = false;
    }
  }
  // fetch wishlist property 
  product_wishlist() {
    this.commonService.getwishlit_property({ param: null }).subscribe(
      response => {
        this.property = response;
        this.wishlist_length = this.property.data.length;
      }
    );
  }
  // fetch product compare property 
  product_comapre() {
    this.commonService.getproduct_comp({ param: null }).subscribe(
      response => {
        this.property_comp = response;
        this.property_comp_length = this.property_comp.data.length;
      }
    );
  }
  // user_plan_availability
  user_plan_availability(){
    this.commonService.user_plan_availability({ param: null }).subscribe(
      response => {
        this.service_provider=false;
        let data:any=response;
        if(data.data.length>0 || this.login_usertype ==8 || this.login_usertype ==11){
          this.service_provider=true;
        }
      }
    );
  }
  compare_notification(): void {
    this.toastr.info('Minimun Two Property required', 'Comparison', {
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
    });
  }
  wishlist_refresh() {
    this.commonService.on<string>().subscribe(
      (message: any) => {
        if (message == 'true') {
          this.product_wishlist();
          this.user_plan_availability();
        }
      }
    );
  }
  compare_refresh() {
    this.commonService.pro_comp_on<string>().subscribe(
      (message: any) => {
        if (message == 'true') {
          this.product_comapre();
          this.user_plan_availability();
        }
      }
    );
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}
