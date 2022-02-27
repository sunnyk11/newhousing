import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ProductPageService } from '../../services/product-page.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { JwtService } from 'src/app/user/services/jwt.service';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { UserReviewModalComponent } from '../../modals/user-review-modal/user-review-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';

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
  public google_map_url=environment.google_map_url;
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
  public permissions_response: any;
  public access_property_location: boolean = false;
  public access_other_details: boolean = false;
  public order_status:any;
  
  public locality_id:any;
  private product_id: any;
  public address_details:string = '';
  public map:any;
  constructor(
    private _sanitizer: DomSanitizer,
     private route:ActivatedRoute,
     private ProductPageService: ProductPageService,
     private jwtService: JwtService,
     public CommonService:CommonService,
     private modalService: NgbModal,
     private toastr: ToastrService,
     private clipboardApi: ClipboardService,
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
    // this.sectiondisplay=false;
  //  this.showLoadingIndicator1 = true;
    let param = { id: id }
    // this.showLoadingIndicator = true;
    if(this.jwtService.getToken()){
      this.recently_product_count(this.product_id);
      this.isLoggedIn= true;
      this.login_usertype = this.jwtService.getUserType();
      this.login_userid = this.jwtService.getUserId();
      if(this.login_usertype == 11){
        this.access_property_location=true;
        this.access_other_details=true;
      }
      if(this.jwtService.get_Internal_User()== '"Yes"'){
        this.CommonService.getUserPermissions(this.login_userid).subscribe(
          response => {
            let  response_data:any=response;
            this.permissions_response = response_data.permissions;
            this.access_property_location = this.permissions_response.includes('access_property_location');
            this.access_other_details = this.permissions_response.includes('access_other_details');
          });
        }
      this.ProductPageService.login_single_product_details(param).subscribe(
        response => {
          this.product_details=response;
          this.product_data=this.product_details.data;
          this.order_status=this.product_data?.order_status;
          if(this.product_details.data != null){
            // this.youtube_url = environment.you_tube_url + this.product_data.video_link+"?playlist="+this.product_data.video_link+"&loop=1&mute=1";          
            // this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.youtube_url);
            this.locality_id=this.product_data.locality_id;
            this.similarproperty(this.product_data.locality_id);
            this.address=this.product_data.address;
            this.address_details=this.product_data.address_details;
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
            if(this.product_details.data.rent_availability ==1){
              this.security_dep_amount = Number(this.product_details.data.expected_rent) * Number(this.product_details.data.security_deposit);
              this.total_amount_owner =  Number(this.product_details.data.expected_rent) + Number(this.security_dep_amount) + Number(this.product_data.maintenance_charge);
            }
            if(this.product_details.data.sale_availability ==1){
              this.total_amount_owner =  Number(this.product_details.data.expected_pricing) + Number(this.product_data.maintenance_charge);
            }
            this.sectiondisplay=true;
           this.showLoadingIndicator1 = false;
          }else{
            this.redirect_to_home_page();
          }
        }, err => { 
        }
      );
      this.wishlist_refresh();
      this.pro_comp_refresh();
    }else{
      this.ProductPageService.single_product_details(param).subscribe(
        response => {
          this.product_details=response;
          this.product_data=this.product_details.data;
          this.order_status=this.product_data?.order_status;
          if(this.product_details.data != null){
            // this.youtube_url = environment.you_tube_url + this.product_data.video_link+"?playlist="+this.product_data.video_link+"&loop=1&mute=1";          
            // this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.youtube_url);
            this.similarproperty(this.product_data.locality_id);
            this.address=this.product_data.address;
            // this.latCus=parseFloat(this.product_data.map_latitude);
            // this.longCus=parseFloat(this.product_data.map_longitude);
            
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
            if(this.product_details.data.rent_availability ==1){
              this.security_dep_amount = Number(this.product_details.data.expected_rent) * Number(this.product_details.data.security_deposit);
              this.total_amount_owner =  Number(this.product_details.data.expected_rent) + Number(this.security_dep_amount) + Number(this.product_data.maintenance_charge);
            }
            if(this.product_details.data.sale_availability ==1){
              this.total_amount_owner =  Number(this.product_details.data.expected_pricing) + Number(this.product_data.maintenance_charge);
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
  }
  // fetch similar property 
  similarproperty(locality_id: any){
    this.showLoadingIndicator=false;
    let param={locality_id:locality_id}
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
      this.wishlist_refresh();
      this.pro_comp_refresh();        
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
        this.similarproperty(this.locality_id);
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
        this.similarproperty(this.locality_id);
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
        this.similarproperty(this.locality_id);
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
  copyText(type:any,create:any,id:any) {
  let product_id:any=type+create+id;
    this.clipboardApi.copyFromContent(product_id);
    this.toastr.info('Property Id Coppy');
  }
  onMapReady(map: any) {
    this.map = map;
    this.map.setOptions({
      mapTypeControl: 'true',
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'hybrid'],
        position: google.maps.ControlPosition.TOP_LEFT,
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
      },
      fullscreenControl: true,
      streetViewControl: true
  });
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
  user_reviews(){
  const modalRef = this.modalService.open(UserReviewModalComponent,
    {
      scrollable: true,
      windowClass: 'myCustomModalClass',
      // keyboard: false,
      backdrop: 'static'
    });
    
    let data = {
      product_id: this.product_id,
      userid:this.login_userid
    }
    modalRef.componentInstance.data = data;
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
