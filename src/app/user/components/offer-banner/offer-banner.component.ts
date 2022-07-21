import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../guest/services/common.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-offer-banner',
  templateUrl: './offer-banner.component.html',
  styleUrls: ['./offer-banner.component.css']
})
export class OfferBannerComponent implements OnInit {

  public show_offer_banner1:boolean=false;
  public show_offer_banner2:boolean=false;
  public show_offer_banner3:boolean=false;
  public show_offer_banner4:boolean=false;
  public offer_data:any;
  public subscribeTimer:any;
  public timeLeft:any;
  public active2:boolean=false;
  public active3:boolean=false;
  public active4:boolean=false;

  constructor(
    private commonService: CommonService,) { }

  ngOnInit(): void {
    this.banner_details();
  }
  banner_details(){
    this.commonService.getoffer_banner().pipe().subscribe(
      data => {
        let result:any=data;
        this.offer_data=result.data;
        if(result.data.data.length>0){
          for(let i=0; i<result.data.data.length; i++){
            if(i==0){
              this.show_offer_banner1=true;
            }if(i==1){
              this.show_offer_banner2=true;
            }if(i==2){
              this.show_offer_banner3=true;
            }if(i==3){
              this.show_offer_banner4=true;
            }
  
          }
        }
       
      },err => {
          // this.showLoadingIndicator = false;
          console.log(err);
        }
      );
  }
  closed1(){
    this.show_offer_banner1=false;
    if(this.show_offer_banner2==true){
       this.active2=true;
    }else if(this.show_offer_banner3==true){
      this.active3=true;
    }else if(this.show_offer_banner4==true){
      this.active4=true;
    }else{}
  }
  closed2(){
    this.show_offer_banner2=false;
    if(this.show_offer_banner3==true &&  this.show_offer_banner1==false){
      this.active3=true;
    }else if(this.show_offer_banner4==true &&  this.show_offer_banner1==false){
      this.active4=true;
    }else{}
  }
  closed3(){
    this.show_offer_banner3=false;
    if(this.show_offer_banner2==true &&  this.show_offer_banner1==false){
      this.active3=true;
    }else if(this.show_offer_banner4==true &&  this.show_offer_banner1==false){
      this.active4=true;
    }else{}
  }
  closed4(){
    this.show_offer_banner4=false;
    if(this.show_offer_banner2==true &&  this.show_offer_banner1==false){
      this.active3=true;
    }else if(this.show_offer_banner3==true &&  this.show_offer_banner1==false){
      this.active4=true;
    }else{}
  }

}
