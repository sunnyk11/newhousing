import { Component, OnInit } from '@angular/core';
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

  public LoggedIn: boolean = false;
  public userEmail: string = '';
  public userId: string = '';
  public profile_pic: string = '';
  public google_profile_pic: any;
  public userName: string = '';
  private logged_in: Subscription;
  public ftpstring = environment.ftpURL;
  public property:any={};
  public wishlist_length:number=0;
  public property_comp:any={};
  public property_comp_length:number=0;
  public token: string='';
  private google_token: string=' ';


  constructor(
    private jwtService: JwtService,
    private commonService: CommonService,
    private sanitizer:DomSanitizer,
    private toastr: ToastrService
  ) { 
    this.logged_in = this.commonService.getUpdate().subscribe(
      message => {
        this.LoggedIn = message.text;
        this.token = message.token;
        if(this.token){
          this.user_details();
        }
      });
  }

  ngOnInit(): void {
    this.user_details();
  }
  user_details(){
    if(this.jwtService.isTokenAvailable()) {
      this.LoggedIn = true;
      this.userEmail = this.jwtService.getUserEmail();
      this.userId = this.jwtService.getUserId();
      this.profile_pic = this.jwtService.getProfilePic();
        if(this.profile_pic?.indexOf('https') != -1) {
          this.google_profile_pic = this.sanitize(this.profile_pic)
        }
      this.userName = this.jwtService.getUserName();
      this.product_wishlist();
      this.product_comapre();
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
  product_wishlist(){
    this.commonService.getwishlit_property({ param: null }).subscribe(
      response => {
        this.property=response;
        this.wishlist_length=this.property.data.length;
      }
    );
  }  
  // fetch product compare property 
  product_comapre(){
    this.commonService.getproduct_comp({ param: null }).subscribe(
      response => {
        this.property_comp=response;
        this.property_comp_length=this.property_comp.data.length;
      }
    );
  }
  compare_notification():void{
    this.toastr.info('Minimun Two Property required','Comparison', {
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
    });
  }
  wishlist_refresh(){
    this.commonService.on<string>().subscribe(
      (message: any) => {
        if (message == 'true') {
          this.product_wishlist();
        }
      }
    );
  }
  compare_refresh(){
    this.commonService.pro_comp_on<string>().subscribe(
      (message: any) => {
        if (message == 'true') {
          this.product_comapre();
        }
      }
    );    
  }
  
  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}
}
