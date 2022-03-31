import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { ToastrService } from 'ngx-toastr';
import { UserLogsService } from '../../services/user-logs.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  
  public ftpstring=environment.ftpURL;
  public property:any={};
  private e:any;
  public wishlist_length:number=0;
  public product_copm:any={};
  public showLoadingIndicator:boolean=false;
  public  property_data: any = [];
  public userEmail:any;
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
    private jwtService: JwtService,
    private CommonService:CommonService,
    private toastr: ToastrService,
    private UserLogsService:UserLogsService,
    private router:Router
    ) { }

  ngOnInit(): void {
    if(this.jwtService.getToken()){
      this.showLoadingIndicator = true;
      this.userEmail =  this.jwtService.getUserEmail();
      this.usertype = this.jwtService.getUserType();
      this.jwtService.saveReturnURL(this.router.url);
      this.url_info= this.router.url;
      this.device_info = this.UserLogsService.getDeviceInfo();
      this.browser_info = this.UserLogsService.getbrowserInfo();
      this.ip_address = this.UserLogsService.getIpAddress();
       this.product_wishlist();
    }
    this.property_data = new Array<string>();
  }
   // fetch wishlist property 
  product_wishlist(){
    this.CommonService.getwishlit_property({ param: null }).subscribe(
      response => {
        this.property=response;
        this.wishlist_length=this.property.data.length;
        if(this.wishlist_length>0){
          for(let i=0; i<this.wishlist_length; i++){
            if(this.property.data[i].productdetails != null){
              if(this.property.data[i].productdetails.expected_pricing != null){
                let property_name:any=this.property.data[i].productdetails.build_name;
                let property_price:any=this.property.data[i].productdetails.expected_pricing;
                let property_type:any="property_sales";
                let property_uid:any=this.property.data[i].productdetails.product_uid;
                this.property_data.push({'name':property_name,'property_id':property_uid,'type':property_type,'price':property_price});
                }
                if(this.property.data[i].productdetails.expected_rent != null){
                  let property_name:any=this.property.data[i].productdetails.build_name;
                  let property_price:any=this.property.data[i].productdetails.expected_rent;
                  let property_type:any="property_rent";
                  let property_uid:any=this.property.data[i].productdetails.product_uid;
                  this.property_data.push({'name':property_name,'property_id':property_uid,'type':property_type,'price':property_price});
              }
            }
          }
          this.type = "wishlist_page";
          this.user_cart = this.property_data;
          let param={'userEmail':this.userEmail,'user_type':this.usertype,'device_info':this.device_info,'browser_info':this.browser_info,'ip_address':this.ip_address,'url_info':this.url_info,'type':this.type,'user_cart':this.user_cart,'input_info':this.input_info}
          this.UserLogsService.user_logs(param).subscribe(
            reponse => {
              // console.log(data.status);
            });
        }else{
          this.type = "wishlist_page";
          let param={'userEmail':this.userEmail,'user_type':this.usertype,'device_info':this.device_info,'browser_info':this.browser_info,'ip_address':this.ip_address,'url_info':this.url_info,'type':this.type,'user_cart':this.user_cart,'input_info':this.input_info}
          this.UserLogsService.user_logs(param).subscribe(
            reponse => {
              // console.log(data.status);
            });

        }
        this.showLoadingIndicator = false;
        this.wishlist_refresh();
        this.pro_comp_refresh();
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
        // this.toastr.error(Message, 'Something Error', {
        //   timeOut: 3000,
        // });
      }
    );
  }    
  // wishlist delete
  wishlist_remove(id: number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.wishlist_remove({param}).subscribe(
      response => {
        this.wishlist_length=0;
        this.property_data=[];
        this.product_wishlist();
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
        // this.toastr.error(Message, 'Something Error', {
        //   timeOut: 3000,
        // });
      }
     );
    }else{
      this.redirect_to_login();
    }
  } // property compare
  product_comp(id:number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.product_comp({param}).subscribe(
      response => {
        this.wishlist_length=0;
        this.product_copm=response;
        this.product_wishlist();
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
        // this.toastr.error(Message, 'Something Error', {
        //   timeOut: 3000,
        // });
      }
     );
    }else{
      this.redirect_to_login();
    }
  }
  
  // wishlist refreh functionalty 
  wishlist_refresh(){
    this.CommonService.emit<string>('true');
  } 
  // product comapre refresh function 
  pro_comp_refresh(){
    this.CommonService.pro_comp_emit<string>('true');
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
  
  navigate(id:number,name:string,city:string){
    const url:any = this.router.createUrlTree(['/product-details'],{queryParams:{'id':id,'name':name,'city':city}})
    window.open(url.toString(), '_blank')
  }
  redirect_to_login(): void {
    this.router.navigate(['/login'])
  }
  // carosule image
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    autoplay:true,
    autoplayHoverPause:true,
    navSpeed: 700,
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
        items: 1
      },
      1050: {
        items: 1
      }
    },
    nav: true
  }

}
