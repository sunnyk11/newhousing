import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-featured-property',
  templateUrl: './featured-property.component.html',
  styleUrls: ['./featured-property.component.css']
})
export class FeaturedPropertyComponent implements OnInit {

  public pro_featured:any={};
  public ftpstring=environment.ftpURL;
  private e:any;

  constructor(
    private CommonService: CommonService
    ) { }

  ngOnInit(): void {
    this.Featuredproduct();
  }
  
  // fetch productcategory advance tab
  Featuredproduct(){
    this.CommonService.getFeaturedproduct({ param: null }).subscribe(
      response => {
        this.pro_featured=response;
      }
    );
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
   featured_property: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    autoplay:true,
    dots: true,
    navSpeed: 500,
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
