import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private CommonService:CommonService,
    private jwtService: JwtService,
    private router:Router,
    private toastr: ToastrService
    ) {   }

  ngOnInit(): void {
    this.product_comapre();
    this.getScreenSize();
  }
  getScreenSize(){
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <768){
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
        let Message =err.error.message;
        this.toastr.error(Message, 'Something Error', {
          timeOut: 3000,
        });
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
        this.toastr.error('Remove Compare Property','Property', {
          timeOut: 4000,
        });
        this.product_comapre();
        }, err => { 
          this.showLoadingIndicator = false;
          let Message =err.error.message;
          this.toastr.error(Message, 'Something Error', {
            timeOut: 3000,
          });
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

  navigate(id:number,name:string,city:string) {
    const url:any = this.router.createUrlTree(['/product-details'], {queryParams:{'id':id,'name':name,'city':city}})
    window.open(url.toString(), '_blank')
  }

  proceedToPayment(productId:any) {
    this.router.navigate(['/product_payment_summary'], { queryParams: {'productID': productId } });
  }

}
