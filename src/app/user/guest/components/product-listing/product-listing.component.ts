import { Component, OnInit } from '@angular/core';
import { ProductListingPageService } from '../../services/product-listing-page.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css']
})
export class ProductListingComponent implements OnInit {

  public displayStyle = "none";
  public amenties:any={};
  public property:any={};
  public property_length:number=0;
  public showLoadingIndicator:boolean= false;

  constructor(
    private ProductListingPageService: ProductListingPageService,
    private CommonService: CommonService
    ) { }

  ngOnInit(): void {
    this.getAmenities();
    this.getProperty_listing(); 
  }
  // fetch amenties advance tab
  getAmenities(){
    this.CommonService.getAmenities({ param: null }).subscribe(
      response => {
        console.log(response);
        this.amenties=response;
      }
    );
  }
  // fetch feature property 
  getProperty_listing(){
    this.showLoadingIndicator = true;
    this.ProductListingPageService.getProperty_listing({ param: null }).subscribe(
    response => {
      this.property=response;
      this.property_length=this.property.data.length;
      this.showLoadingIndicator = false;
    }
   );
  }
  openPopup(){
    this.displayStyle = "block";
  }  
  closePopup() {
    this.displayStyle = "none";
  }
}
