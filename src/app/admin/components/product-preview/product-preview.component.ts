import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ProductPageService } from 'src/app/user/guest/services/product-page.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { JwtService } from 'src/app/user/services/jwt.service';
import { CommonService } from 'src/app/user/guest/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.css']
})
export class ProductPreviewComponent implements OnInit {

   
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
    if(this.jwtService.getAdminToken()){
      this.isLoggedIn= true;
      this.login_userid = this.jwtService.getAdminId();
      this.login_usertype = this.jwtService.getUserType();
      this.ProductPageService.admin_single_product_details(param).subscribe(
        response => {
          this.product_details=response;
          this.product_data=this.product_details.data;
          if(this.product_details.data != null){
            this.youtube_url = environment.you_tube_url + this.product_data.video_link+"?playlist="+this.product_data.video_link+"&loop=1&mute=1";          
            this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.youtube_url);
            this.locality_id=this.product_data.locality_id;
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
    }
    this.wishlist_refresh();
    this.pro_comp_refresh();
  }
  
  redirect_to_home_page(): void {
    this.router.navigate(['/admin'])
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
  
  commaSeperated(e: any) {
    var t = (e = e ? e.toString() : "").substring(e.length - 3)
      , n = e.substring(0, e.length - 3);
    return "" !== n && (t = "," + t),
      n.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + t
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
  
  showText() {
    this.isReadMore = !this.isReadMore
  }
  copyText(type:any,create:any,id:any) {
  let product_id:any=type+create+id;
    this.clipboardApi.copyFromContent(product_id);
    this.toastr.info('Property Id Coppy');
  }


}
