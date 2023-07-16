import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserLogsService } from '../../services/user-logs.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  public amenties:any={};
  public property:any={};
  private e:any;
  public ftpstring=environment.ftpURL;
  public property_comp_length:number=0;
  public product_amenties:any=[];
  public unique_ameties:any=[];
  public filter_amenties:any=[];
  public amenitiesresult:any;
  public result:any=true;
  public screenWidth: number=0;
  public devicetype:number=0;
  public showLoadingIndicator:boolean=false;
  public product_length:number=0;
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
    private CommonService:CommonService,
    private jwtService: JwtService,
    private router:Router,
    private UserLogsService:UserLogsService,
    private toastr: ToastrService,
    private titleService: Title
    ) {   }

  ngOnInit(): void {
    this.titleService.setTitle('Compare');
    if(this.jwtService.isTokenAvailable()){
      this.userEmail =  this.jwtService.getUserEmail();
      this.usertype = this.jwtService.getUserType();
      this.jwtService.saveReturnURL(this.router.url);
      this.url_info= this.router.url;
      this.device_info = this.UserLogsService.getDeviceInfo();
      this.browser_info = this.UserLogsService.getbrowserInfo();
      this.ip_address = this.UserLogsService.getIpAddress();
      this.product_comapre();
      this.getScreenSize();
      this.property_data = new Array<string>();
    }
  }
  getScreenSize(){
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <950){
      this.devicetype=2;
    }else{
      this.devicetype=4;
    }
 }
   // fetch product compare property 
   product_comapre(){
    this.showLoadingIndicator = true;
    this.CommonService.getproduct_comp({ param: null }).subscribe(
      response => {
        this.property=response;
        this.property_comp_length=this.property.data.length;
        // user logs funtionalty
        if(this.property_comp_length>0){
          // loop start
          for(let i=0; i<this.property_comp_length; i++){
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
          this.type = "Product-comapare";
          this.user_cart = this.property_data;
          let param={'userEmail':this.userEmail,'user_type':this.usertype,'device_info':this.device_info,'browser_info':this.browser_info,'ip_address':this.ip_address,'url_info':this.url_info,'type':this.type,'user_cart':this.user_cart,'input_info':this.input_info}
          this.UserLogsService.user_logs(param).subscribe(
            reponse => {
              // console.log(data.status);
            });
          }
        if(this.property_comp_length<2){
          this.toastr.warning('Comparision Minimun Two','Property', {
            timeOut: 3000,
          });
          this.redirect_to_home_page();
        }
        this.product_amenties=[];
          for(let i=0;i<this.property_comp_length;i++){
            if(i<this.devicetype){
              for(let j=0;j<this.property.data[i].amenities.length;j++){
                this.product_amenties.push(this.property.data[i].amenities[j].amenties);
              }
            }
          }
          const expected = new Set();
          const unique = this.product_amenties.filter((item: any) => !expected.has(JSON.stringify(item)) ? expected.add(JSON.stringify(item)) : false);
          this.unique_ameties=unique;
          this.product_amenities();
        this.showLoadingIndicator = false;
      }
    );
    // this.wishlist_refresh();
    this.pro_comp_refresh();
  } 
  
  product_amenities(): void{
    this.CommonService.getAmenities({ param: null }).subscribe(
      response => {
        this.amenties=response;
        this.filter_amenties=[];
        for(let i=0; i<this.amenties?.data.length;i++){
          if (this.filter_amenties_fun(this.amenties?.data[i].id)) {
            this.filter_amenties.push(this.amenties?.data[i]);
          }
        }
        if(this.filter_amenties.length >0){
          this.amenitiesresult = this.filter_amenties;
        }else{
          this.amenitiesresult=[];
        }
      }, err => { 
        this.showLoadingIndicator = false;
      }
    );    
  }
  filter_amenties_fun(amenties_id:any){
    if(this.unique_ameties.length >0){
      for (let i=0; i<this.unique_ameties.length; i++) {
        if(this.unique_ameties[i]==amenties_id){
          this.result==true;
            return this.result;
        }
      }
    }
  }
  Amenties_funtion(Amenties_id:any,pro_id: any){
    if(this.property_comp_length >= 1){
      for (let i = 0; i < this.property_comp_length; i++) {
        if(this.property?.data[i].product_id==pro_id){
          for(let j=0;j< this.property?.data[i].amenities.length; j++){
            if(Amenties_id==this.property?.data[i].amenities[j].amenties){
              this.result==true;
              return  this.result;
            }
          }
        }
      }
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
  
  delete_comp(id:number):void{
    let param={id:id}
    this.CommonService.pro_comp_delete(param).subscribe(
      response => {
        this.property_comp_length=0;
        this.property_data=[];
        this.toastr.error('Property has removed from comparison');
        this.product_comapre();
        }, err => { 
          this.showLoadingIndicator = false;
          let Message =err.error.message;
         
        }
      );
  }
  redirect_to_login(): void {
    this.router.navigate(['/login'])
  }
  
  redirect_to_home_page(): void {
    this.router.navigate(['/'])
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

  navigate(id:number,locality:string,sublocality:string,flat_type:string ){
    const url:any = this.router.createUrlTree(['/product-details'],{queryParams:{'id':id,'locality':locality,'sublocality':sublocality,'flat-type':flat_type}})
    const encodedUrl = url.toString().replace(/ /g, '%20');

  // Replace "&" with "%26"
  const finalUrl = encodedUrl.toString().replace(/&/g, '%26');

    window.open(finalUrl, '_self')
  }

  proceedToPayment(productId:any) {
    this.router.navigate(['/product_payment_summary'], { queryParams: {'productID': productId } });
  }

}
