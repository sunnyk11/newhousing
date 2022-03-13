import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recently-viewed-product',
  templateUrl: './recently-viewed-product.component.html',
  styleUrls: ['./recently-viewed-product.component.css']
})
export class RecentlyViewedProductComponent implements OnInit {

  public product:any={};
  public ftpstring=environment.ftpURL;
  private e:any;
  public Recent_user_length:number=0;
  public LoggedIn :boolean=false;

  constructor(
    private CommonService: CommonService,
    private router:Router,
    private jwtService: JwtService
    ) { }

  ngOnInit(): void {
    if(this.jwtService.getToken()){
      this.LoggedIn = true;
     this.getrecently_product();
    }
  }
  // fetch recently advance tab
  getrecently_product(){
    this.CommonService.getrecently_product({ param: null }).subscribe(
      response => {
        this.product=response;
        console.log(this.product);
        this.Recent_user_length=this.product.data.length;
      }, err => { 
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
  
  navigate(id:number,name:string,city:string){
    const url:any = this.router.createUrlTree(['/product-details'],{queryParams:{'id':id,'name':name,'city':city}})
    window.open(url.toString(), '_blank')
  }  

}
