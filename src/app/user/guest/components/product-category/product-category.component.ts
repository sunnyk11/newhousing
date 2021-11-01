import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  
  public category:any={};

  constructor(
    private CommonService: CommonService
    ) { }

  ngOnInit(): void {
    this.productcategory();
  }
  // fetch productcategory advance tab
  productcategory(){
    this.CommonService.getproductcategory({ param: null }).subscribe(
      response => {
        this.category=response;
      }
    );
  } 
  

}
