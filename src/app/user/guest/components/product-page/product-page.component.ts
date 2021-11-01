import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductPageService } from '../../services/product-page.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit{

  public product_id:number=0;
  public product_details:any;
  public e:any;
  public youtube_url: any;
  public safeURL:any;
  public product_data:any;
  public isReadMore :boolean=true;
  public ftpstring=environment.ftpURL;
  public property:any;
  public similar_property:any;
  public latCus:any;
  public longCus:any;
  public address:string='';
  public product_images: any;
  public product_img_length: any;
  public imageObject: any=[];
  public showLoadingIndicator:boolean=false;

  constructor(
    private _sanitizer: DomSanitizer,
     private route:ActivatedRoute,
     private ProductPageService: ProductPageService,
  ) {
    this.route.queryParams.subscribe((params) => {
        this.product_id=params.id;
    });
    this.single_product_details(this.product_id);
    console.log(this.ftpstring);
   }

  ngOnInit(): void {
  }
  // fetch amenties advance tab
  single_product_details(id:number){
    let param={id:id}
    this.showLoadingIndicator = true;
    this.ProductPageService.single_product_details(param).subscribe(
      response => {
        this.product_details=response;
        this.product_data=this.product_details.data;
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
       this.showLoadingIndicator = false;
      }
    );
  }
  // fetch similar property 
  similarproperty(cityname: any){
    let param={cityname:cityname}
    this.ProductPageService.getsimilarproperty(param).subscribe(
      response => {
        this.similar_property=response;
      }
    );
  }
  // property compare
  product_comp(id:number){}
  
  // wishlist add 
  wishlist_added(data: any){
    console.log(data);
  }

  // wishlist delete
  Wishlist_remove(data: any){}
  
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
      this.e=num;
      var t = (this.e = this.e ? this.e.toString() : "").substring(this.e.length - 3)
      , n = this.e.substring(0, this.e.length - 3);
      return "" !== n && (t = "," + t),
      n.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + t
    }
    return num;
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
