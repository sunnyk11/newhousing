import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductPageService } from '../../services/product-page.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/user/services/jwt.service';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  public product_details: any;
  public youtube_url: any;
  public safeURL: any;
  public product_data: any;
  public isReadMore: boolean = true;
  public ftpstring = environment.ftpURL;
  public property: any;
  public similar_property: any;
  public latCus: any;
  public longCus: any;
  public address: string = '';
  public product_images: any;
  public product_img_length: any;
  public imageObject: any=[];
  public showLoadingIndicator:boolean=false;
  public showLoadingIndicator1:boolean=true;
  public product_copm:any={};
  public isLoggedIn:boolean=false;
  public login_usertype:number = 0;
  public login_userid:number= 0;
  public product_length:number=0;
  public security_dep_amount:number=0;
  public total_amount_owner:number=0;
  public sectiondisplay:boolean=false;

  private e: any;
  private product_id: any;

  constructor(
    private _sanitizer: DomSanitizer,
     private route:ActivatedRoute,
     private ProductPageService: ProductPageService,
     private jwtService: JwtService,
     public CommonService:CommonService,
     private toastr: ToastrService,
     private router:Router
  ) {
    this.route.queryParams.subscribe((params) => {
      if(params.id != null){
        this.product_id=params.id;
        this.single_product_details(this.product_id);
      } else {
        this.redirect_to_home_page();
      }
    });
  }

  ngOnInit(): void {
  }
  // fetch amenties advance tab
  single_product_details(id: number) {
    this.sectiondisplay=false;
   this.showLoadingIndicator1 = true;
    let param = { id: id }
    this.showLoadingIndicator = true;
    if(this.jwtService.getToken()){
      this.recently_product_count(this.product_id);
      this.isLoggedIn= true;
      this.login_usertype = this.jwtService.getUserType();
      this.login_userid = this.jwtService.getUserId();
      this.ProductPageService.login_single_product_details(param).subscribe(
        response => {
          this.product_details=response;
          this.product_data=this.product_details.data;
          if(this.product_details.data.rent_availability ==1){
            this.security_dep_amount = Number(this.product_details.data.expected_rent) * Number(this.product_details.data.security_deposit);
            this.total_amount_owner =  Number(this.product_details.data.expected_rent) + Number(this.security_dep_amount) + Number(this.product_data.maintenance_charge);
          }
          if(this.product_details.data.sale_availability ==1){
            this.total_amount_owner =  Number(this.product_details.data.expected_pricing) + Number(this.product_data.maintenance_charge);
          }
          if(this.product_details.data != null){
            this.youtube_url = "https://www.youtube-nocookie.com/embed/" + this.product_data.video_link+"?playlist="+this.product_data.video_link+"&loop=1&mute=1";          
            this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.youtube_url);
            this.similarproperty(this.product_data.city);
            this.address=this.product_data.address;
            this.latCus=parseFloat(this.product_data.map_latitude);
            this.longCus=parseFloat(this.product_data.map_longitude);
            
            // slider functionalty
            this.product_images = this.product_data.product_img;
            this.product_img_length = this.product_data.product_img.length;
            if(this.product_img_length>0){
              for(let i=0;i<this.product_img_length; i++){
                this.imageObject.push({
                  image:this.ftpstring+this.product_images[i]["image"],
                  thumbImage:this.ftpstring+this.product_images[i]["image"],
                  title: this.product_data.build_name
              });
              }               
            }
            this.sectiondisplay=true;
           this.showLoadingIndicator1 = false;
          }else{
            this.redirect_to_home_page();
          }
        }, err => { 
        }
      );
    }else{
      this.ProductPageService.single_product_details(param).subscribe(
        response => {
          this.product_details=response;
          this.product_data=this.product_details.data;
          if(this.product_details.data.rent_availability ==1){
            this.security_dep_amount = Number(this.product_details.data.expected_rent) * Number(this.product_details.data.security_deposit);
            this.total_amount_owner =  Number(this.product_details.data.expected_rent) + Number(this.security_dep_amount) + Number(this.product_data.maintenance_charge);
          }
          if(this.product_details.data.sale_availability ==1){
            this.total_amount_owner =  Number(this.product_details.data.expected_pricing) + Number(this.product_data.maintenance_charge);
          }
          if(this.product_details.data != null){
            this.youtube_url = "https://www.youtube-nocookie.com/embed/" + this.product_data.video_link+"?playlist="+this.product_data.video_link+"&loop=1&mute=1";          
            this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.youtube_url);
            this.similarproperty(this.product_data.city);
            this.address=this.product_data.address;
            this.latCus=parseFloat(this.product_data.map_latitude);
            this.longCus=parseFloat(this.product_data.map_longitude);
            
            // slider functionalty
            this.product_images = this.product_data.product_img;
            this.product_img_length = this.product_data.product_img.length;
            if(this.product_img_length>0){
              for(let i=0;i<this.product_img_length; i++){
                this.imageObject.push({
                  image:this.ftpstring+this.product_images[i]["image"],
                  thumbImage:this.ftpstring+this.product_images[i]["image"],
                  title: this.product_data.build_name
              });
              }            
            }
            this.sectiondisplay=true;
           this.showLoadingIndicator1 = false;
          }else{
            this.redirect_to_home_page();
          }
        }, err => { 
        }
      );
    }
    this.wishlist_refresh();
    this.pro_comp_refresh();
  }
  // fetch similar property 
  similarproperty(cityname: any){
    this.showLoadingIndicator=true;
    let param={cityname:cityname}
    if(this.jwtService.getToken()){
      this.ProductPageService.login_getsimilarproperty(param).subscribe(
        response => {
          this.similar_property=response;
          this.showLoadingIndicator = false;
          this.product_length=this.similar_property.data.length;
          this.showLoadingIndicator=false;
        }, err => { 
        }
      );      
    }else{
      this.ProductPageService.getsimilarproperty(param).subscribe(
        response => {
          this.similar_property=response;
          this.showLoadingIndicator = false;
          this.product_length=this.similar_property.data.length;
          this.showLoadingIndicator=false;
        }, err => { 
        }
      );
    }
    this.wishlist_refresh();
    this.pro_comp_refresh();    
  }
  
  recently_product_count(id: any){
    let param={id:id}
    this.ProductPageService.recently_product(param).subscribe(
      data => {
      });
  }
  
  commaSeperated(e: any) {
    var t = (e = e ? e.toString() : "").substring(e.length - 3)
      , n = e.substring(0, e.length - 3);
    return "" !== n && (t = "," + t),
      n.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + t
  }
  // property compare
  product_comp(id:number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.product_comp({param}).subscribe(
      response => {
        this.product_copm=response;
        this.product_length=0;
        this.single_product_details(this.product_id);
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
        this.toastr.error(Message, 'Something Error', {
          timeOut: 3000,
        });
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
        this.toastr.success('Wishlist Successfully', 'Property', {
          timeOut: 3000,
        });
        this.single_product_details(this.product_id);
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
        this.toastr.error(Message, 'Something Error', {
          timeOut: 3000,
        });
      }
     );
    }else{
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
        this.toastr.error('Wishlist Removed', 'Property', {
          timeOut: 3000,
        });
        this.single_product_details(this.product_id);
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
        this.toastr.error(Message, 'Something Error', {
          timeOut: 3000,
        });
      }
     );
    }else{
      this.redirect_to_login();
    }
  }
  // wishlist delete
  wishlist_remove_similar(id: number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.wishlist_remove({param}).subscribe(
      response => {
        this.product_length=0;
        this.similarproperty(this.product_data.city);
      }, err => { 
        
      }
     );
    }else{
      this.redirect_to_login();
    }
  }
  // wishlist add 
  wishlist_added_similar(id: number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.wishlist_addd({param}).subscribe(
      response => {
        this.product_length=0;
        this.similarproperty(this.product_data.city);
      }, err => { 
       
      }
     );
    }else{
      this.redirect_to_login();
    }
  }
  // property compare
  product_comp_similar(id:number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.product_comp({param}).subscribe(
      response => {
        this.product_copm=response;
        this.product_length=0;
        this.similarproperty(this.product_data.city);
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
        
      }
     );
    }else{
      this.redirect_to_login();
    }
  }
  
  showText() {
    this.isReadMore = !this.isReadMore
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
      this.e = num;
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
  redirect_to_home_page(): void {
    this.router.navigate(['/'])
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

  proceedToPayment(productId:any) {
    this.router.navigate(['/product_payment_summary'], { queryParams: {'productID': productId } });
  }
  // carosule image
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
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
