import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private jwtService: JwtService,
    private CommonService:CommonService,
    private toastr: ToastrService,
    private router:Router
    ) {
        if(!this.jwtService.getToken()){
          this.redirect_to_login();
        } 
      }

  ngOnInit(): void {
    if(this.jwtService.getToken()){
       this.product_wishlist();
    }
  }
   // fetch wishlist property 
  product_wishlist(){
    this.showLoadingIndicator = true;
    this.CommonService.getwishlit_property({ param: null }).subscribe(
      response => {
        this.property=response;
        this.wishlist_length=this.property.data.length;
        this.showLoadingIndicator = false;
        this.wishlist_refresh();
        this.pro_comp_refresh();
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
        this.product_wishlist();
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
