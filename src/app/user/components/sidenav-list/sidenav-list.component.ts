import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { JwtService } from '../../services/jwt.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../guest/services/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  @Output() sidenavClose = new EventEmitter();

  public LoggedIn: boolean = false;
  public userEmail: string = '';
  public userId: string = '';
  public toll_free=environment.toll_free;
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
  public screenWidth: number=0;

  constructor(private jwtService: JwtService, 
    private commonService: CommonService, 
    private router:Router,
    private sanitizer:DomSanitizer,
    private toastr: ToastrService) { 
    this.logged_in = this.commonService.getUpdate().subscribe(
      (message:any) => {
        this.LoggedIn = message.text;
        this.token = message.token;
        if(this.token){
          this.getScreenSize();
        }
      });
  }

  ngOnInit(): void {
    this.getScreenSize();
  }
  
  getScreenSize(){
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <950){
      this.user_details();
    }
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

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }
  
  navigate(){
    if (this.jwtService.isTokenAvailable()) {
       this.router.navigate(['/agent/list-property']);
    }else{
      this.router.navigate(['/owner-landing']);
    }
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  product_wishlist(){
    this.commonService.getwishlit_property({ param: null }).subscribe(
      response => {
        this.property=response;
        this.wishlist_length=this.property.data.length;
      }
    );
  }  

  product_comapre(){
    this.commonService.getproduct_comp_mobile({ param: null }).subscribe(
      response => {
        this.property_comp=response;
        this.property_comp_length=this.property_comp.data.length;
      }
    );
  }

  compare_notification():void{
    this.toastr.info('Minimun Two Property required','Comparision', {
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
}
