import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';
import { IndexPageService } from '../../services/index-page.service';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/user/services/jwt.service';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-homepagefeature',
  templateUrl: './homepagefeature.component.html',
  styleUrls: ['./homepagefeature.component.css']
})
export class HomepagefeatureComponent implements OnInit {

  private  e: any;
  public ftpstring=environment.ftpURL;
  public property:any={};
  public product_copm:any={};
  public showLoadingIndicator:boolean= false;
  public product_length:number=0;

  constructor(
    private indexPageService: IndexPageService,
    private router:Router,
    private jwtService: JwtService,
    public CommonService:CommonService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.feature_property(); 
  }
  // fetch feature property 
  feature_property(){
    this.showLoadingIndicator= true;
    if(this.jwtService.getToken().length>5){
      this.indexPageService.login_Feature_Property({ param: null }).subscribe(
      response => {
        this.showLoadingIndicator= false;
        this.property=response;
        this.product_length=this.property.data.length;
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
      }
     );
     this.wishlist_refresh();
     this.pro_comp_refresh();
    }else{
    this.indexPageService.getFeature_Property({ param: null }).subscribe(
      response => {
        this.showLoadingIndicator= false;
        this.property=response;
        this.product_length=this.property.data.length;
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
      }
     );
    }
  }
  // property compare
  product_comp(id:number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.product_comp({param}).subscribe(
      response => {
        this.product_copm=response;
        this.product_length=0;
        this.feature_property();
        if(this.product_copm.data.length>4){
          this.toastr.info('Compare are the Full...!!!', 'Property', {
            timeOut: 3000,
          });
        }else{
          this.toastr.success('Added To compare Successfully', 'Property', {
            timeOut: 3000,
          });
        }
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
      }
     );
    }else{
      this.redirect_to_login();
    }
  }
  
  // wishlist add 
  wishlist_added(id: number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.wishlist_addd({param}).subscribe(
      response => {
        this.product_length=0;
        this.feature_property();
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
        this.toastr.error(Message, 'Something Error', {
          timeOut: 3000,
        });
      }
     );
    }
    else{
      this.redirect_to_login();
    }
  }
  // wishlist delete
  wishlist_remove(id: number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.wishlist_remove({param}).subscribe(
      response => {
        this.product_length=0;
        this.feature_property();
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
      }
     );
    }else{
      this.redirect_to_login();
    }
  }
  
  navigate(id:number,name:string,city:string){
    this.router.navigate(['/product-details'],{queryParams:{'id':id,'name':name,'city':city}})
  }

  // pricre convert functionalty
  Price_convert(num: number) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2).replace(/\.0$/, '') + 'G';
    }
    if (num >= 10000000) {
      return (num / 10000000).toFixed(2).replace(/\.0$/, '') + 'Crore';
    }
    if (num >= 100000) {
      return (num / 100000).toFixed(2).replace(/\.0$/, '') + 'Lac';
    }
    if (num >= 1000) {
      this.e=num;
      var t = (this.e = this.e ? this.e.toString() : "").substring(this.e.length - 3)
      , n = this.e.substring(0, this.e.length - 3);
    return "" !== n && (t = "," + t),
      n.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + t
    }
    return num;
  }
  redirect_to_login(): void {
    this.router.navigate(['/login'])
  } 
  // wishlist refreh functionalty 
  wishlist_refresh(){
    this.CommonService.emit<string>('true');
  } 
  // product comapre refresh function 
  pro_comp_refresh(){
    this.CommonService.pro_comp_emit<string>('true');
  } 
  
  // carosule image
  pro_feature: OwlOptions = {
    loop:true,
    dots:true,
    autoplay:true,
    autoplayHoverPause:true,
    navSpeed: 1500,
    navText: ['<span class="outer_slider"><i class="flaticon-left-arrow-1 left"></i></span> ', '<span class="outer_slider"><i class="flaticon-right-arrow right"></i></span>'],
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
        items: 3
      },
      1050: {
        items: 3
      },
      1250: {
        items: 3
      }
    },
    nav:true
  }  
 // carosule image
 pro_feature_inner: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    autoplay:false,
    dots: false,
    navSpeed: 700,
    navText: ['<span class="inner_slider"><i class="flaticon-left-arrow-1 left"></i></span> ', '<span class="inner_slider"><i class="flaticon-right-arrow right"></i></span>'],
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
}
