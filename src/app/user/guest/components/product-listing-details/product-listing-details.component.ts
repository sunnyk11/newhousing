import { Component, OnInit, Input } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-listing-details',
  templateUrl: './product-listing-details.component.html',
  styleUrls: ['./product-listing-details.component.css']
})
export class ProductListingDetailsComponent implements OnInit {
  
  @Input() property:any;
  public e:any;
  public p:any;
  public ftpstring=environment.ftpURL;

  constructor() { }

  ngOnInit(): void {
  }
  
  // property compare
  product_comp(id:number){}
  
  // wishlist add 
  wishlist_added(data: any){
    console.log(data);
  }

  // wishlist delete
  Wishlist_remove(data: any){}
  
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
