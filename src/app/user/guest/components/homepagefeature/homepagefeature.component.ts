import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';
import { IndexPageService } from '../../services/index-page.service';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/user/services/jwt.service';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { GtmserviceService } from '../../services/gtmservice.service';
import { UserLogsService } from '../../services/user-logs.service';

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
  public toll_free=environment.toll_free;
  public showLoadingIndicator:boolean= false;
  public product_length:number=0;
  public furnishing_type: any;
  public maintenance: any;
  public  property_data: any = [];

  constructor(
    private indexPageService: IndexPageService,
    private router:Router,
    private jwtService: JwtService,
    public CommonService:CommonService,
    private UserLogsService:UserLogsService,
    private gtmService: GtmserviceService,
    private toastr: ToastrService
    ) { 
      this.showLoadingIndicator= true;
    }

  ngOnInit(): void {
    this.showLoadingIndicator= true;
    this.feature_property(); 
    this.property_data = new Array<string>();
  }
  // fetch feature property 
  feature_property(){
    // this.showLoadingIndicator= true;
    if(this.jwtService.isTokenAvailable()){
      this.indexPageService.login_Feature_Property({ param: null }).subscribe(
      response => {
        //console.log(response);
        this.showLoadingIndicator= false;
        this.property=response;
        this.sendDataToGTM();
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
        // console.log(response);
        this.sendDataToGTM();
        this.product_length=this.property.data.length;
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
      }
     );
    }
  }
  product_comp_mobile(id:number){
    let param={id:id}
    if(this.jwtService.isTokenAvailable()){
      this.CommonService.product_comp_mobile({param}).subscribe(
      response => {
        this.product_copm=response;
        this.product_length=0;
        this.feature_property();
        if(this.product_copm.status==201){
          this.toastr.success('Property has added for comparison');
        }else{
          this.toastr.info("Oops you can't add more than 2 property in comparing list");
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
  
  sendDataToGTM()  {
    for(let i=0; i<this.property?.data?.data.length; i++){
      //  let data: {
      //     property_id:this.property?.data?.data?.product_id,
         
      //   },
      if(this.property?.data?.data[i]?.furnishing_status==1){
        this.furnishing_type='furnished';
      }else{
        this.furnishing_type='Not furnished';
      }
      if(this.property?.data?.data[i]?.maintenance_charge_condition != null){
        this.maintenance=this.property?.data?.data[i]?.maintenance_charge +'/'+ (this.property?.data?.data[i]?.maintenance_condition?.name);
      }else{
        this.maintenance='No';
      }
      this.property_data.push({
        'property_id':this.property?.data?.data[i]?.product_id,
        'property_name':this.property?.data?.data[i]?.build_name,
        'property_type':this.property?.data?.data[i]?.property__type?.name,
        'flat_type':this.property?.data?.data[i]?.pro_flat__type?.name ,
        'site_type':this.UserLogsService.getDeviceInfo(),
        'property_url':this.router.url,
        'available_form':this.property?.data?.data[i]?.available_for,
        'area':this.property?.data?.data[i]?.area,
        'area_unit':this.property?.data?.data[i]?.property_area_unit?.unit,
        'currency':'₹',
        'price':this.commaSeperated(this.property?.data?.data[i]?.expected_rent),
        'furnishing_type':this.furnishing_type,
        'maintance': this.maintenance,
        'page_name':'Home Page',
        'city_name':this.property?.data?.data[i]?.product_state?.state,
        'locality':this.property?.data?.data[i]?.product_locality?.locality,
        'sublocality':this.property?.data?.data[i]?.product_sub_locality?.sub_locality,
        
      });
      }    
    const data = {
      event: 'dataLayer',
      data: {
        data: this.property_data,
      },
      action: 'Onload Action',
      label: 'Home Page'
      // Additional data properties as needed
    };

    this.gtmService.pushToDataLayer(data);
    console.log(data);
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
    if(this.jwtService.isTokenAvailable()){
      this.CommonService.product_comp({param}).subscribe(
      response => {
        this.product_copm=response;
        this.product_length=0;
        this.feature_property();
        if(this.product_copm.status==201){
          this.toastr.success('Property has added for comparison');
        }else{
          this.toastr.info("Oops you can't add more than 4 property in comparing list");
        }
      }, err => { 
        this.showLoadingIndicator = false;
      }
     );
    }else{
      this.redirect_to_login();
    }
  }
  
  delete_comp(id:number):void{
    let param={id:id}
    if(this.jwtService.isTokenAvailable()){
    this.CommonService.pro_comp_delete(param).subscribe(
      response => {
        this.product_length=0;
        this.toastr.error('Property has removed from comparison');
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
  
  // wishlist add 
  wishlist_added(id: number){
    let param={id:id}
    if(this.jwtService.isTokenAvailable()){
      this.CommonService.wishlist_addd({param}).subscribe(
      response => {
        this.product_length=0;
         this.toastr.success('Property has added to favorite');
        this.feature_property();
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
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
    if(this.jwtService.isTokenAvailable()){
      this.CommonService.wishlist_remove({param}).subscribe(
      response => {
        this.product_length=0;
        this.toastr.error('Property has removed from favorite');
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
  
  navigate(id:number,name:string,city:string,locality:string,sublocality:string,flat_type:string){
    this.router.navigate(['/product-details'],{queryParams:{'id':id,'name':name,'city':city,'locality':locality,'sublocality':sublocality,'flat-type':flat_type}})
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
      690: {
        items: 2
      },
      740: {
        items: 2
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
